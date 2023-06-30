import { PointerSensor } from "@dnd-kit/core";
import React from "react";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
export class TasksPointerSensor extends PointerSensor {
    static activators = [{
        eventName: 'onPointerDown',
        handler: ({ nativeEvent: event }: React.PointerEvent<Element>) => {
            if (!(event.target instanceof Element))
                return;
            if (!event.isPrimary || event.button !== 0 || isInteractiveElement([...(event.target as Element).classList] as string[])) {
                return false;
            }
            return true;
        },
    },
    ];
}
function isInteractiveElement(elementClassNames: string[]) {
    const interactiveElements = ["checkbox", "task-delete-button", "ignore-drag"];
    console.log(elementClassNames);
    for (const name of elementClassNames) {
        if (interactiveElements.includes(name))
            return true;
    }
    return false;
}
