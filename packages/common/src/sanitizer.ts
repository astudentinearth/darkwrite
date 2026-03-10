/**
 * Filter characters from a string that are not allowed in CSS attribute values.
 * @param value
 * @returns
 */
export function sanitizeQuotedCssValue(value: string) {
  return value.replace(/[^a-zA-Z0-9 \-_,]/g, "");
}
