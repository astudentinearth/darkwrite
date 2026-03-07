import { isTheme } from "./theme";

test("string is not a theme", () => {
  expect(!isTheme("lol"));
});

it("is not a theme without id", () => {
  expect(
    !isTheme({
      name: "not a theme",
    }),
  );
});

it("is not a theme without name", () => {
  expect(!isTheme({ id: "1234-5678901234-5678" }));
});

it("is not a theme if id and name are not strings", () => {
  expect(!isTheme({ id: {} }));
  expect(!isTheme({ name: 1234 }));
});

it("is a theme if name and id are present", () => {
  expect(isTheme({ name: "A theme without colors", id: "fs16df7uqvces" }));
});
