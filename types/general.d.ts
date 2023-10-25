import { CSSProperties } from "react";

export interface PropBasic {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
} 

export interface PropParam<T> {
  params: T;
  searchParams:any
}