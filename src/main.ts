import * as core from '@actions/core';
import * as toolCache from '@actions/tool-cache';
import * as exec from '@actions/exec';
import * as YAML from 'yamljs';

async function run(): Promise<void> {
    try {
        // const version = core.getInput('terraform_version').length > 0 ? core.getInput('terraform_version') : '1.4.4';
        const version = '1.4.4';

        await toolCache.extractZip(await toolCache.downloadTool(`https://releases.hashicorp.com/terraform/${ version }/terraform_${ version }_linux_amd64.zip`), '/tmp');

        let initVars: string[] = [];
        let applyVars: string[] = [];

        if (core.getInput('init')) {
            initVars = YAML.parse(core.getInput('init'));
        }

        await exec.exec('/tmp/terraform', [ 'init', ...initVars ]);

        if (core.getInput('apply')) {
            const apply = YAML.parse(core.getInput('apply'));
            for (let k in apply) {
                applyVars.push(`-var=${ JSON.stringify(apply[ k ]) }`);
            }
        }

        core.debug(JSON.stringify(applyVars));

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
