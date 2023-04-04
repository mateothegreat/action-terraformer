import * as core from '@actions/core';
import * as toolCache from '@actions/tool-cache';
import * as exec from '@actions/exec';
import * as YAML from 'yamljs';

async function run(): Promise<void> {
    try {
        let env;
        const version = process.env.GITHUB_REF.match(/^refs\/([\w]+)\/(.*)$/)[ 2 ];

        await toolCache.extractZip(await toolCache.downloadTool(`https://releases.hashicorp.com/terraform/${ core.getInput('terraform_version') }/terraform_${ core.getInput('terraform_version') }_linux_amd64.zip`), '/tmp');

        if (core.getInput('env')) {
            env = JSON.stringify(YAML.parse(core.getInput('env')));
        }

        let initVars: string[] = [];

        if (core.getInput('init')) {
            initVars = YAML.parse(core.getInput('init'));
        }

        await exec.exec('/tmp/terraform', [ 'init', ...initVars ]);

        const applyVars = [
            `-var=version=${ version }`,
            `-var=env=${ env }`
        ];

        try {
            await exec.exec('/tmp/terraform',
                [
                    'apply',
                    '-auto-approve',
                    ...applyVars
                ]
            );
        } catch (e) {
            core.setFailed(e);
        }
    } catch (error) {
        core.setFailed(error.message);
    }
}

void run();
