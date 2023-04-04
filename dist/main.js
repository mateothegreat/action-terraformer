"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const toolCache = __importStar(require("@actions/tool-cache"));
const exec = __importStar(require("@actions/exec"));
const YAML = __importStar(require("yamljs"));
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield toolCache.extractZip(yield toolCache.downloadTool(`https://releases.hashicorp.com/terraform/${core.getInput('terraform_version')}/terraform_${core.getInput('terraform_version')}_linux_amd64.zip`), '/tmp');
            let initVars = [];
            let applyVars = [];
            if (core.getInput('init')) {
                initVars = YAML.parse(core.getInput('init'));
            }
            yield exec.exec('/tmp/terraform', ['init', ...initVars]);
            if (core.getInput('apply')) {
                const apply = YAML.parse(core.getInput('apply'));
                for (let k in apply) {
                    applyVars.push(`-var=${JSON.stringify(apply[k])}`);
                }
            }
            core.debug(JSON.stringify(applyVars));
            try {
                yield exec.exec('/tmp/terraform', [
                    'apply',
                    '-auto-approve',
                    ...applyVars
                ]);
            }
            catch (e) {
                core.setFailed(e);
            }
        }
        catch (error) {
            core.setFailed(error.message);
        }
    });
}
void run();