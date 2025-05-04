import { SlashCommandItem } from "@/types";
import { ReactRenderer } from "@tiptap/react";
import { SuggestionOptions, SuggestionProps } from "@tiptap/suggestion";
import tippy from "tippy.js";
import SlashCommandView from "./slash-command-view";

export const SlashCommandRenderer = {
  items: ()=>[{
    id: "builtin.test1",
    command: ()=>console.log("builtin.test1"),
    icon: "",
    title: "Test 1",
    description: "Test 1"
  } satisfies SlashCommandItem],

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
          placement: "bottom-start"
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

        //@ts-expect-error following the examples
        return component.ref?.onKeyDown(props);
      },

      onExit: ()=>{
        popup[0].destroy();
        component.destroy();
      }
    }
  }
} satisfies Omit<SuggestionOptions, "editor">;

