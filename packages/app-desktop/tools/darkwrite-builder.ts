// TODO
import { existsSync, readFileSync, rmSync } from "fs";
import { join } from "path";
import os from "os";
import proc from "child_process";

const __dirname = import.meta.dirname; // polyfill __dirname

const scripts = {
  Windows_NT: "build:win",
  Linux: "build:linux",
  Darwin: "build:mac",
};

console.log("\u001b[1;36m📦 Darkwrite Builder ---\u001b[22m");
console.log(`\u001b[30mRunning on ${os.type()} ${os.release()}`);

console.log("Reading package.json");
const packageJsonPath = join(__dirname, "package.json");
const packageJsonContents = readFileSync(packageJsonPath, {encoding: "utf8"});
const packageJSON = JSON.parse(packageJsonContents);

const version = packageJSON.version;
console.log(`Target Darkwrite version: ${version}`);

console.log("Installing dependencies");
// @ts-expect-error it worked fine for quite a while
proc.execSync("yarn", { shell: true, stdio: "inherit" });

console.log("\u001b[30mChecking for previous artifacts...");
const artifactDir = join(__dirname, `release/${version}/`);
const artifactExists = existsSync(artifactDir);

if (artifactExists) {
  console.log(
    "Found older artifacts for this version. Removing for rebuild...",
  );
  if (os.type() == "Windows_NT") {
    console.log("Killing all Darkwrite.exe processes");
    try {
      proc.execSync("taskkill /f /im Darkwrite.exe");
    } catch {
      /*empty*/
    }
  }
  console.log("Removing old artifacts...");
  rmSync(artifactDir, { recursive: true });
} else console.log("There are no previous artifacts. Proceeding with build...");

console.log("\u001b[1;36m🔨 Starting new build...\u001b[0m");

const startTimestamp = Date.now();

const targetOs = os.type();

if(!(targetOs in scripts)) {
  throw new Error("Unsupported operating system.");
}

const process = proc.spawn(`yarn`, [scripts[targetOs as keyof typeof scripts]], {
  stdio: "inherit",
  shell: true,
});

process.on("error", (err) => {
  console.error("\u001b[31;1m✘ Build failed: \u001b[0m" + err.message);
  if (err.stack) console.error(err.stack);
});

process.on("exit", () => {
  const endTimestamp = Date.now();
  console.log(
    `\u001b[32;1m ✔ Built Darkwrite ${version} for ${os.type()} \u001b[30;22mtook ${(endTimestamp - startTimestamp) / 1000}s\u001b[0m`,
  );
});
