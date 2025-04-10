import type { MarkerType, MarkerInfo } from "./types";

const MARKERS: Record<MarkerType, MarkerInfo> = {
    heading: {
        regex: /^#{1,6}/,
        string: "#",
    },
    blockquote: {
        regex: /^>/,
        string: ">",
    },
    bullet: {
        regex: /^[-]/,
        string: "-",
    },
    numbered: {
        regex: /^\d+\./,
        string: "1.",
    },
    reset: {
        regex: /^~/,
        string: "~",
    },
};

export default MARKERS;
