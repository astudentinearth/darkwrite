import { createContext } from "react"

export interface IMockEmbedContext {
  embeds: {[key: string]: string}
}

export const MockEmbedContext = createContext<IMockEmbedContext>({embeds: {}});
