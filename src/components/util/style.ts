"use client";

import { SxProps, Theme } from "@mui/material";

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;
type Merge<T extends SxProps<Theme>[]> = UnionToIntersection<T[number]>;

export function makeStyle<T extends Record<string, SxProps<Theme>>>(style: T): T {
    return style;
}

export function mergeStyle<T extends SxProps<Theme>[]>(...args: SxProps<Theme>[] | [...T]): Merge<T> & SxProps<Theme> {
    return Object.assign({}, ...args);
}