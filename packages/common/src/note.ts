import _ from "lodash";
import { nanoid } from "nanoid";
import { ok, Result } from "neverthrow";
import type { NoteContent } from "@/note-content";
import { parseJson } from "./json-util";
import { Rank } from "./rank";
import { type DwResult, dwErr } from "./result";
import { removeNewlines } from "./string";

export enum PropertyType {
  Text = "text",
  Date = "date",
  Checkbox = "checkbox",
}

export type TextProperty = { type: PropertyType.Text; value: string };

export type DateRange = {
  from: Date | undefined;
  to?: Date | undefined;
};

export const serializeRange = (range: DateRange) =>
  JSON.stringify({
    from: range.from?.toISOString(),
    to: range.to?.toISOString(),
  });

export const deserializeRange = (serialized: string) =>
  parseJson<{ from: string | undefined; to: string | undefined }>(
    serialized,
  ).map(
    (result) =>
      ({
        from: result.from ? new Date(result.from) : undefined,
        to: result.to ? new Date(result.to) : undefined,
      }) satisfies DateRange,
  );

export type DateProperty = {
  type: PropertyType.Date;
  /** Stringified date range. */
  value: string;
};

export type CheckboxProperty = { type: PropertyType.Checkbox; value: boolean };

export type NoteProperty = TextProperty | DateProperty | CheckboxProperty;

type propertyTypeMap = {
  [PropertyType.Checkbox]: CheckboxProperty;
  [PropertyType.Date]: DateProperty;
  [PropertyType.Text]: TextProperty;
};

const propertyDefaults: { [K in PropertyType]: () => propertyTypeMap[K] } = {
  [PropertyType.Text]: () => ({ type: PropertyType.Text, value: "" }),
  [PropertyType.Date]: () => ({
    type: PropertyType.Date,
    value: serializeRange({ from: undefined }),
  }),
  [PropertyType.Checkbox]: () => ({
    type: PropertyType.Checkbox,
    value: false,
  }),
};

export function getDefaultNoteProperty<T extends PropertyType>(type: T) {
  return propertyDefaults[type]();
}

export const NoteProperty = { default: getDefaultNoteProperty };

/** Key doubles down as the property name. */
export type NotePropertyMap = Record<string, NoteProperty>;

export type ParentId = string | null;
export interface Note {
  id: string;
  title: string;

  /** Unicode emoji to be displayed as an icon. `null` means no icon, and a default icon will be rendered in relevant spaces instead. */
  icon: string | null;

  /** The parent note of this note. `null` means the note is at in top layer of the tree. */
  parentId: ParentId;

  /** ISO-string date. */
  createdAt: string;

  /** ISO-string date. */
  modifiedAt: string;

  /** ISO-string date. */
  trashedAt: string | null;

  /** A lexicographical hint to sort notes in the sidebar "All notes" section. */
  orderHint: string;

  /** A lexicographical hint to sort notes in the sidebar "Favorites" section. */
  favoriteOrderHint: string;
  isFavorite: boolean | null;
  isTrashed: boolean | null;

  /** The custom properties attached to this note. Properties
   * are keyed by their name. */
  properties: NotePropertyMap;

  /** Defines an absolute order for the keys of the properties field.
   * This list should be updated when a property is added or renamed. */
  propertyOrder: string[];

  /** ID of the workspace this note belongs to. */
  workspaceId: string;
}

export type NewNoteArgs = Partial<Note> &
  Pick<Note, "id" | "parentId" | "workspaceId" | "orderHint">;

export const Note = {
  /**
   * Produce a duplicate draft to use with a new Note.
   * @param note
   * @returns Note fields that were duplicated.
   */
  duplicate: (note: Note) => ({
    parentId: note.parentId,
    title: `${note.title} (copy)`,
    icon: note.icon,
    properties: _.cloneDeep(note.properties),
    propertyOrder: [...note.propertyOrder],
    workspaceId: note.workspaceId,
  }),
  /**
   * Initialize a note with default fields. (all nested fields are copied.)
   * @param args bare minimum required to produce a valid note.
   * @returns a full note
   */
  new: (args: NewNoteArgs): Note => {
    const now = new Date().toISOString();
    return _.merge(
      {
        title: "",
        icon: null,
        favoriteOrderHint: "",
        isFavorite: false,
        isTrashed: false,
        trashedAt: null,
        createdAt: now,
        modifiedAt: now,
        properties: {},
        propertyOrder: [],
      },
      _.cloneDeep(args),
    );
  },
  /**
   * Test constructor that pre-fills IDs by default.
   * @param args fields to override
   * @returns a full note
   */
  _test: (args: Partial<Note> = {}): Note =>
    Note.new({
      id: nanoid(),
      orderHint: Rank.default().get(),
      workspaceId: nanoid(),
      parentId: null,
      ...args,
    }),
  hasProperty: (note: Note, propertyName: string): boolean =>
    Object.hasOwn(note.properties, propertyName),
};

