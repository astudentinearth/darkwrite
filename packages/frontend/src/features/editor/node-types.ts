export interface INode {
  type: string;
  content: Array<INode>;
}

const EmptyParagraph: INode = {
  type: "paragraph",
  content: [],
};

export const UtilityNodes = {
  EmptyParagraph,
};
