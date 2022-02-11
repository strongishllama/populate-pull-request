import * as fs from "fs";
import * as path from "path";
import { expect, test } from "@jest/globals";
import { read, Tag } from "../../src/tag";

test("reads all tags", () => {
  const want = [new Tag("Test Key")];
  const got = read(fs.readFileSync(path.join(__dirname, "/test-data/read.md")).toString());

  expect(got.sort()).toEqual(want.sort());
});
