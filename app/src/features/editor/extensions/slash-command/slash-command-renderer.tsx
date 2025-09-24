import { ReactRenderer } from "@tiptap/react";
import { SuggestionOptions, SuggestionProps } from "@tiptap/suggestion";
import tippy from "tippy.js";
import { SlashCommandView } from "./slash-command-view";

export const SlashCommandRenderer = {
  render: ()=>{
    let popup: ReturnType<typeof tippy>;
    let component: ReactRenderer<unknown, object>;

    return {
      onStart: (props: SuggestionProps) => {
        component = new ReactRenderer(SlashCommandView, {
          editor: props.editor,
          props
        })

        if(props.clientRect == null) return;

        // @ts-expect-error it is done like this in the examples
        popup = tippy("body", {
          getReferenceClientRect: props.clientRect,
          appendTo: ()=>document.body,
          content: component.element,
          showOnCreate: true,
          interactive: true,
          trigger: "manual",
          placement: "bottom-start",
          animation: "cmd-slide-down"
        });
      },

      onUpdate: (props: SuggestionProps) => {
        component.updateProps(props);
        if(!props.clientRect) return;

        popup[0].setProps({
          // @ts-expect-error it is done like this in the examples
          getReferenceClientRect: props.clientRect
        })
      },

      onKeyDown: (props) => {
        if(props.event.key === "Escape") {
          popup[0].hide();
          return true;
        }

        if(component.ref){ 
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          return (component.ref as any).onKeyDown(props);
        }  // It refused to get that keydown, so we are sending a function inside the ref instead. Gonna fix when it breaks     
        return false
      },

      onExit: ()=>{
        popup[0].destroy();
        component.destroy();
      }
    }
  }
} satisfies Omit<SuggestionOptions, "editor">;

