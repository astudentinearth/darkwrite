import { PropertyField } from "./field";

/** Replaces unused `TodoListBase` from the previous iteration. */
export interface Database {
  id: string;
  /** `undefined` in offline workspaces as usual. */
  userId?: string;
  name: string;
  workspaceId: string;
  createdAt: Date;
  /** Fields map: key -> definition. */
  propertySchema: Record<string, PropertyField>;
}