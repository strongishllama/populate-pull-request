"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.write = void 0;
function write(tags, data) {
    const lines = data.split("\n");
    for (let i = 0; i < lines.length; i++) {
        tags.forEach((t) => {
            if (`- [${t.key}]()` === lines[i]) {
                lines[i] = `- [${t.key}](${t.value})`;
            }
        });
    }
    let populatedData = "";
    for (let i = 0; i < lines.length; i++) {
        if (lines[i] != "") {
            populatedData += `${lines[i]}\n`;
            continue;
        }
        if (i < lines.length - 1) {
            populatedData += "\n";
        }
    }
    return populatedData;
}
exports.write = write;
