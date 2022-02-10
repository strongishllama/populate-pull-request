import { Tag } from "./tag";
import { START_TAG, END_TAG } from "./constants";

export function read(data: string): Tag[] {
  // Split the data into lines and find the line index of the start and end tags.
  const lines = data.split("\n");
  let startTagIndex = -1;
  let endTagIndex = -1;

  lines.forEach((line, index) => {
    if (line === START_TAG) {
      startTagIndex = index;
    } else if (line === END_TAG) {
      endTagIndex = index;
    }
  });

  // Validate the indexes.
  if (startTagIndex === -1) {
    throw new Error(`Start tag ${START_TAG} was not found`);
  }
  if (endTagIndex === -1) {
    throw new Error(`End tag ${END_TAG} was not found`);
  }
  if (endTagIndex < startTagIndex) {
    throw new Error(`End tag ${END_TAG} was found before the start tag ${START_TAG}`);
  }

  // Find the lines with empty tags, e.g '- [Foo]()'
  const rawTags: string[] = [];
  for (let i = startTagIndex; i < endTagIndex; i++) {
    if (!new RegExp("[-][s][[].+[]][(][)]").test(lines[i])) {
      continue;
    }

    rawTags.push(lines[i]);
  }

  // Build the tags objects from the raw tags.
  const tags: Tag[] = [];
  rawTags.forEach((rt) => {
    rt = rt.replace("- [", "");
    tags.push(new Tag(rt.replace("] ()", "")));
  });

  return tags;
}
