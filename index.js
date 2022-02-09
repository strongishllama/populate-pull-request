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
const action = __importStar(require("./lib/action"));
const jira_1 = require("./lib/jira");
const tag_1 = require("./lib/tag");
function run() {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        const client = new action.Client(core.getInput("github-token"));
        if (!client.isPullRequest()) {
            console.error("This action can only be run on pull requests.");
            return;
        }
        const pullRequest = yield client.getPullRequest();
        const tags = (0, tag_1.read)((_a = pullRequest.body) !== null && _a !== void 0 ? _a : "");
        if (tags.length === 0) {
            console.log("No tags found in this pull request body.");
            return;
        }
        let jiraClient = new jira_1.Client(core.getInput("jira-api-token"), core.getInput("jira-domain-name"));
        for (let i = 0; i < tags.length; i++) {
            switch (tags[i].key) {
                case tag_1.Key.JIRA_ISSUE:
                    const matches = pullRequest.title.match(new RegExp("[A-Z]+-[0-9]+"));
                    if (matches === null || matches.length === 0) {
                        throw new Error("Unable to find Jira issue key in pull request title");
                    }
                    const issue = yield jiraClient.getIssue(matches[0]);
                    tags[i].value = `${jiraClient.baseUrl}/browse/${issue.key}`;
                    break;
                default:
                    throw new Error(`Unknown tag key found: ${tags[i].key}`);
            }
        }
        pullRequest.body = (0, tag_1.write)(tags, (_b = pullRequest.body) !== null && _b !== void 0 ? _b : "");
        client.updatePullRequest(pullRequest);
    });
}
run();
