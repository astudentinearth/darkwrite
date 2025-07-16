import { NoteDTO } from "@darkwrite/common";
import { Button } from "@darkwrite/ui";
import {
  setEditorCustomizations,
  useEditorState,
} from "@/context/editor-state";
import { useEmbedSource } from "@/hooks/use-embed-source";
import { uploadImage } from "@/lib/upload";
import { cn } from "@/lib/utils";
import { ImageOff } from "lucide-react";
import { useState } from "react";

export function CoverImage({ embedId }: { note: NoteDTO; embedId?: string }) {
  const [mouseOver, setMouseOver] = useState(false);
  const customizations = useEditorState((s) => s.customizations);
  const imageSource = useEmbedSource(embedId ?? "");
  const changeCover = async () => {
    try {
      const embed = await uploadImage();
      setEditorCustomizations({
        ...customizations,
        coverImageSource: embed.id,
      });
    } catch {
      /**empty */
    }
  };
  const removeCover = () => {
    setEditorCustomizations({
      ...customizations,
      coverImageSource: undefined,
    });
  };
  return (
    <div
      onMouseOver={() => setMouseOver(true)}
      onMouseOut={() => setMouseOver(false)}
      className={cn(
        "w-full shrink-0 flex items-end justify-end p-2 gap-2",
        embedId && "z-40 h-40 ",
      )}
      style={
        embedId
          ? {
              backgroundImage: `url(${imageSource})`,
              backgroundPosition: "center",
              backgroundSize: "cover"
            }
          : {}
      }
    >
      {mouseOver && embedId && (
        <>
          <Button
            variant={"ghost"}
            className="rounded-lg bg-secondary/80 hover:bg-primary/80! hover:text-primary-foreground backdrop-blur-lg z-20 font-ui text-foreground"
            onClick={changeCover}
          >
            Change cover
          </Button>
          <Button
            onClick={removeCover}
            variant={"ghost"}
            className="rounded-lg bg-secondary/80 hover:bg-primary/80! hover:text-primary-foreground backdrop-blur-lg z-20 gap-2 font-ui text-foreground"
          >
            <ImageOff size={18} />
            Remove
          </Button>
        </>
      )}
    </div>
  );
}
