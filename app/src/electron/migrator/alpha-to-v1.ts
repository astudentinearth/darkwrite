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

import { Rank } from "@/common/rank";
import { getDefaultWorkspaceConfiguration } from "@/lib/workspace-config";
import * as entities from "@main/entity";
import checkDiskSpace from "check-disk-space";
import electronlog from "electron-log";
import fse from "fs-extra";
import path from "path";
import { DataSource } from "typeorm";
import { checkAccess, dirSize, rmIfExists } from "../lib/fs";
import { hasOnboarded } from "../lib/onboarding-state";
import { Paths } from "../lib/paths";
import { createRequire } from "module";

const log = electronlog.create({ logId: "alpha-migration" });
const require = createRequire(import.meta.url);

const Database = require("better-sqlite3");

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

  log.info("Checking data size and available disk space");
  const dataSize = await dirSize(Paths.DATA_DIR);
  const freeSpaceInDataVolume = await checkDiskSpace(Paths.DATA_ROOT);
  const freeSpaceInTempVolume = await checkDiskSpace(Paths.CACHE_DIR);

  log.info(
    `Data size: ${dataSize} / Free space in data volume: ${freeSpaceInDataVolume.free} / Free space in temp: ${freeSpaceInTempVolume.size}`,
  );

  if (
    dataSize * 1.5 > freeSpaceInDataVolume.free ||
    freeSpaceInDataVolume.free < 2 * 1024 * 1024 * 1024
  ) {
    throw new Error(
      `Not enough disk space in data volume to perform migration. Please free up some space and try again. The involved path is ${Paths.DATA_ROOT}`,
    );
  }

  if (dataSize * 1.5 > freeSpaceInTempVolume.free) {
    throw new Error(
      `Not enough disk space in temporary volume to perform migration. Please free up some space and try again. The involved path is ${Paths.CACHE_DIR}`,
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
  log.info("Initializing default workspace...");
  let workspace = new entities.Workspace();
  workspace.config = getDefaultWorkspaceConfiguration();
  workspace.name = "Migrated workspace";
  workspace.created_at = new Date();
  workspace = await newDb.getRepository(entities.Workspace).save(workspace);
  log.info(`Default workspace initialized with ID: ${workspace.id}`);

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
  log.info(
    `Migrated ${oldNotes.length} notes in ${(Date.now() - noteMigrationStart) / 1000} seconds`,
  );
}

export async function migrateAlphaToV1() {
  log.transports.file.resolvePathFn = () => Paths.MIGRATION_LOG_FILE;
  const migrationStart = Date.now();
  const exit = () => {
    log.info(
      `Migration process exited after ${(Date.now() - migrationStart) / 1000} seconds.`,
    );
  };
  try {
    await preflightCheck();
  } catch (err) {
    console.error("❌ Some checks failed: ", err);
    exit();
    throw err;
  }
  log.info("✅ All checks successful. Proceeding with migration...");
  await initCache();
  try {
    await reconstructDatabase();
    exit();
  } catch (err) {
    log.error("❌ Failed to reconstruct database: ", err);
    throw err;
  }
}
