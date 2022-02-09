"use strict";
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
exports.Client = void 0;
const github_1 = require("@actions/github/lib/github");
const event_1 = require("./event");
class Client {
    constructor(token) {
        this.github = (0, github_1.getOctokit)(token);
    }
    isPullRequest() {
        return github_1.context.eventName === event_1.Event.PULL_REQUEST || github_1.context.eventName === event_1.Event.PULL_REQUEST_TARGET;
    }
    getPullRequest() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.github.rest.pulls.get({
                owner: github_1.context.repo.owner,
                repo: github_1.context.repo.repo,
                pull_number: this.pullRequestNumber(),
            })).data;
        });
    }
    pullRequestNumber() {
        if (github_1.context.eventName != event_1.Event.PULL_REQUEST && github_1.context.eventName != event_1.Event.PULL_REQUEST_TARGET) {
            return 0;
        }
        const parts = github_1.context.ref.split("/");
        if (parts.length != 4) {
            return 0;
        }
        return parseInt(parts[2]);
    }
    updatePullRequest(pullRequest) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            yield this.github.rest.pulls.update({
                owner: github_1.context.repo.owner,
                repo: github_1.context.repo.repo,
                pull_number: pullRequest.number,
                body: (_a = pullRequest.body) !== null && _a !== void 0 ? _a : "",
            });
        });
    }
}
exports.Client = Client;
