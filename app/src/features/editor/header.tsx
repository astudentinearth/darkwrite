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
  wide?: boolean;
};

export default function EditorHeader(props: EditorHeaderProps) {
  return (
    <div className="w-full flex flex-col items-center">
      <CoverImage
        onImageSourceChange={props.onCoverSourceChange}
        imageSource={props.coverImageSource}
      />
      <ConstrainedWidth className="flex flex-col gap-2 px-4" fill={props.wide}>
        <DynamicTextarea className="text-4xl font-semibold box-border h-auto overflow-hidden resize-none grow outline-hidden block" value={props.title} onValueChange={props.onTitleChange}/>
        <hr/>
      </ConstrainedWidth> 
    </div>
  );
}
