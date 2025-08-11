import CoverImage from "./cover-image";

export type EditorHeaderProps = {
  title: string;
  onTitleChange: (val: string) => void;
  icon: string | undefined;
  onIconChange: (val: string | undefined) => void;
  coverImageSource?: string;
  onCoverSourceChange: (val: string | undefined) => void;
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
