import { DEFAULT_USER_SETTINGS } from "@darkwrite/common";
import { IEmbedAPI, INoteAPI, ISettingsAPI } from "@/api/types";

export const MockNoteAPI = {
  create: async ()=>({id: "1234", created: new Date(), modified: new Date(), icon: "", title: "Test note"}),
  delete: async ()=>{},
  duplicate: async (id)=>({id: "1234", created: new Date(), modified: new Date(), icon: "", title: `Copy of ${id}`}),
  exportHTML: async ()=>{},
  getContents: async ()=>"{}",
  getNote: async (id) => ({id, created: new Date(), modified: new Date(), icon: "", title: "Test note"}),
  getNotes: async () => [],
  importFile: async () => null,
  move: async ()=>{},
  restore: async ()=>{},
  saveAll: async ()=>{},
  trash: async ()=>{},
  update: async ()=>{},
  updateContents: async ()=>{},
  exportJSON: async ()=>{}
} satisfies INoteAPI;

// Mocked API that satisfies IEmbedAPI
export const MockEmbedAPI = {
  create: async ()=>({id: "1234", createdAt: new Date(), displayName: "Test file", filename: "test-file", fileSize: 1234}),
  createFromArrayBuffer: async ()=>({id: "1234", createdAt: new Date(), displayName: "Test file", filename: "test-file", fileSize: 1234}),
  resolveSourceURL: async ()=> "embed://1234"
} satisfies IEmbedAPI;

// Mocked API that satisfies ISettingsAPI
export const MockSettingsAPI = {
  load: async ()=>(DEFAULT_USER_SETTINGS),
  save: async ()=>{}
} satisfies ISettingsAPI;

