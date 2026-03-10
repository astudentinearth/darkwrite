/**
 * Checks if the error is a NodeJS error, helping TypeScript in catch blocks.
 * @param error catch block error
 * @returns
 */
export const isNodeError = (error: unknown): error is NodeJS.ErrnoException =>
  error instanceof Error;

/**
 * Checks if the string can be parsed to JSON.
 * @param str test string
 */
export const isValidJSON = (str: string): boolean => {
  try {
    JSON.parse(str);
  } catch {
    return false;
  }
  return true;
};
