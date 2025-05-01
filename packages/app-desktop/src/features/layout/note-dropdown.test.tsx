import * as navExports from "@renderer/hooks/use-navigate-to-note";
import * as titleExports from "@renderer/hooks/use-title-dropdown";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NoteDropdown } from "./note-dropdown";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const nav = vi.fn(async (_id: string) => {});

vi.spyOn(navExports, "useNavigateToNote").mockReturnValue(nav);

const titleSpy = vi.spyOn(titleExports, "useTitleDropdown");

describe("navigation dropdown tests", ()=>{
  it("should display the title correctly", () => {
    titleSpy.mockReturnValue({ parentNodes: [], title: "Home" });
    render(<NoteDropdown />);
    expect(screen.getByText("Home")).toBeInTheDocument();
  });
  
  it("should display the parent nodes correctly", async () => {
    titleSpy.mockReturnValue({
      parentNodes: [
        {
          id: "a-b-c-d-e",
          title: "Parent",
          icon: "icon",
          created: new Date(),
          modified: new Date(),
        },
      ],
      title: "Some note",
    });
    const user = userEvent.setup();
    render(<NoteDropdown />);
    const trigger = screen.getByTestId("note-dropdown-trigger");
    await user.click(trigger);
    expect(screen.getByText("Parent")).toBeInTheDocument();
  });
  
  it("should navigate to the parent node", async () => {
    titleSpy.mockReturnValue({
      parentNodes: [
        {
          id: "a-b-c-d-e",
          title: "Parent",
          icon: "icon",
          created: new Date(),
          modified: new Date(),
        },
      ],
      title: "Some note",
    });
    const user = userEvent.setup();
    render(<NoteDropdown />);
    const trigger = screen.getByTestId("note-dropdown-trigger");
    await user.click(trigger);
    const items = screen.getAllByRole("menuitem");
    const parent = items[0];
    expect(parent).not.toBeNull();
    await user.click(parent);
    expect(nav).toHaveBeenCalledWith("a-b-c-d-e");
  });
  
})