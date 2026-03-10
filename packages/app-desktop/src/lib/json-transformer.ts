// this is a typeorm column transformer, not a useless abstraction
export const JSONTransformer = {
  to: (value: unknown) => JSON.stringify(value),
  from: (value: string) => JSON.parse(value),
};
