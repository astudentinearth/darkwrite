import { expect, it } from "vitest";
import { screen, render, fireEvent } from "@testing-library/react";
import {Layout} from "./layout";

it("should hide the sidebar and show expand button", ()=>{
    render(<Layout></Layout>);
    const hideSidebarButton = screen.getByTestId("button-collapse-sidebar");
    const sidebar = screen.getByTestId("container-sidebar");
    const resizeHandle = screen.getByTestId("sidebar-resize-handle");
    const expandButton = screen.getByTestId("button-expand-sidebar")
    fireEvent.click(hideSidebarButton);
    expect(sidebar).toHaveClass("hidden");
    expect(resizeHandle).toHaveClass("hidden");
    expect(expandButton).not.toHaveClass("hidden");
})