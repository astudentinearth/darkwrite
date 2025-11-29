/**
 * Migration steps
 *
 * -- Preflight checks
 * Does data.db exist?
 * Does settings.json exist?
 * Are there any themes?
 *
 * -- Migration
 * Create a temporary folder for the migration
 * Create darkwrite.db in that folder
 * Initialize the default workspace
 * Migrate notes. For each note, check if the document for it exists.
 * --> For notes without a document, initialize an empty document for them as they likely were not intentionally deleted.
 * --> For documents without a matching note in the database, create headers for them - but ask the user if they want to keep them.
 * Migrate settings.json. Reset the theme preference to defaults just to be safe.
 * Migrate embeds:
 * ---> id, filesize and displayName columns are mapped as-is
 * ---> extract the file extension from filename, put it in fileType, ignore the filename columns
 * ---> copy the embed files, strip out the file extensions - only leaving the ID as the filename
 * ---> for embeds without a matching database row, delete the orphaned file.
 * ---> for embeds without the file, keep the row anyway so the user can now the filename they lost previously
 * Migrate themes
 * If anything goes wrong - redirect the user to file a bug report or start fresh. Do NOT overwrite any files.
 * If user chooses to start fresh, move the existing data to `darkwrite-data-alpha` for recovery purposes. Create the .version file with
 * contents set to "1"
 *
 * -- Finalize
 * Ask the user for confirmation.
 * On confirm, close all existing sqlite connections. Move the existing data directory to `darkwrite-data-alpha`.
 * Move the temporary folder to `darkwrite-data`, replacing the old one.
 * Create a .version file in there, with contents set to "1".
 */

import { NoteContent } from "@/common/note-content";
import { Rank } from "@/common/rank";
import { SettingsMigrator } from "@/common/settings-migrator";
import { Theme } from "@/common/theme";
import { getDefaultWorkspaceConfiguration } from "@/lib/workspace-config";
import * as entities from "@main/entity";
import sqlite3 from "better-sqlite3";
import { app, dialog } from "electron";
import electronlog from "electron-log";
import fse from "fs-extra";
import { createRequire } from "module";
import path from "path";
import { DataSource } from "typeorm";
import { AppDataSource } from "../db";
import { checkAccess, rmIfExists } from "../lib/fs";
import { hasOnboarded, markVersionMigrated } from "../lib/onboarding-state";
import { Paths } from "../lib/paths";
import { ElectronPrefsModel } from "../prefs";

const log = electronlog.create({ logId: "alpha-migration" });
const require = createRequire(import.meta.url);

// __filename explodes if we don't require
const Database = require("better-sqlite3") as typeof sqlite3;

interface LegacyNote {
  id: string;
  title: string;
  icon: string;
  created: number;
  modified: number;
  isFavorite?: number;
  isTrashed?: number;
  favoriteIndex?: number;
  index?: number;
  parentID?: string;
}

interface LegacyEmbed {
  id: string;
  displayName: string;
  fileSize: number;
  filename: string;
  createdAt: number;
}

