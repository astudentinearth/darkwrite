import { randomUUID } from "node:crypto";
import {
  getResourceRefFromUrl,
  type DarkwriteResourceRef,
  DarkwriteResource,
  resourceRefToUrl,
} from "./url";

describe("darkwrite:// scheme tests", () => {
  it("should identify note by id", () => {
    const id = randomUUID();
    const url = `darkwrite://note/${id}`;
    const result = getResourceRefFromUrl(url);
    expect(result).toEqual({ type: DarkwriteResource.Note, id });
    expect(result).not.toBeNull();
  });
  it("should identify embed by id", () => {
    const id = randomUUID();
    const url = `darkwrite://embed/${id}`;
    const result = getResourceRefFromUrl(url);
    expect(result).toEqual({ type: DarkwriteResource.Embed, id });
    expect(result).not.toBeNull();
  });
  it("should not accept non-darkwrite urls", () => {
    const url = `http://example.com/note/${randomUUID()}`;
    const result = getResourceRefFromUrl(url);
    expect(result).toBeNull();
  });
  it("should not accept note urls without an id", () => {
    const url = `darkwrite://note/`;
    const result = getResourceRefFromUrl(url);
    expect(result).toBeNull();
  });
  it("should correctly create urls from refs", () => {
    const id = randomUUID();
    const ref: DarkwriteResourceRef = { type: DarkwriteResource.Note, id };
    expect(resourceRefToUrl(ref)).toBe(`darkwrite://note/${id}`);
  });
  it("should throw error when creating url from ref without id", () => {
    const ref: DarkwriteResourceRef = { type: DarkwriteResource.Note, id: "" };
    expect(() => resourceRefToUrl(ref)).toThrow();
  });
});
