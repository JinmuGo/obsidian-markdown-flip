// test/MarkdownFlip.test.ts
import { TransformParams } from "src/types";
import flipLine from "../src/flipLine";

describe("MarkdownFlip flipLine", () => {
    describe("Heading transformation", () => {
        it("should transform '# Hello' correctly", () => {
            const params: TransformParams = { line: "# Hello", cursorCh: 1 };
            expect(flipLine(params).newLine).toBe("# Hello");
        });
        it("should transform '- # Hello' into '# Hello'", () => {
            const params: TransformParams = { line: "- # Hello", cursorCh: 3 };
            expect(flipLine(params).newLine).toBe("# Hello");
        });
        it("should transform '> # Hello' into '# Hello'", () => {
            const params: TransformParams = { line: "> # Hello", cursorCh: 3 };
            expect(flipLine(params).newLine).toBe("# Hello");
        });
        it("should transform '1. # Hello' into '# Hello'", () => {
            const params: TransformParams = { line: "1. # Hello", cursorCh: 3 };
            expect(flipLine(params).newLine).toBe("# Hello");
        });
        it("should transform '-# Hello' into '# Hello'", () => {
            const params: TransformParams = { line: "-# Hello", cursorCh: 3 };
            expect(flipLine(params).newLine).toBe("# Hello");
        });
        it("should transform '># Hello' into '# Hello'", () => {
            const params: TransformParams = { line: "># Hello", cursorCh: 3 };
            expect(flipLine(params).newLine).toBe("# Hello");
        });
        it("should transform '1.# Hello' into '# Hello'", () => {
            const params: TransformParams = { line: "1.# Hello", cursorCh: 3 };
            expect(flipLine(params).newLine).toBe("# Hello");
        });
    });

    describe("BulletList transformation", () => {
        it("should transform '- Hello' into '- Hello' (basic bullet)", () => {
            const params: TransformParams = { line: "- Hello", cursorCh: 1 };
            expect(flipLine(params).newLine).toBe("- Hello");
        });
        it("should override '## - Hello' into '- Hello'", () => {
            const params: TransformParams = { line: "## - Hello", cursorCh: 4 };
            expect(flipLine(params).newLine).toBe("- Hello");
        });
        it("should override '### - Hello' into '- Hello'", () => {
            const params: TransformParams = { line: "### - Hello", cursorCh: 5 };
            expect(flipLine(params).newLine).toBe("- Hello");
        });
        it("should override '> - Hello' into '- Hello'", () => {
            const params: TransformParams = { line: "> - Hello", cursorCh: 3 };
            expect(flipLine(params).newLine).toBe("- Hello");
        });
        it("should override '1. - Hello' into '- Hello'", () => {
            const params: TransformParams = { line: "1. - Hello", cursorCh: 4 };
            expect(flipLine(params).newLine).toBe("- Hello");
        });
        // 아래 2개는 같은 입력('- Hello')를 테스트하므로, 이름만 조금 다르게 구분:
        it("should transform '- Hello' into '- Hello' (duplicate test A)", () => {
            const params: TransformParams = { line: "- Hello", cursorCh: 1 };
            expect(flipLine(params).newLine).toBe("- Hello");
        });
        it("should override '##- Hello' into '- Hello'", () => {
            const params: TransformParams = { line: "##- Hello", cursorCh: 4 };
            expect(flipLine(params).newLine).toBe("- Hello");
        });
        it("should override '###- Hello' into '- Hello'", () => {
            const params: TransformParams = { line: "###- Hello", cursorCh: 5 };
            expect(flipLine(params).newLine).toBe("- Hello");
        });
        it("should override '>- Hello' into '- Hello'", () => {
            const params: TransformParams = { line: ">- Hello", cursorCh: 3 };
            expect(flipLine(params).newLine).toBe("- Hello");
        });
        it("should override '1.- Hello' into '- Hello'", () => {
            const params: TransformParams = { line: "1.- Hello", cursorCh: 4 };
            expect(flipLine(params).newLine).toBe("- Hello");
        });
        // 동일 입력 '- Hello' 반복 테스트 (duplicate test B)
        it("should transform '- Hello' into '- Hello' (duplicate test B)", () => {
            const params: TransformParams = { line: "- Hello", cursorCh: 1 };
            expect(flipLine(params).newLine).toBe("- Hello");
        });
    });

    describe("Blockquote transformation", () => {
        it("should transform '- > Hello' into '> Hello'", () => {
            const params: TransformParams = { line: "- > Hello", cursorCh: 2 };
            expect(flipLine(params).newLine).toBe("> Hello");
        });
        it("should transform '### > Hello' into '> Hello'", () => {
            const params: TransformParams = { line: "### > Hello", cursorCh: 1 };
            expect(flipLine(params).newLine).toBe("> Hello");
        });
        // 수정: 실제 입력은 '> - Hello' 이고 결과는 '- Hello' (bullet override)
        it("should transform '> - Hello' into '- Hello' (override to bullet)", () => {
            const params: TransformParams = { line: "> - Hello", cursorCh: 1 };
            expect(flipLine(params).newLine).toBe("- Hello");
        });
        it("should transform '1. > Hello' into '> Hello'", () => {
            const params: TransformParams = { line: "1. > Hello", cursorCh: 3 };
            expect(flipLine(params).newLine).toBe("> Hello");
        });
        it("should transform '-> Hello' into '> Hello'", () => {
            const params: TransformParams = { line: "-> Hello", cursorCh: 2 };
            expect(flipLine(params).newLine).toBe("> Hello");
        });
        it("should transform '###> Hello' into '> Hello'", () => {
            const params: TransformParams = { line: "###> Hello", cursorCh: 1 };
            expect(flipLine(params).newLine).toBe("> Hello");
        });
        // 수정: 실제 입력은 '>- Hello' 이고 결과는 '- Hello'
        it("should transform '>- Hello' into '- Hello' (override to bullet)", () => {
            const params: TransformParams = { line: ">- Hello", cursorCh: 1 };
            expect(flipLine(params).newLine).toBe("- Hello");
        });
        it("should transform '1.> Hello' into '> Hello'", () => {
            const params: TransformParams = { line: "1.> Hello", cursorCh: 3 };
            expect(flipLine(params).newLine).toBe("> Hello");
        });
    });

    describe("NumberedList transformation", () => {
        it("should normalize '1.   Hello' into '1. Hello'", () => {
            const params: TransformParams = { line: "1.   Hello", cursorCh: 3 };
            expect(flipLine(params).newLine).toBe("1. Hello");
        });
        it("should transform '12.  Hello' into '12. Hello'", () => {
            const params: TransformParams = { line: "12.  Hello", cursorCh: 4 };
            expect(flipLine(params).newLine).toBe("12. Hello");
        });
        it("should transform '99.    Hello' into '99. Hello'", () => {
            const params: TransformParams = { line: "99.    Hello", cursorCh: 4 };
            expect(flipLine(params).newLine).toBe("99. Hello");
        });
        it("should transform '- 1. Hello' into '1. Hello'", () => {
            const params: TransformParams = { line: "- 1. Hello", cursorCh: 4 };
            expect(flipLine(params).newLine).toBe("1. Hello");
        });
        it("should transform '> 1. Hello' into '1. Hello'", () => {
            const params: TransformParams = { line: "> 1. Hello", cursorCh: 3 };
            expect(flipLine(params).newLine).toBe("1. Hello");
        });
        it("should transform '1. 1. Hello' into '1. 1. Hello'", () => {
            const params: TransformParams = { line: "1. 1. Hello", cursorCh: 3 };
            expect(flipLine(params).newLine).toBe("1. 1. Hello");
        });
        it("should transform '# 1. Hello' into '1. Hello'", () => {
            const params: TransformParams = { line: "# 1. Hello", cursorCh: 3 };
            expect(flipLine(params).newLine).toBe("1. Hello");
        });
        it("should transform '-1. Hello' into '1. Hello'", () => {
            const params: TransformParams = { line: "-1. Hello", cursorCh: 4 };
            expect(flipLine(params).newLine).toBe("1. Hello");
        });
        it("should transform '>1. Hello' into '1. Hello'", () => {
            const params: TransformParams = { line: ">1. Hello", cursorCh: 3 };
            expect(flipLine(params).newLine).toBe("1. Hello");
        });
        it("should transform '1.1. Hello' into '1.1. Hello'", () => {
            const params: TransformParams = { line: "1.1. Hello", cursorCh: 3 };
            expect(flipLine(params).newLine).toBe("1.1. Hello");
        });
        it("should transform '#1. Hello' into '1. Hello'", () => {
            const params: TransformParams = { line: "#1. Hello", cursorCh: 3 };
            expect(flipLine(params).newLine).toBe("1. Hello");
        });
    });

    describe("Empty line transformation", () => {
        it("should transform '' into ''", () => {
            const params: TransformParams = { line: "", cursorCh: 0 };
            expect(flipLine(params).newLine).toBe("");
        });

        it("should transform ' ' into ' '", () => {
            const params: TransformParams = { line: " ", cursorCh: 0 };
            expect(flipLine(params).newLine).toBe(" ");
        });

        it("should transform '1. ~ Hello' into 'Hello'", () => {
            const params: TransformParams = { line: "1. ~ Hello", cursorCh: 3 };
            expect(flipLine(params).newLine).toBe("Hello");
            expect(flipLine(params).nextCursor).toBe(0);
        });

        it("should transform '- ~ Hello' into 'Hello'", () => {
            const params: TransformParams = { line: "- ~ Hello", cursorCh: 3 };
            expect(flipLine(params).newLine).toBe("Hello");
            expect(flipLine(params).nextCursor).toBe(0);
        });

        it("should transform '> ~ Hello' into 'Hello'", () => {
            const params: TransformParams = { line: "> ~ Hello", cursorCh: 3 };
            expect(flipLine(params).newLine).toBe("Hello");
            expect(flipLine(params).nextCursor).toBe(0);
        });

        it("should transform '# ~ Hello' into 'Hello'", () => {
            const params: TransformParams = { line: "# ~ Hello", cursorCh: 3 };
            expect(flipLine(params).newLine).toBe("Hello");
            expect(flipLine(params).nextCursor).toBe(0);
        });

        it("should transform '1. ~and byebye' into 'and byebye'", () => {
            const params: TransformParams = { line: "1. ~and byebye", cursorCh: 3 };
            expect(flipLine(params).newLine).toBe("and byebye");
            expect(flipLine(params).nextCursor).toBe(0);
        });
    });
});
