export type MarkerType = "heading" | "blockquote" | "bullet" | "numbered" | "reset";

export interface TransformParams {
    line: string;
    cursorCh: number;
}

export interface TransformResult {
    newLine: string;
    nextCursor: number;
}

export interface MarkerInfo {
    regex: RegExp;
    string: string;
}