export type NotePartial = Partial<Note> & { id: Note["id"] };

/** @deprecated use `Note` instead */
export type NoteDTO = Note;

export interface NotesResponseDTO {
  notes: Record<string, Note>;
}

export interface NoteResponseDTO {
  note: Note | null;
}

export interface NoteContentResponseDTO {
  document: NoteContent;
}

/** Recursively walk up the tree to find the parent tree of a note.
 * @param id the starting note id
 * @param notes a map of all notes keyed by their ID
 * @returns the parent tree: lowest node first, highest node last
 */
export function resolveUpperTree(id: string, notes: Record<string, Note>) {
  const list: Note[] = [];
  if (!notes[id] || !("parentId" in notes[id])) return [];
  for (let currentId = notes[id].parentId; ; ) {
    if (currentId == null) return list;
    const parent = notes[currentId];
    if (!parent) break;
    list.push(parent);
    currentId = parent.parentId;
    if (id === currentId) break; // prevent circular reference
  }
  return list;
}

/**
 * Returns true if potentialChildId is a descendant of potentialParentId
 * @param potentialChildId
 * @param potentialParentId
 * @param notes
 * @returns "CIRCULAR" if child and parent are in a circular reference, true if is a descendant, false in all other cases
 */
export function isDescendant(
  potentialChildId: string,
  potentialParentId: string,
  notesMapOrGetter: Record<string, Note> | ((id: string) => Note),
): boolean | "CIRCULAR" {
  const visited = new Set<string>();
  if (potentialChildId === potentialParentId) return "CIRCULAR";

  const getNote = (id: string) => {
    if (typeof notesMapOrGetter === "function") return notesMapOrGetter(id);
    else return notesMapOrGetter[id];
  };

  let currentNoteId = potentialChildId;
  while (!visited.has(currentNoteId)) {
    const currentNote = getNote(currentNoteId);
    if (!currentNote) return false;
    visited.add(currentNoteId);
    if (!currentNote.parentId) break;
    currentNoteId = currentNote.parentId;
  }
  // check for circular dependency
  const currentNote = getNote(currentNoteId);

  // test candidate isn't part of the tree, we don't care if there's a circle somewhere else
  if (!visited.has(potentialParentId)) return false;

  if (currentNote.parentId != null && visited.has(currentNote.parentId)) {
    // we walked all nodes but we walked the parent of the last node too
    // there's a circular dependency
    return "CIRCULAR";
  }

  return true;
}

/**
 * Returns true if potentialChildId is a descendant of potentialParentId
 * @param potentialChildId
 * @param potentialParentId
 * @param notes
 * @returns "CIRCULAR" if child and parent are in a circular reference, true if is a descendant, false in all other cases
 */
export async function isDescendantAsync(
  potentialChildId: string,
  potentialParentId: string,
  getNote: (id: string) => Promise<Note | undefined | null>,
): Promise<boolean | "CIRCULAR"> {
  const visited = new Set<string>();
  if (potentialChildId === potentialParentId) return "CIRCULAR";

  let currentNoteId = potentialChildId;
  while (!visited.has(currentNoteId)) {
    const currentNote = await getNote(currentNoteId);
    if (!currentNote) return false;
    visited.add(currentNoteId);
    if (!currentNote.parentId) break;
    currentNoteId = currentNote.parentId;
  }
  // check for circular dependency
  const currentNote = await getNote(currentNoteId);
  if (!currentNote) return false;

  // test candidate isn't part of the tree, we don't care if there's a circle somewhere else
  if (!visited.has(potentialParentId)) return false;

  if (currentNote.parentId != null && visited.has(currentNote.parentId)) {
    // we walked all nodes but we walked the parent of the last node too
    // there's a circular dependency
    return "CIRCULAR";
  }

  return true;
}

export type NoteExportFormat = "md" | "html" | "json";

//FIXME: Substitute this with translation keys
export const FileFormatMap: Record<NoteExportFormat, string> = {
  html: "HTML document",
  json: "JSON document",
  md: "Markdown document",
};

export type NoteImportResult = {
  type: NoteExportFormat;
  content: string[];
};

