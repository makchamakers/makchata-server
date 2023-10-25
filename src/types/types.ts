export type Map<T> = { [key: string]: T };
export type Optional<T> = T | null | undefined;
export type Nullable<T> = T | null;
export interface IAdress {
  addresses: {
    roadAddress: string;
    x: string;
    y: string;
  };
}
