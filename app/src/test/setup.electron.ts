import { rmSync } from "fs";

vi.mock("node:fs");
vi.mock("node:fs/promises");

vi.mock("@electron-toolkit/utils", () => ({
  is: {
    dev: true,
  },
}));

vi.mock("electron", () => ({
  app: {
    getPath: (pathType: string) => {
      return `/${pathType}/`;
    },
  },
}));

rmSync("_test.db");