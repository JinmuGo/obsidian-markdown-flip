/**
 * extractMarkers function
 * Parses the leading markers from the input string (skipping any leading whitespace).
 * Recognized markers are: '>', '-', '#', and digits (with a trailing dot included).
 *
 * - There may or may not be whitespace between markers.
 * - A sequence of digits is recognized as a numbered token only if it is immediately followed by a dot ('.').
 *
 * Returns an object with { tokens, endIndex }, where tokens is an array of parsed marker tokens,
 * and endIndex is the index in the string where marker parsing ended.
 */
import MARKERS from "./markers";
import { TransformParams, TransformResult } from "./types";

const extractMarkers = (line: string): { tokens: string[]; endIndex: number } => {
    let i = 0;
    const n = line.length;
    // Skip leading whitespace
    while (i < n && line[i] === " ") {
        i++;
    }
    const tokens: string[] = [];

    while (i < n) {
        const ch = line[i];
        if (ch === " ") {
            // Skip a single group of whitespace that separates markers; then end token parsing.
            while (i < n && line[i] === " ") {
                i++;
            }
            // If i still points to a marker character, continue parsing tokens.
            if (i < n && ">#0123456789-".includes(line[i])) {
                // If after whitespace a marker starts again, continue parsing as a new token.
                // (Here, we simply continue; we do not push the whitespace as a token.)
            } else {
                break;
            }
        } else if (MARKERS.blockquote.regex.test(ch)) {
            tokens.push(">");
            i++;
        } else if (MARKERS.bullet.regex.test(ch)) {
            tokens.push("-");
            i++;
        } else if (MARKERS.heading.regex.test(ch)) {
            // Heading token: read all consecutive '#' characters
            const start = i;
            while (i < n && line[i] === "#") {
                i++;
            }
            tokens.push(line.slice(start, i)); // e.g., "###"
        } else if (/\d/.test(ch)) {
            // use numbered regex separately below
            // Numbered token: read consecutive digits -> must be immediately followed by a dot ('.')
            const start = i;
            while (i < n && /\d/.test(line[i])) {
                i++;
            }
            if (MARKERS.numbered.regex.test(line.slice(start, i + 1))) {
                i++; // Include the dot
                tokens.push(line.slice(start, i)); // e.g., "1." or "12."
            } else {
                // If there's no dot after the digits, terminate token parsing (invalid marker)
                break;
            }
        } else {
            // If the character is not a marker, stop parsing
            break;
        }
    }

    return { tokens, endIndex: i };
};

/**
 * transformLine function
 *
 * After extracting the leading markers from the input line (ignoring any leading whitespace),
 * this function determines the effective marker according to the rules below and returns
 * the combined result with the remainder of the text.
 *
 * Additionally, it calculates nextCursor (i.e., where to move the cursor after the marker).
 *
 * Transformation rules (based on test cases):
 *
 * 1. If the line starts with '>' (override case):
 *    - Remove the initial '>' and use the remaining token array (subTokens) to determine the effective marker.
 *    - Example: '> # Hello' → subTokens = ['#'] → effective marker = '#' → result: '# Hello'
 *    - Example: '> - Hello' → subTokens = ['-'] → effective marker = '-' → result: '- Hello'
 *    - Example: '> 1. Hello' → subTokens = ['1.'] → effective marker = '1.' → result: '1. Hello'
 *    - If there are no subTokens, return a simple blockquote: '> ' + remainder.
 *
 * 2. Otherwise (if the line does not start with '>'):
 *    - Extract all markers (tokens) from the line.
 *    - If tokens are separated (i.e. there was whitespace between them), the effective marker is the last token.
 *
 *    - Special rule: If all tokens are numbered tokens (match /^\d+\.$/) and there are 2 or more tokens,
 *      then the line is already considered properly formatted; return the original line.
 *
 *    - Finally, return the string as `effectiveMarker + ' ' + remainder`.
 *
 * 3. If no valid markers are found, return the original line.
 *
 * 4. Cursor Calculation:
 *    - The new cursor position is set to the length of the effective marker plus one (for the space).
 *    - Example: For '> ' (length=2) → nextCursor = 2.
 *      For '- ' (length=2) → nextCursor = 2.
 *      For '### ' (length=4) → nextCursor = 4.
 *      For '1. ' (length=3) → nextCursor = 3.
 */
export default function flipLine(params: TransformParams): TransformResult {
    const { line } = params;
    const trimmedLine = line.trimStart();
    if (trimmedLine === "") {
        return { newLine: line, nextCursor: 0 };
    }

    const { tokens, endIndex } = extractMarkers(line);
    const remainder = line.slice(endIndex).trimStart();

    if (tokens.length > 0 && remainder.startsWith("~")) {
        const newLine = remainder.slice(1).trimStart(); // remove "~"
        return { newLine, nextCursor: 0 };
    }

    let newLine = line;
    let nextCursor = 0;

    // Helper: Calculate nextCursor as marker length + 1 for the space.
    const calcCursor = (marker: string) => marker.length + 1;

    // Case A: If the line starts with '>'
    if (tokens.length > 0 && tokens[0] === ">") {
        const subTokens = tokens.slice(1); // Remove the initial '>'
        if (subTokens.length === 0) {
            newLine = "> " + remainder;
            nextCursor = calcCursor(">");
            return { newLine, nextCursor };
        }
        // Use the last token in subTokens as the effective marker
        const effective = subTokens[subTokens.length - 1];
        newLine = effective + " " + remainder;
        nextCursor = calcCursor(effective);
        return { newLine, nextCursor };
    }

    // Case B: General case – if tokens exist
    if (tokens.length > 0) {
        // Check if all tokens are numbered tokens (i.e., match /^\d+\.$/) and there are 2 or more tokens.
        const isAllNumbered = tokens.every((tok) => /^\d+\.$/.test(tok));
        if (isAllNumbered && tokens.length >= 2) {
            return { newLine: line, nextCursor: 0 }; // Already in correct format, so return the original line.
        }
        const effective = tokens[tokens.length - 1];
        newLine = effective + " " + remainder;
        nextCursor = calcCursor(effective);
        return { newLine, nextCursor };
    }

    // Case C: If no valid marker is found, return the original line.
    return { newLine: line, nextCursor: 0 };
}
