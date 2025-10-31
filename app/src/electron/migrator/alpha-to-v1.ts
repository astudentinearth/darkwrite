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
