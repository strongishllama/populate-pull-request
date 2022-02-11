import * as fs from "fs";
import * as path from "path";
import { expect, test } from "@jest/globals";
import { write, Tag } from "../../src/tag";

test("reads all tags", () => {
  const want = fs.readFileSync(path.join(__dirname, "/test-data/write.md")).toString();
  const got = write([new Tag("Test Key", "Test Value")], fs.readFileSync(path.join(__dirname, "/test-data/read.md")).toString());

  expect(got).toEqual(want);
});
