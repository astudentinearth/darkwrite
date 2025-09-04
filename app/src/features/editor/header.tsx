import DynamicTextarea from "@/components/dynamic-textarea";
import CoverImage from "./cover-image";
import ConstrainedWidth from "./constrained-width";
import { Input } from "@/components/ui/input";

export type EditorHeaderProps = {
  title: string;
  onTitleChange: (val: string) => void;
  icon: string | undefined | null ;
  onIconChange: (val: string | undefined | null ) => void;
  coverImageSource?: string;
  onCoverSourceChange: (val: string | undefined | null ) => void;
};

export default function EditorHeader(props: EditorHeaderProps) {
  return (
    <div className="w-full flex flex-col items-center">
      <CoverImage
        onImageSourceChange={props.onCoverSourceChange}
        imageSource={props.coverImageSource}
      />
      <ConstrainedWidth className="flex flex-col px-24">
        <DynamicTextarea className="text-4xl px-0 font-semibold box-border resize-none outline-hidden" value={props.title} onValueChange={props.onTitleChange}/>
      </ConstrainedWidth> 
    </div>
  );
}
