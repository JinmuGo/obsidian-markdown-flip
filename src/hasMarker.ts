import MARKERS from "./markers";

export default function hasMarker(line: string): boolean {
    const trimmed = line.trimStart();

    return (
        MARKERS.bullet.regex.test(trimmed) ||
        MARKERS.blockquote.regex.test(trimmed) ||
        MARKERS.heading.regex.test(trimmed) ||
        MARKERS.numbered.regex.test(trimmed)
    );
}
