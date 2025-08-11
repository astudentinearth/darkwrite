import { useCenteredLayout } from "../layout/use-centered-layout";

export function useEditorOptions(widePage: boolean = false) {
  const editorWidth = useCenteredLayout(widePage ? 0 : 984);
  return { editorWidth }
}