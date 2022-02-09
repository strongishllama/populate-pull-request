"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tag = exports.Key = void 0;
var Key;
(function (Key) {
    Key["JIRA_ISSUE"] = "Jira Issue";
})(Key = exports.Key || (exports.Key = {}));
class Tag {
    constructor(key, value = "") {
        this.key = key;
        this.value = value;
    }
}
exports.Tag = Tag;
