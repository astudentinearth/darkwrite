/* eslint-disable @typescript-eslint/no-unused-vars */
import { HomePage } from ".";
import * as navigate from "@/hooks/use-navigate-to-note";
import * as recents from "@/hooks/use-recents";
import { render, screen, fireEvent } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const Component = () => {
  const qc = new QueryClient();
  return (
    <QueryClientProvider client={qc}>
      <HomePage />
    </QueryClientProvider>
  );
};

const navSpy = vi.fn(async (_id: string) => {});

vi.spyOn(navigate, "useNavigateToNote").mockReturnValue(async (id) => {
  navSpy(id);
});

vi.spyOn(recents, "useRecentNotes").mockReturnValue([
  {
    id: "1",
    createdAt: new Date(),
    modifiedAt: new Date(),
    icon: "",
    title: "Recent 1",
    orderHint: "",
    favoriteOrderHint: "",
    workspaceId: "",
  },
  {
    id: "2",
    createdAt: new Date(),
    modifiedAt: new Date(),
    icon: "",
    title: "Recent 2",
    orderHint: "",
    favoriteOrderHint: "",
    workspaceId: "",
  },
  {
    id: "3",
    createdAt: new Date(),
    modifiedAt: new Date(),
    icon: "",
    title: "Recent 3",
    orderHint: "",
    favoriteOrderHint: "",
    workspaceId: "",
  },
  {
    id: "4",
    createdAt: new Date(),
    modifiedAt: new Date(),
    icon: "",
    title: "Recent 4",
    orderHint: "",
    favoriteOrderHint: "",
    workspaceId: "",
  },
  {
    id: "5",
    createdAt: new Date(),
    modifiedAt: new Date(),
    icon: "",
    title: "Recent 5",
    orderHint: "",
    favoriteOrderHint: "",
    workspaceId: "",
  },
]);

it("should render recent notes", () => {
  render(<Component />);
  expect(screen.getByText("Recent 1", { exact: false })).toBeInTheDocument();
  expect(screen.getByText("Recent 2", { exact: false })).toBeInTheDocument();
  expect(screen.getByText("Recent 3", { exact: false })).toBeInTheDocument();
  expect(screen.getByText("Recent 4", { exact: false })).toBeInTheDocument();
  expect(screen.getByText("Recent 5", { exact: false })).toBeInTheDocument();
});

it("should navigate when clicked on items", () => {
  render(<Component />);
  const button = screen.getByText("Recent 1", { exact: false });
  fireEvent.click(button);
  expect(navSpy).toHaveBeenCalledWith("1");
});

it("should show create button if no notes are there", () => {
  vi.spyOn(recents, "useRecentNotes").mockReturnValue([]);
  render(<Component />);
  expect(screen.getByTestId("home-button-new-page")).toBeInTheDocument();
});
