import { type Editor, posToDOMRect, ReactRenderer } from "@tiptap/react";
import type { SuggestionOptions, SuggestionProps } from "@tiptap/suggestion";
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
  computePosition(virtualElement, element, {
    placement: "bottom-start",
    strategy: "absolute",
    middleware: [shift(), flip()],
  }).then(({ x, y, strategy }) => {
    element.style.width = "max-content";
    element.style.position = strategy;
    element.style.top = `${y}px`;
    element.style.left = `${x}px`;
  });
};

export const SlashCommandRenderer = {
  render: () => {
    let component: ReactRenderer<unknown, object>;

    return {
      onStart: (props: SuggestionProps) => {
        component = new ReactRenderer(SlashCommandView, {
          editor: props.editor,
          props,
        });

        if (!props.clientRect) return;

        component.element.style.position = "absolute";
        component.element.style.zIndex = "1000";
        document.body.appendChild(component.element);
        updatePosition(props.editor, component.element);
      },
      onUpdate: (props: SuggestionProps) => {
        component.updateProps(props);
        if (!props.clientRect) return;
        updatePosition(props.editor, component.element);
      },
      onKeyDown: (props) => {
        if (props.event.key === "Escape") {
          component.destroy();
          component.element.remove();
          return true;
        }

        if (component.ref) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          return (component.ref as any).onKeyDown(props);
        } // It refused to get that keydown, so we are sending a function inside the ref instead. Gonna fix when it breaks
        return false;
      },

      onExit: () => {
        component?.element?.remove();
        component?.destroy();
      },
    };
  },
} satisfies Omit<SuggestionOptions, "editor">;
