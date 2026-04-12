import { mkdirSync, readdirSync, rmSync, unlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

// Clean up any test databases after tests run
const tmp = tmpdir();
readdirSync(tmp)
  .filter((f) => f.startsWith(".dwtest-"))
  .forEach((f) => unlinkSync(join(tmp, f)));


vi.mock("@electron-toolkit/utils", () => ({
  is: {
    dev: true,
  },
}));

vi.mock("electron", () => ({
  app: {
    getPath: (pathType: string) => {
      const p =  join(tmpdir(), `darkwrite-test-${pathType}`);
      mkdirSync(p, { recursive: true });
      return p;
    },
  },
}));

