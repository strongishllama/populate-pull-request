import { Tag } from "./tag";

export function write(tags: Tag[], data: string): string {
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