/** Valid fields to order notes by. These keys must have valid ranks. */
export type OrderKey = "orderHint" | "favoriteOrderHint";
export type MovePlacement = "inside-start" | "inside-end" | "below";

/** 📄 - Default icon to set when "Add icon" is clicked. */
export const DEFAULT_NOTE_ICON = "1f4c4";

/**
 * Replaces newlines with spaces in note titles.
 * @param title
 * @returns title with newlines gone
 */
export const cleanNoteTitle = (title: string) => removeNewlines(title);

/** Generate a sorting function to sort notes by a key deterministically.
 * Notes will always have the same order even if there are colliding keys.
 * ID will be used as a fallback. */
export const stableSortByOrderKeyFn =
  (key: OrderKey = "orderHint") =>
  (a: Note, b: Note) => {
    const result = Rank.sorter(a[key], b[key]);
    return result === 0 ? a.id.localeCompare(b.id) : result;
  };

export type PropertyDiff = Pick<Note, "propertyOrder" | "properties" | "id">;
export const PropertyDiff = {
  // shallow copy by default to prevent excessive re-renders
  from: (note: Note) => ({
    id: note.id,
    properties: { ...note.properties },
    propertyOrder: [...note.propertyOrder],
  }),
};

/**
 * Sets a property on a note and ensures it exists in the order list.
 * @param note
 * @param propertyName name of the target property
 * @param property the replacement value
 * @returns a diff to perform updates.
 */
function setNoteProperty(
  note: Note,
  propertyName: string,
  property: NoteProperty,
) {
  const diff = PropertyDiff.from(note);
  diff.properties = {
    ...diff.properties,
    [propertyName]: property,
  };
  if (!diff.propertyOrder.includes(propertyName))
    diff.propertyOrder.push(propertyName);
  return diff;
}

/**
 * Renames a note property
 * @param note
 * @param oldName
 * @param newName
 * @returns a diff to perform updates
 */
function renameNoteProperty(
  note: Note,
  oldName: string,
  newName: string,
): DwResult<PropertyDiff> {
  if (!Note.hasProperty(note, oldName))
    return dwErr(`Property ${oldName} does not exist in "${note.title}"`);

  if (newName.trim() === "") return dwErr(`Property name cannot be empty.`);

  if (Note.hasProperty(note, newName) || note.propertyOrder.includes(newName))
    return dwErr(`A property with this name already exists.`);
  const diff = PropertyDiff.from(note);

  diff.properties = {
    ...diff.properties,
    [newName]: diff.properties[oldName],
  };
  delete diff.properties[oldName];

  const idx = diff.propertyOrder.indexOf(oldName);
  if (idx === -1)
    diff.propertyOrder.push(newName); // it never existed in order
  else diff.propertyOrder[idx] = newName;

  return ok(diff);
}

/**
 * Deletes a note property if it exists.
 * @param note source note
 * @param propertyName target property
 * @returns `Ok<PropertyDiff>` on success, `DwErr` on non-existent property.
 */
function deleteNoteProperty(
  note: Note,
  propertyName: string,
): DwResult<PropertyDiff> {
  if (!Note.hasProperty(note, propertyName))
    return dwErr(
      `Property "${propertyName}" does not exist in "${note.title}"`,
    );

  const diff = PropertyDiff.from(note);
  delete diff.properties[propertyName];
  diff.propertyOrder = diff.propertyOrder.filter(
    (name) => name !== propertyName,
  );

  return ok(diff);
}

function reorderNoteProperty(
  note: Note,
  source: string,
  dest: string,
  placement: "before" | "after",
): DwResult<PropertyDiff> {
  if (!Note.hasProperty(note, source) || !Note.hasProperty(note, dest))
    return dwErr("Source or destination property doesn't exist.");

  const diff = PropertyDiff.from(note);

  if (!diff.propertyOrder.includes(source)) diff.propertyOrder.push(source);
  if (!diff.propertyOrder.includes(dest)) diff.propertyOrder.push(dest);

  if (source === dest) return ok(diff);

  // remove the source
  diff.propertyOrder = diff.propertyOrder.filter((prop) => prop !== source);

  const destIdx = diff.propertyOrder.indexOf(dest);
  diff.propertyOrder.splice(
    placement === "before" ? destIdx : destIdx + 1,
    0,
    source,
  );

  return ok(diff);
}

export const PropertyUpdater = {
  renameNoteProperty,
  deleteNoteProperty,
  setNoteProperty,
  reorderNoteProperty,
};
