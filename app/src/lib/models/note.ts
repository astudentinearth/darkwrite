export interface Note {
  id: string;

  /** Owner of this note. `undefined` means the note is stored on-device only. If the note is related to a server, it will contain the ID of its owner. */
  userId?: string;

  /** The ID of the database this note is tied to. `undefined` means it is not part of a database. Replaces the unused `todoListID` from the previous iteration. */
  databaseId?: string;

  /** The ID of the workspace this note belongs to. Databases can be partitioned by this field if deemed necessary.
   * During migrations from v0.1-0.5x alphas, a default workspace should be created and the ID of that worksapce should be integrated. */
  workspaceId: string;

  /** The ID of the note which is one level higher in the tree than this note. Renames the `parentID` field from the previous iteration for consistency. */
  parentId?: string;

  /** The values for the custom properties this note has, according to the tied database property schema. Each property key is mapped directly to a value. */
  propertyValues?: Record<string, string>;

  title: string;
  icon?: string;

  /* -- timestamps -- */

  /** Renames the `created` field from the previous iteration. Migrate accordingly. */
  createdAt: Date;
  /** Renames the `modified` field from the previous iteration. Migrate accordingly. */
  modifiedAt: Date;
  /** Holds the date this note was last moved into trash. */
  trashedAt?: Date;


  /* -- ordering magic -- */

  /** base36 order hint for sidebar/database ordering. Replaces the `index` field from the previous iteration.
   *  During migrations from v0.1-0.5x alphas, hints should be calculated depending on existing indices.
   */
  orderHint: string;
  /** base36 order hint to determine order in the favorites section of the sidebar. Replaces the `favoriteIndex` field from the previous iteration.
   *  During migrations from v0.1-0.5x alphas, hints should be calculated depending on existing indices.
   */
  favoriteOrderHint: string;

  /* -- flags -- */

  isFavorite?: boolean;
  isTrashed?: boolean;
}
