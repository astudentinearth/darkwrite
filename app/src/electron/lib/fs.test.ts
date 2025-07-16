import { vol } from "memfs";
import { rmIfExists } from "./fs";
import fse from "fs-extra";
import path from "node:path";

beforeEach(() => {
  vol.fromJSON({});
});

afterEach(() => {
  vol.reset();
});

//FIXME: Relies on fse.pathExists which is not properly mocked
it.skip("should remove a file system entry if it exists", async () => {
  console.log(vol.readdirSync("/"));
  vol.writeFileSync(path.resolve("/test.txt"), "hello");
  vol.writeFileSync(path.resolve("/should_stay.txt"), "hello");
  console.log(vol.readdirSync("/"));
  await rmIfExists("/test.txt");
  console.log(vol.readdirSync("/"));
  expect(!(await fse.exists(path.resolve("/test.txt"))));
  expect(await fse.exists(path.resolve("/should_stay.txt")));
});
