import { Tag } from "./tag";

export function write(tags: Tag[], data: string): string {
  const lines = data.split("\n");

  for (let i = 0; i < lines.length; i++) {
    for (const tag of tags) {
      if (`- [${tag.key}]()` === lines[i]) {
        lines[i] = `- [${tag.key}](${tag.value})`;
      }
    }
  }

  let populatedData = "";

  for (let i = 0; i < lines.length; i++) {
    if (lines[i] !== "") {
      populatedData += `${lines[i]}\n`;
      continue;
    }

    if (i < lines.length - 1) {
      populatedData += "\n";
    }
  }

  return populatedData;
}
