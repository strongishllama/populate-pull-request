import { END_TAG, START_TAG } from "./constants";
import { Tag } from "./tag";

export function read(data: string): Tag[] {
  // Split the data into lines and find the line index of the start and end tags.
  const lines = data.split("\n");
  let startTagIndex = -1;
  let endTagIndex = -1;

  for (let i = 0; i < lines.length; i++) {
    console.debug(lines[i]);
    console.debug(START_TAG);
    console.debug(lines[i] === START_TAG);
    if (lines[i] === START_TAG) {
      startTagIndex = i;
    } else if (lines[i] === END_TAG) {
      endTagIndex = i;
    }
  }

  // Validate the indexes.
  if (startTagIndex === -1) {
    throw new Error(`Start tag ${START_TAG} was not found in:\n${data}`);
  }
  if (endTagIndex === -1) {
    throw new Error(`End tag ${END_TAG} was not found in:\n${data}`);
  }
  if (endTagIndex < startTagIndex) {
    throw new Error(`End tag ${END_TAG} was found before the start tag ${START_TAG}`);
  }

  // Find the lines with empty tags, e.g '- [Foo]()'
  const rawTags: string[] = [];
  for (let i = startTagIndex + 1; i < endTagIndex; i++) {
    if (!new RegExp(/[-][\s][[].+[\]][(][)]/).test(lines[i])) {
      continue;
    }

    rawTags.push(lines[i]);
  }

  // Build the tags objects from the raw tags.
  const tags: Tag[] = [];
  for (let rawTag of rawTags) {
    rawTag = rawTag.replace("- [", "");
    tags.push(new Tag(rawTag.replace("]()", "")));
  }

  return tags;
}
