import { sanitizeQuotedCssValue } from "./sanitizer";

describe("css sanitization tests", () => {
  it("should not let sus characters inside values", () => {
    const value = "H</styl\0e ><script>''\"";
    const sanitized = sanitizeQuotedCssValue(value);
    expect(sanitized).toBe("Hstyle script");
  });
});
