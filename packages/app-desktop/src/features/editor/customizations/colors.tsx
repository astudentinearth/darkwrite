import { ColorPicker } from "@/components/color-picker";
import { Button } from "@darkwrite/ui";
import {
  setEditorCustomizations,
  useEditorState,
} from "@/context/editor-state";
import _ from "lodash";
import { RotateCcw } from "lucide-react";
import { useTranslation } from "react-i18next";

const setBackground = _.debounce((bg: string) => {
  const style = useEditorState.getState().customizations;
  setEditorCustomizations({ ...style, backgroundColor: bg });
}, 0);

const setText = _.debounce((fg: string) => {
  const style = useEditorState.getState().customizations;
  setEditorCustomizations({ ...style, textColor: fg });
}, 0);

export default function ColorsView() {
  const colors = useEditorState((s) => s.customizations);
  const { t } = useTranslation(undefined, {
    keyPrefix: "editor.customizations",
  });
  return (
    <div className="rounded-2xl p-2 flex flex-col gap-2">
      <div className="flex items-center gap-1">
        <span className="shrink-0 font-medium">
          {t("backgroundColorText")}
        </span>
        <div className="w-full"></div>
        <ColorPicker
          value={colors.backgroundColor}
          onChange={setBackground}
          className="shrink-0"
        />
        <Button
          className="shrink-0 bg-secondary hover:bg-secondary/50 rounded-lg size-8"
          variant={"outline"}
          onClick={() => setBackground("")}
        >
          <RotateCcw size={18} className="opacity-75" />
        </Button>
      </div>
      <div className="flex items-center gap-1">
        <span className="shrink-0 font-medium">
          {t("foregroundColorText")}
        </span>
        <div className="w-full"></div>
        <ColorPicker
          value={colors.textColor}
          className="w-8 shrink-0"
          onChange={setText}
        />
        <Button
          className="shrink-0 bg-secondary hover:bg-secondary/50 rounded-lg size-8"
          variant={"outline"}
          onClick={() => setText("")}
        >
          <RotateCcw size={18} className="opacity-75" />
        </Button>
      </div>
    </div>
  );
}
