import { countWords } from "@darkwrite/common";
import { useEditorState } from "@/context/editor-state";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export function WordCounter() {
  const { t } = useTranslation();
  const [count, setCount] = useState({ words: 0 });
  const editor = useEditorState((state) => state.editorInstance);
  const content = useEditorState((state) => state.content);
  const updateWordCount = async () => {
    if (!editor || !content) return;
    const words = countWords(editor.getText());
    setCount({ words });
  };
  useEffect(() => {
    updateWordCount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor, content]);
  return (
    <div className="absolute word-count-bubble bottom-2 right-2 drop-shadow-lg select-none opacity-75 hover:opacity-100 bg-background/80 border-border/50 border z-50 p-1 px-2 rounded-full text-sm">
      <span className="block">
        {t("editor.menu.wordCount", { count: count.words })}
      </span>
    </div>
  );
}
