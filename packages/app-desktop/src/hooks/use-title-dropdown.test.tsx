import { render, screen } from "@testing-library/react";
import { getTitle, resolveUpperTree } from "./use-title-dropdown";

it("should return home on index", () => {
  const title = getTitle([], false, "/", undefined);
  render(<>{title}</>);
  expect(screen.getByText("Home")).toBeInTheDocument();
});

it("should return settings title", () => {
  const title = getTitle([], false, "/settings", undefined);
  render(<>{title}</>);
  expect(screen.getByText("Settings")).toBeInTheDocument();
});

it("should return loading when notes are null", () => {
  const title = getTitle(undefined, false, "/page/1234", "1234");
  render(<>{title}</>);
  expect(title).toBe("Loading");
});

it("should return loading if query is loading", () => {
  const title = getTitle(undefined, true, "/page/1234", "1234");
  expect(title).toBe("Loading");
});

it("should return empty string if note doesn't exist", () => {
  const title = getTitle([], false, "/page/1234", "1234");
  expect(title).toBe("");
});

it("should return empty string if route is unknown", () => {
  const title = getTitle([], false, "/some/where", "1234");
  expect(title).toBe("");
});

it("should return note title", () => {
  const title = getTitle(
    [
      {
        id: "1234",
        title: "title",
        icon: "",
        createdAt: new Date(),
        modifiedAt: new Date(),
        orderHint: "",
        favoriteOrderHint: "",
        workspaceId: ""
      },
    ],
    false,
    "/page/1234",
    "1234",
  );
  render(<>{title}</>);
  expect(screen.getByText("title")).toBeInTheDocument();
});

it("should find parent notes", () => {
  const parents = resolveUpperTree(
    [
      {
        id: "1234",
        title: "child",
        icon: "",
        createdAt: new Date(),
        modifiedAt: new Date(),
        parentId: "5678",
        orderHint: "",
        favoriteOrderHint: "",
        workspaceId: ""
      },
      {
        id: "5678",
        title: "parent",
        icon: "",
        createdAt: new Date(),
        modifiedAt: new Date(),
        orderHint: "",
        favoriteOrderHint: "",
        workspaceId: ""
      },
    ],
    "1234",
  );
  expect(parents.find((n) => n.id === "5678")).not.toBeNull();
});

it("should return empty array if parent id is null", () => {
  const parents = resolveUpperTree(
    [
      {
        id: "1234",
        title: "child",
        icon: "",
        createdAt: new Date(),
        modifiedAt: new Date(),
        orderHint: "",
        favoriteOrderHint: "",
        workspaceId: ""
      },
    ],
    "1234",
  );
  expect(parents.length).toEqual(0);
});

it("should return empty array if note does not exist", () => {
  const parents = resolveUpperTree([], "adsf");
  expect(parents.length).toEqual(0);
});
