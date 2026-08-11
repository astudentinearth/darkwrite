import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { gettextToI18next } from "i18next-conv";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

/** Languages to compile. Add new languages here after creating
 * locales/<lang>/translation.po */
const LANGUAGES = ["en", "tr", "zh_CN"];

for (const lang of LANGUAGES) {
  const source = path.join(root, "locales", lang, "translation.po");
  const target = path.join(root, "dist", "locales", lang, "translation.json");
  const json = await gettextToI18next(lang, await readFile(source), {
    // splits dotted msgids (sidebar.button.newPage) into nested JSON,
    // matching the key shape i18next consumers expect
    keyseparator: ".",
    compatibilityJSON: "v4",
    quiet: true,
  });
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, json);
  console.log(`compiled ${lang}/translation.po -> ${target}`);
}
