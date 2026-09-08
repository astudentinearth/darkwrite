const newlineMatcher = /(\r\n|\n|\r)/gm;

export const removeLinebreaks = (str: string, sub = " ") =>
  str.replace(newlineMatcher, sub);
