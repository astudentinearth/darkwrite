import { INoteAPI } from "./api-client";
import { LocalNoteAPI } from "./local/note.local";

export class APIClient {

  private static _instance: APIClient;

  constructor(
    public note: INoteAPI = new LocalNoteAPI()
  ) {}

  public static get instance(): APIClient {
    if(this._instance) return this._instance;
    else return new APIClient();
  }
}