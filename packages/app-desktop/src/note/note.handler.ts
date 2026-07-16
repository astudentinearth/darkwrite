import { extname } from "node:path";
import {
  type CreateDocumentArgs,
  dwErrAsync,
  type FavoriteActionResponse,
  FileFormatMap,
  type INoteAPI,
  type MoveNoteDTO,
  MoveNoteDTOSchema,
  type NoteExportFormat,
  type NoteResponseDTO,
  type NotesResponseDTO,
  okVoid,
  type PageSize,
  type ParentId,
  type UpdateNoteDTO,
  UpdateNoteDTOSchema,
  validateSchema,
  ZCreateDocumentRequest,
} from "@darkwrite/common";
import { ok, ResultAsync } from "neverthrow";
import {
  showOpenDialog,
  showSaveDialog,
  whenDialogCancelled,
} from "@/api/dialog";
import type { Note } from "@/db/schema";
import { readFileUtf8, writeBinaryFile, writeFileUtf8 } from "@/lib/fs";
import type { IWorkspaceService } from "@/workspace/workspace.service";
import printToPdf from "../lib/print-to-pdf";
import type { IDocumentService } from "../service/document.service";
import { type HandlerImplements, handler } from "../types/ipc-handler";
import type { INoteService } from "./note.service";
import { notesToDto, noteToDto } from "./note-mapper";
import type { INoteQueryService } from "./note-query.service";

const aggregateResponse = (notes: Note[]) =>
  ({ notes: notesToDto(notes) }) satisfies NotesResponseDTO;

const singleResponse = (note: Note) =>
  ({ note: noteToDto(note) }) satisfies NoteResponseDTO;

const importTypeMap: Record<string, NoteExportFormat> = {
  ".md": "md",
  ".markdown": "md",
  ".json": "json",
  ".html": "html",
  ".htm": "html",
};

const determineImportType = (t: string) => importTypeMap[extname(t)] ?? "json";

const discard = () => {};

