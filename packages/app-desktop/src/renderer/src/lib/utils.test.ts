import { fromUnicode } from "./utils";

it("should convert emojis correctly", () => {
  const emojis = {
    "1f9d1-200d-1f4bb": "🧑‍💻",
    "1f636-200d-1f32b-fe0f": "😶‍🌫️",
    "1f97d": "🥽",
  };
  expect(fromUnicode("1f9d1-200d-1f4bb")).toBe(emojis["1f9d1-200d-1f4bb"]);
  expect(fromUnicode("1f636-200d-1f32b-fe0f")).toBe(
    emojis["1f636-200d-1f32b-fe0f"],
  );
  expect(fromUnicode("1f97d")).toBe(emojis["1f97d"]);
});
