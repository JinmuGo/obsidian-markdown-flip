import isFlipLine from "../src/hasMarker";

describe("hasMarker", () => {
    it("should detect valid flip lines", () => {
        expect(isFlipLine("- Hello")).toBe(true);
        expect(isFlipLine("    - Hello")).toBe(true);
        expect(isFlipLine("# Heading")).toBe(true);
        expect(isFlipLine("### Heading")).toBe(true);
        expect(isFlipLine("###Heading")).toBe(true);
        expect(isFlipLine("    > Quote")).toBe(true);
        expect(isFlipLine("1. Numbered")).toBe(true);
        expect(isFlipLine("   10. Indented")).toBe(true);
    });

    it("should reject invalid flip lines", () => {
        expect(isFlipLine("Hello")).toBe(false);
        expect(isFlipLine("* Bullet")).toBe(false);
        expect(isFlipLine("1 Hello")).toBe(false);
        expect(isFlipLine("")).toBe(false);
        expect(isFlipLine("   ")).toBe(false);
    });
});