export function NoteAPI(
  noteService: INoteService,
  noteQueryService: INoteQueryService,
  documentService: IDocumentService,
  workspaceService: IWorkspaceService,
): HandlerImplements<INoteAPI> {
  const create = handler((dto: CreateDocumentArgs) =>
    validateSchema(ZCreateDocumentRequest)(dto)
      .asyncAndThen(noteService.create)
      .map(singleResponse),
  );
  const deleteNote = handler((id: string) =>
    noteService.deleteById(id).map(() => {}),
  );

  const getAllByWorkspaceId = handler((workspaceId: string) =>
    noteQueryService.getAllByWorkspaceId(workspaceId).map(aggregateResponse),
  );

  /** @internal */
  const _mapFavoriteIds = (
    favoriteIds: string[],
    workspaceId: string,
    noteId: string,
  ): FavoriteActionResponse => ({ favoriteIds, workspaceId, noteId });

  const favorite = handler((noteId: string, insertAtIndex?: number) =>
    noteQueryService
      .getById(noteId)
      .andThen((note) =>
        workspaceService
          .addFavorite(note.workspaceId, noteId, insertAtIndex)
          .map((ids) => _mapFavoriteIds(ids, note.workspaceId, noteId)),
      ),
  );

  const unfavorite = handler((noteId: string) =>
    noteQueryService
      .getById(noteId)
      .andThen((note) =>
        workspaceService
          .removeFavorite(note.workspaceId, noteId)
          .map((ids) => _mapFavoriteIds(ids, note.workspaceId, noteId)),
      ),
  );

  const getTrashed = handler((wId: string) =>
    noteQueryService.getTrashed(wId).map(aggregateResponse),
  );

  const search = handler((wId: string, query: string) =>
    noteQueryService.search(wId, query).map(aggregateResponse),
  );

  const moveToTrash = handler((id: string) =>
    noteService.moveToTrash(id).map(singleResponse),
  );
  const restoreFromTrash = handler((id: string) =>
    noteService.restoreFromTrash(id).map(singleResponse),
  );
  const getRecents = handler((wId: string) =>
    noteQueryService.getRecents(wId).map(aggregateResponse),
  );
  const getByParentId = handler((wId: string, pId: ParentId) =>
    noteQueryService.getByParentId(wId, pId).map(aggregateResponse),
  );
  const getById = handler((id: string) =>
    noteQueryService.getById(id).map(singleResponse),
  );
  const update = handler((id: string, dto: UpdateNoteDTO) =>
    validateSchema(UpdateNoteDTOSchema)(dto)
      .asyncAndThen((dto) => noteService.update(id, dto))
      .map(singleResponse),
  );

  const move = handler((dto: MoveNoteDTO) =>
    validateSchema(MoveNoteDTOSchema)(dto)
      .asyncAndThen(noteService.move)
      .map(singleResponse),
  );

  const duplicate = handler((id: string) =>
    noteService.duplicate(id).map(singleResponse),
  );
  const getDocument = handler((id: string) =>
    //FIXME: add self healing here!
    documentService.getNoteContent(id).map((document) => ({ document })),
  );
  const setDocument = handler((id: string, jsonStr: string) =>
    documentService
      .setNoteContent(id, jsonStr)
      .andThen(
        () => noteService.setModificationDate(id, new Date()).orElse(okVoid), // unimportant side effect
      )
      .map(discard),
  );

  const getParentTree = handler((id: string) =>
    noteQueryService
      .getParentTree(id)
      .map((notes) => ({ parents: notes.map(noteToDto) })),
  );

  const clearTrash = handler((wId: string) =>
    noteService.emptyTrash(wId).map(discard),
  );

  const saveExportedNote = handler(
    (fileContent: string, fileType: NoteExportFormat, title?: string) =>
      showSaveDialog({
        defaultPath: `${title ?? "document"}.${fileType}`,
        filters: [{ extensions: [fileType], name: FileFormatMap[fileType] }],
      })
        .andThen((path) => writeFileUtf8(path, fileContent).map(() => path))
        .orElse(whenDialogCancelled(undefined)),
  );

  const saveToPDF = handler(
    (html: string, title: string | undefined, pageSize: PageSize = "A4") =>
      ResultAsync.fromSafePromise(printToPdf(html, title, pageSize))
        .andThen((buffer) =>
          buffer ? ok(buffer) : dwErrAsync("Failed to print to PDF."),
        )
        .andThen((buffer) =>
          showSaveDialog({
            defaultPath: `${title ?? "document"}.pdf`,
            filters: [{ extensions: ["pdf"], name: "PDF Document" }],
          })
            .map((path) => ({ buffer, path }))
            .andThen(({ buffer, path }) =>
              writeBinaryFile(path, Buffer.from(buffer.buffer)).map(() => path),
            ),
        )
        .orElse(whenDialogCancelled(undefined)),
  );

  const importFiles = handler(() =>
    showOpenDialog({
      properties: ["openFile", "multiSelections"],
      filters: [
        { name: "Markdown files", extensions: ["md", "markdown"] },
        { name: "HTML files", extensions: ["html", "html"] },
        { name: "Darkwrite JSON", extensions: ["json"] },
      ],
    })
      .map((files) => ({ files, type: determineImportType(files[0]) }))
      .andThen(({ files, type }) =>
        ResultAsync.combine(files.map(readFileUtf8)).map((content) => ({
          content,
          type,
        })),
      )
      .orElse(whenDialogCancelled({ content: [], type: "html" as const })),
  );

  return {
    create,
    delete: deleteNote,
    getAllByWorkspaceId,
    favorite,
    getTrashed,
    search,
    moveToTrash,
    restoreFromTrash,
    getRecents,
    getByParentId,
    getById,
    update,
    move,
    duplicate,
    getDocument,
    setDocument,
    getParentTree,
    clearTrash,
    export: saveExportedNote,
    exportPdf: saveToPDF,
    import: importFiles,
    unfavorite,
  };
}
