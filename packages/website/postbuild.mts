import path from "node:path";
import fs from "node:fs";

function concatLicenses() {
  console.log("Post build hook > concatenating dependency licenses...")
  const presaved = fs.readFileSync(path.resolve("public/licenses.txt"), "utf8");
  const generated = fs.readFileSync(path.resolve("dist/licenses.md"), "utf8");
  
  const final = `${presaved} \n --- \n${generated}`
  fs.writeFileSync(path.resolve("dist/licenses.md"), final);
}

concatLicenses();
