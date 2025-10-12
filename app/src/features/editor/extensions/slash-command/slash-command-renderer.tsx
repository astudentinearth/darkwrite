import { Editor, posToDOMRect, ReactRenderer } from "@tiptap/react";
import { SuggestionOptions, SuggestionProps } from "@tiptap/suggestion";
import { SlashCommandView } from "./slash-command-view";
import { computePosition, shift, flip } from "@floating-ui/dom";

const updatePosition = (editor: Editor, element: HTMLElement) => {
  const virtualElement = {
    getBoundingClientRect: () =>
      posToDOMRect(
        editor.view,
        editor.state.selection.from,
        editor.state.selection.to,
      ),
  };
  //debugger;
  computePosition(virtualElement, element, {
    placement: "bottom-start",
    strategy: "absolute",
    middleware: [shift(), flip()],
  }).then(({ x, y, strategy }) => {
    element.style.width = "max-content";
    element.style.position = strategy;
    element.style.top = `${y}px`;
    element.style.left = `${x}px`;
    //debugger;
  });
};

export const SlashCommandRenderer = {
  render: () => {
    let component: ReactRenderer<unknown, object>;

    return {
      onStart: (props: SuggestionProps) => {
        console.log("begin onstart");
        component = new ReactRenderer(SlashCommandView, {
          editor: props.editor,
          props,
        });

        if (!props.clientRect) return;

        component.element.style.position = "absolute";
        document.body.appendChild(component.element);
        updatePosition(props.editor, component.element);
        console.log("end onstart");
      },
      onUpdate: (props: SuggestionProps) => {
        console.log("begin onupdate");
        component.updateProps(props);
        if (!props.clientRect) return;
        updatePosition(props.editor, component.element);
        console.log("end onupdate");
      },
      onKeyDown: (props) => {
        console.log("begin onkeydown");
        if (props.event.key === "Escape") {
          component.destroy();
          component.element.remove();
          return true;
        }

        if (component.ref) {
          console.log("forwarding keydown");
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          return (component.ref as any).onKeyDown(props);
        } // It refused to get that keydown, so we are sending a function inside the ref instead. Gonna fix when it breaks
        return false;
      },

      onExit: () => {
        console.trace("begin onexit");
        component?.element?.remove();
        component?.destroy();
        console.log("end onexit");
      },
    };
  },
} satisfies Omit<SuggestionOptions, "editor">;
