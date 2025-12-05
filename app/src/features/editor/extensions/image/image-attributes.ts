import { Attributes } from "@tiptap/core";

const ImageAttributes: Attributes = {
  embedId: {
    default: null,
    parseHTML: (element) => {
      return {
        embedId: element.getAttribute("data-embed-id"),
      };
    },
    renderHTML: (attributes) => {
      return {
        "data-embed-id": attributes.embedId,
      };
    },
  },
  pendingId: {
    default: null,
    parseHTML: (element) => {
      return {
        pendingId: element.getAttribute("data-pending-id"),
      };
    },
    renderHTML: (attributes) => {
      return {
        "data-pending-id": attributes.pendingId,
      };
    },
  },
  "data-export": {
    default: null,
    isRequired: false,
  },
};

export default ImageAttributes;
