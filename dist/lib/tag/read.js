"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.read = void 0;
const tag_1 = require("./tag");
const constants_1 = require("./constants");
function read(data) {
    // Split the data into lines and find the line index of the start and end tags.
    const lines = data.split("\n");
    let startTagIndex = -1;
    let endTagIndex = -1;
    lines.forEach((line, index) => {
        if (line === constants_1.START_TAG) {
            startTagIndex = index;
        }
        else if (line === constants_1.END_TAG) {
            endTagIndex = index;
        }
    });
    // Validate the indexes.
    if (startTagIndex === -1) {
        throw new Error(`Start tag ${constants_1.START_TAG} was not found`);
    }
    if (endTagIndex === -1) {
        throw new Error(`End tag ${constants_1.END_TAG} was not found`);
    }
    if (endTagIndex < startTagIndex) {
        throw new Error(`End tag ${constants_1.END_TAG} was found before the start tag ${constants_1.START_TAG}`);
    }
    // Find the lines with empty tags, e.g '- [Foo]()'
    const rawTags = [];
    for (let i = startTagIndex; i < endTagIndex; i++) {
        if (!new RegExp("[-][s][[].+[]][(][)]").test(lines[i])) {
            continue;
        }
        rawTags.push(lines[i]);
    }
    // Build the tags objects from the raw tags.
    const tags = [];
    rawTags.forEach((rt) => {
        rt = rt.replace("- [", "");
        tags.push(new tag_1.Tag(rt.replace("] ()", "")));
    });
    return tags;
}
exports.read = read;
