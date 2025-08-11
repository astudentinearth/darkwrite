import CoverImage from "./cover-image";

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
    <div className="w-full flex flex-col">
      <CoverImage
        onImageSourceChange={props.onCoverSourceChange}
        imageSource={props.coverImageSource}
      />
    </div>
  );
}
