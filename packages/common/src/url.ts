
export enum DarkwriteResource {
  Note = "note",
  Workspace = "workspace",
  Embed = "embed"
}

export type DarkwriteResourceRef = {
  type: DarkwriteResource;
  id: string;
}

export function getResourceRefFromUrl(url: string): DarkwriteResourceRef | null {
  try {
    const parsedUrl = new URL(url);
    if (parsedUrl.protocol !== "darkwrite:") return null;

    const objectType = parsedUrl.hostname;
    if(!Object.values(DarkwriteResource).includes(objectType as DarkwriteResource)) return null;
    
    const id = parsedUrl.pathname.slice(1);
    if(!id) return null;
    return { type: objectType as DarkwriteResource, id };
  }
  catch {
    return null;
  }
}

export function resourceRefToUrl(ref: DarkwriteResourceRef): string {
  if(!ref.id) throw new Error("Object reference must have an id");
  return `darkwrite://${ref.type}/${ref.id}`;
}

