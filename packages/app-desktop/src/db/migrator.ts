import { DB_PATH, Paths } from "@/lib/paths";
import { ClientError } from "@darkwrite/common";
import { is } from "@electron-toolkit/utils";
import { migrate } from "drizzle-orm/libsql/migrator";
import { default as _log } from "electron-log";
import { copy, pathExists, remove } from "fs-extra";
import { DatabaseType } from "./data-source";
import { fileURLToPath } from "url";
import path from "path";

const log = _log.create({ logId: "migrations" });
log.transports.file.resolvePathFn = () => Paths.MIGRATION_LOG_FILE;
log.transports.console.level = false;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** The drizzle migrations folder. In development, it's located in the project root. In production, it's located in the app's resources folder, relative to main.js */
const MIGRATIONS_FOLDER = is.dev
  ? "drizzle"
  : path.join(__dirname, "../drizzle");

/** Apply SQL migrations to the given drizzle connection. */
export async function applySqlMigrations(
  db: DatabaseType,
): Promise<DatabaseType> {
  await migrate(db, { migrationsFolder: MIGRATIONS_FOLDER });
  return db;
}

export class MigrationError extends ClientError {
  constructor(
    public error: unknown,
    public logFilePath: string,
    public snapshotPath: string | null,
  ) {
    super(
      String(error),
      `Database migration failed. A snapshot of your data was saved to ${snapshotPath}. Please check the migration log at ${logFilePath} for details.`,
    );
  }
}

/** Create a shadow copy of the database at the given path. The copy will be used to restore the database in case of corruption. */
async function backupDatabase(): Promise<string | null> {
  log.info("Creating database backup...");
  const filename = Paths.inData(`snapshot-${Date.now()}.db`);

  if (!(await pathExists(DB_PATH))) return null;

  await copy(DB_PATH, filename, { overwrite: true });
  log.info(`Database backup created at ${filename}`);
  return filename;
}
/** Migrate the database with a backup. If the migration fails, the original database can be restored from the backup. The backup will be deleted if the migration succeeds. The migration log will contain details of any errors that occur during migration.
 * @throws MigrationError if the migration fails, with details in the migration log.
 * */
export async function migrateDatabaseWithBackup(
  db: DatabaseType,
): Promise<DatabaseType> {
  const backupPath = await backupDatabase();
  try {
    const migratedDb = await applySqlMigrations(db);
    if (backupPath) await remove(backupPath);
    return migratedDb;
  } catch (error) {
    log.error("Database migration failed:", error);
    log.error(
      `A snapshot of the database was created at ${backupPath} before the migration attempt.`,
    );
    throw new MigrationError(error, Paths.MIGRATION_LOG_FILE, backupPath);
  }
}
