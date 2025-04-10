# Source Code - Obsidian Markdown Flip

This folder contains the core source code for the Obsidian plugin **Markdown Flip**, which allows users to quickly convert or remove markdown block markers (e.g., `-`, `1.`, `>`, `#`, `~`) by typing and pressing space.

---

## 📦 Folder Structure

```
src/
├── main.ts              # Plugin entry point for Obsidian
├── flipLine.ts          # Main logic to transform markdown line formats
├── isFlipLine.ts        # Checks if a line is eligible for transformation
├── extractMarkers.ts    # Parses leading markdown markers from a line
├── markers.ts           # Shared marker regex and representation
├── types.ts             # Common TypeScript types used across the plugin
```

---

## 🧠 Overview

- **main.ts**  
  Registers the plugin with Obsidian and binds the space key event to trigger transformation logic.

- **flipLine.ts**  
  Handles line conversion logic, determining the effective marker and transforming the line accordingly.

- **isFlipLine.ts**  
  A utility to determine if a given line should be processed by the plugin (i.e., contains convertible markers).

- **extractMarkers.ts**  
  Extracts one or more valid markdown marker tokens from the beginning of a line.

- **markers.ts**  
  Centralizes all markdown marker types and their regex patterns, for consistency and maintainability.

- **types.ts**  
  Defines shared interfaces like `TransformParams`, `TransformResult`, and `MarkerType`.

---

## 🧪 Testing

Corresponding unit tests are located in the `test/` folder at the project root.  
Tests are written using **Jest**, covering all transformation and recognition behaviors.
