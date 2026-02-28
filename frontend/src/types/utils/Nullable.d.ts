export type Nullable<T extends object> = {
  [K in keyof T]: T[K] | null;
};
