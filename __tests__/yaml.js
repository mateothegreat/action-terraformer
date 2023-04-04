const YAML = require('yamljs');

const args = YAML.parse(`
a:
    b: 1
    c: 2
d: e`);

console.log(args);

for(let k in args) {

    console.log(k);
}
