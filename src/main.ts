// src/main.ts
import { MarkdownView, Plugin } from "obsidian";
import flipLine from "./flipLine";
import hasMarker from "./hasMarker";

export default class MarkdownFlipPlugin extends Plugin {
    onload() {
        this.registerDomEvent(document, "keydown", (event: KeyboardEvent) => {
            if (event.key !== " ") {
                return;
            }

            const view = this.app.workspace.getActiveViewOfType(MarkdownView);
            if (!view) {
                return;
            }

            const editor = view.editor;
            const cursor = editor.getCursor();
            const line = editor.getLine(cursor.line);

            if (!hasMarker(line)) {
                return;
            }

            const { newLine, nextCursor } = flipLine({
                line,
                cursorCh: cursor.ch,
            });

            if (newLine !== line) {
                editor.setLine(cursor.line, newLine);
                editor.setCursor({ line: cursor.line, ch: nextCursor });
                event.preventDefault(); // Prevent default space input
            }
        });
    }
}
