import * as process from 'process';
import * as cp from 'child_process';
import * as path from 'path';

test('throws invalid number', async () => {
    const input = parseInt('foo', 10);
    // await expect(1).rejects.toThrow('milliseconds not a number');
});

// shows how the runner will run a javascript action with env / stdout protocol
test('test runs', () => {
    process.env['INPUT_MILLISECONDS'] = '500';
    process.env['KUBERNETES_ENVIRONMENT_VARIABLES'] = JSON.stringify([
        {
            a: 1
        },
        {
            b: 'bar'
        }
    ]);
    const np = process.execPath;
    const ip = path.join(__dirname, '..', 'lib', 'main.js');
    const options: cp.ExecFileSyncOptions = {
        env: process.env
    };

    console.log(cp.execFileSync(np, [ip], options).toString());
});