const themeKeyMap = {
  background1: "--background",
  background2: "--view-1",
  background3: "--view-2",
  foreground: "--foreground",
  cardBackground: "--card",
  cardForeground: "--card-foreground",
  popoverBackground: "--popover",
  popoverForeground: "--popover-foreground",
  secondaryBackground: "--secondary",
  secondaryForeground: "--secondary-foreground",
  mutedBackground: "--muted",
  mutedForeground: "--muted-foreground",
  destructiveBackground: "--destructive",
  destructiveForeground: "--destructive-foreground",
  disabled: "--disabled",
  focusRing: "--ring",
  star: "--star",
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function transformTheme(oldTheme: Record<string, any>) {
  const newTheme: Theme = {
    id: oldTheme.id,
    name: oldTheme.name,
    mode: oldTheme.mode,
    colors: {},
  };
  for (const key in oldTheme) {
    if (key in themeKeyMap) {
      const newKey = themeKeyMap[key as keyof typeof themeKeyMap];
      if (!newKey) continue;
      newTheme.colors[newKey as keyof Theme["colors"]] = `${oldTheme[key]}`;
    }
  }
  for (const key in oldTheme.cssVars) {
    newTheme.colors[key as keyof Theme["colors"]] = `${oldTheme.cssVars[key]}`;
  }
  return newTheme;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function transformDocument(doc: any) {
  if (!("customizations" in doc) && !doc.customizations) return doc;
  if ("coverEmbedId" in doc.customizations) {
    doc.customizations.coverImageSource = `embed://${doc.customizations.coverEmbedId}`;
    delete doc.customizations.coverEmbedId;
  }
  return doc;
}

async function preflightCheck() {
  log.info("Starting preflight checks for alpha to v1 migration.");

  log.info("Checking access to temporary directory");
  checkAccess(Paths.CACHE_DIR);

  log.info("Checking access to data directory");
  checkAccess(Paths.DATA_ROOT);

  log.info("Validating alpha data directory structure");
  const isOnboarded = await hasOnboarded();
  const newDbExists = await fse.exists(Paths.DB_PATH);

  if (isOnboarded || newDbExists) {
    throw new Error(
      "This data directory was not created by the alpha version of Darkwrite.",
    );
  }

  const dbExists = await fse.exists(Paths.inData("data.db"));
  const settingsExists = await fse.exists(Paths.SETTINGS_PATH);
  if (!dbExists || !settingsExists) {
    throw new Error(
      "Essential data files are missing. Migration cannot proceed.",
    );
  }
}

async function initCache() {
  log.info("Attempting to remove migration cache if it exists...");
  await rmIfExists(Paths.MIGRATION_CACHE_DIR);

  log.info("Attempting to create migration cache...");
  await fse.mkdir(Paths.MIGRATION_CACHE_DIR);
}

async function reconstructDatabase() {
  const newDbPath = path.join(Paths.MIGRATION_CACHE_DIR, "darkwrite.db");
  const oldDbPath = path.join(Paths.DATA_DIR, "data.db");

  log.info(
    `Initializing database connection with existing database at ${oldDbPath}`,
  );
  const oldDb = new Database(oldDbPath, { readonly: true });
  log.info(`Connected to database at ${oldDbPath}...`);

  log.info(
    `Initializing database connection with new database at ${newDbPath}...`,
  );
  const newDb = new DataSource({
    type: "better-sqlite3",
    entities,
    database: newDbPath,
    synchronize: true,
  });
  await newDb.initialize();

  log.info(`Reconstructing database at ${newDbPath}...`);
  const workspace = await initWorkspace(newDb);

  await migrateNotesAndEmbeds(oldDb, workspace, newDb);
  oldDb.close();
  newDb.destroy();
}

async function migrateNotesAndEmbeds(
  oldDb: sqlite3.Database,
  workspace: entities.Workspace,
  newDb: DataSource,
) {
  log.info("Migrating notes...");
  const noteMigrationStart = Date.now();
  const oldNotes = oldDb
    .prepare('SELECT * FROM notes ORDER BY "index"')
    .all() as LegacyNote[];
  log.info(`Found ${oldNotes.length} notes. Mapping values...`);
  const noteMap: Record<string, entities.Note> = {};
  let previousRank = Rank.default();

  for (const oldNote of oldNotes) {
    const newNote = new entities.Note();
    newNote.id = oldNote.id;
    newNote.title = oldNote.title;
    newNote.icon = oldNote.icon;
    newNote.createdAt = new Date(oldNote.created);
    newNote.modifiedAt = new Date(oldNote.modified);
    newNote.isFavorite = oldNote.isFavorite === 1;
    newNote.isTrashed = oldNote.isTrashed === 1;
    newNote.parentId = oldNote.parentID;
    newNote.workspace = workspace;
    newNote.favoriteOrderHint = "";

    // Recalculate orderHint to avoid collisions
    newNote.orderHint = previousRank.toString();
    previousRank = previousRank.next();
    noteMap[newNote.id] = newNote;
  }

  log.info("Recalculating order keys for favorites...");
  const favorites = oldNotes
    .filter((n) => n.isFavorite === 1)
    .sort((a, b) => (a.favoriteIndex ?? 0) - (b.favoriteIndex ?? 0));

  previousRank = Rank.default();
  for (const favorite of favorites) {
    previousRank = previousRank.next();
    noteMap[favorite.id].favoriteOrderHint = previousRank.toString();
    noteMap[favorite.id].isFavorite = true;
  }

  log.info("Saving migrated notes to new database...");
  await newDb.getRepository(entities.Note).save(Object.values(noteMap));
  log.info("Migrating note contents...");
  const newNotesPath = path.join(Paths.MIGRATION_CACHE_DIR, "notes");
  await fse.mkdir(newNotesPath);
  const docs = await fse.readdir(Paths.NOTE_CONTENTS_DIR);
  for (const doc of docs) {
    const jsonText = await fse.readFile(
      path.join(Paths.NOTE_CONTENTS_DIR, doc),
      "utf-8",
    );
    let parsed: NoteContent;
    try {
      parsed = JSON.parse(jsonText);
      parsed = transformDocument(parsed);
    } catch {
      log.warn(
        `Failed to parse note content for note ID ${doc} - initializing empty content.`,
      );
      parsed = {
        contents: {},
        customizations: {},
      };
    }
    await fse.writeFile(
      path.join(Paths.MIGRATION_CACHE_DIR, "notes", doc),
      JSON.stringify(parsed, null, 2),
      "utf-8",
    );
  }

  log.info(
    `Migrated ${oldNotes.length} notes in ${(Date.now() - noteMigrationStart) / 1000} seconds`,
  );

  log.info("Migrating embeds...");
  const embedMigrationStart = Date.now();
  const newEmbedPath = path.join(Paths.MIGRATION_CACHE_DIR, "embeds");
  const files = await fse.readdir(Paths.EMBED_DIR);
  await fse.mkdir(newEmbedPath);

  log.info(`Copying ${files.length} embeds...`);
  for (const file of files) {
    const stripped = path.parse(file).name;
    await fse.copy(
      path.join(Paths.EMBED_DIR, file),
      path.join(newEmbedPath, stripped),
    );
  }

  const oldEmbeds = oldDb.prepare("SELECT * FROM embed").all() as LegacyEmbed[];
  const embedEntities: entities.Embed[] = [];
  for (const oldEmbed of oldEmbeds) {
    const newEmbed = new entities.Embed();
    newEmbed.id = oldEmbed.id;
    newEmbed.displayName = oldEmbed.displayName;
    newEmbed.fileName = oldEmbed.id;
    newEmbed.fileSize = oldEmbed.fileSize;
    newEmbed.fileType = path.extname(oldEmbed.filename).replace(".", "");
    newEmbed.uploadedAt = new Date(oldEmbed.createdAt);
    newEmbed.workspace = workspace;
    embedEntities.push(newEmbed);
  }
  log.info("Saving migrated embeds to new database...");
  await newDb.getRepository(entities.Embed).save(embedEntities);
  log.info(
    `Migrated ${oldEmbeds.length} embeds in ${(Date.now() - embedMigrationStart) / 1000} seconds`,
  );

  log.info("Migrating settings.json");
  const settings = await fse.readFile(Paths.SETTINGS_PATH, "utf-8");
  const migrator = new SettingsMigrator(JSON.parse(settings));
  const migrated = migrator.migrate();
  await fse.writeFile(
    path.join(Paths.MIGRATION_CACHE_DIR, "settings.json"),
    JSON.stringify(migrated, null, 2),
    "utf-8",
  );
  log.info("Settings migrated.");
}

async function migrateThemes() {
  const themesPath = path.join(Paths.MIGRATION_CACHE_DIR, "themes");
  await fse.mkdir(themesPath);
  const oldThemes = await fse.readdir(Paths.THEME_DIR);
  log.info(`Migrating ${oldThemes.length} themes...`);
  for (const themeFile of oldThemes) {
    const content = await fse.readFile(
      path.join(Paths.THEME_DIR, themeFile),
      "utf-8",
    );
    try {
      const parsed = JSON.parse(content);
      const migrated = transformTheme(parsed);
      await fse.writeFile(
        path.join(themesPath, themeFile),
        JSON.stringify(migrated, null, 2),
        "utf-8",
      );
      log.info(`Migrated theme ${themeFile} successfully.`);
    } catch {
      log.warn("Failed to migrate theme " + themeFile + " - skipping.");
      continue;
    }
  }
}

async function initWorkspace(newDb: DataSource) {
  log.info("Initializing default workspace...");
  let workspace = new entities.Workspace();
  workspace.config = getDefaultWorkspaceConfiguration();
  workspace.name = "Migrated workspace";
  workspace.created_at = new Date();
  workspace = await newDb.getRepository(entities.Workspace).save(workspace);
  log.info(`Default workspace initialized with ID: ${workspace.id}`);
  return workspace;
}

async function swap() {
  const backupPath = path.join(Paths.DATA_ROOT, "darkwrite-data-alpha/");
  try {
    log.info("Moving existing data to a fallback location...");
    await fse.move(Paths.DATA_DIR, backupPath, { overwrite: true });
    await fse.move(Paths.MIGRATION_CACHE_DIR, Paths.DATA_DIR);
  } catch (err) {
    log.error(
      "Failed to move new data directory into place - attempting rollback.",
      err,
    );
    try {
      await fse.move(backupPath, Paths.DATA_DIR);

      throw new Error(
        "Failed to move new data directory into place - rollback performed.",
      );
    } catch (_err) {
      log.error(
        "FATAL: ROLLBACK FAILED. Data is safe but needs manual recovery.",
      );
      log.error(_err);
      dialog.showErrorBox(
        "Migration failed",
        "We tried to migrate your data, but we failed to swap your existing data and we weren't able to move your original data back in place. Your data is safe, but needs manual intervention." +
          "\nYou can resolve the issue yourself by renaming the " +
          backupPath +
          'folder back to "darkwrite-data" and downgrading to the latest alpha version. ' +
          "\nThis case should have never happened, so please raise an issue on GitHub. Do NOT try another migration.",
      );
      app.exit(1);
    }
  }
}

export async function migrateAlphaToV1() {
  log.transports.file.resolvePathFn = () => Paths.MIGRATION_LOG_FILE;
  const migrationStart = Date.now();
  const logTime = () => {
    log.info(
      `Migration process exited after ${(Date.now() - migrationStart) / 1000} seconds.`,
    );
  };
  try {
    await preflightCheck();
  } catch (err) {
    log.error("❌ Some checks failed: ", err);
    logTime();
    throw err;
  }
  log.info("✅ All checks successful. Proceeding with migration...");
  await initCache();
  try {
    await reconstructDatabase();
  } catch (err) {
    log.error("❌ Failed to reconstruct database: ", err);
    logTime();
    throw err;
  }
  try {
    await migrateThemes();
  } catch {
    log.error("❌ Failed to migrate themes - proceeding without themes.");
  }
  await swap();
  logTime();

  // We are ready to go
  await markVersionMigrated("v1");
  await ElectronPrefsModel.initialize();
  await AppDataSource.initialize();
}
