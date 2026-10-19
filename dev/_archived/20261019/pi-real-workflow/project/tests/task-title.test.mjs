import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { normalizeTaskTitle } from "../src/task-title.mjs";

describe("normalizeTaskTitle", () => {
  describe("AC-01: Module Export", () => {
    it("should export normalizeTaskTitle as a function", () => {
      assert.equal(typeof normalizeTaskTitle, "function");
    });
  });

  describe("AC-02: Non-string input validation", () => {
    const invalidInputs = [
      { name: "null", value: null },
      { name: "undefined", value: undefined },
      { name: "number (0)", value: 0 },
      { name: "number (positive)", value: 123 },
      { name: "number (NaN)", value: Number.NaN },
      { name: "boolean (true)", value: true },
      { name: "boolean (false)", value: false },
      { name: "plain object", value: {} },
      { name: "object with title property", value: { title: "Fix bug" } },
      { name: "empty array", value: [] },
      { name: "string array", value: ["Task Title"] },
      { name: "symbol", value: Symbol("title") },
      { name: "bigint", value: 42n },
    ];

    for (const { name, value } of invalidInputs) {
      it(`should throw TypeError for ${name} input`, () => {
        assert.throws(
          () => normalizeTaskTitle(value),
          (err) => {
            assert(err instanceof TypeError, `Expected TypeError but got ${err?.name || err}`);
            return true;
          }
        );
      });
    }
  });

  describe("AC-03: Whitespace trimming and normalization", () => {
    it("should trim leading standard whitespace", () => {
      assert.equal(normalizeTaskTitle("   Task Title"), "Task Title");
    });

    it("should trim trailing standard whitespace", () => {
      assert.equal(normalizeTaskTitle("Task Title   "), "Task Title");
    });

    it("should trim both leading and trailing standard whitespace", () => {
      assert.equal(normalizeTaskTitle("  \t  Task Title  \r\n  "), "Task Title");
    });

    it("should replace multiple consecutive standard spaces with a single space", () => {
      assert.equal(normalizeTaskTitle("Task     Title"), "Task Title");
    });

    it("should collapse internal tabs, newlines, and carriage returns to a single space", () => {
      assert.equal(normalizeTaskTitle("Task\t\tTitle"), "Task Title");
      assert.equal(normalizeTaskTitle("Task\nTitle"), "Task Title");
      assert.equal(normalizeTaskTitle("Task\r\nTitle"), "Task Title");
      assert.equal(normalizeTaskTitle("Task \t \r\n Title"), "Task Title");
    });

    it("should trim leading and trailing Unicode whitespace", () => {
      assert.equal(normalizeTaskTitle("\u00A0Task Title"), "Task Title");
      assert.equal(normalizeTaskTitle("Task Title\u00A0"), "Task Title");
      assert.equal(normalizeTaskTitle("\u2002\u2003Task Title\u3000"), "Task Title");
    });

    it("should collapse internal Unicode whitespace sequences to a single space", () => {
      // \u00A0: Non-breaking space
      assert.equal(normalizeTaskTitle("Task\u00A0Title"), "Task Title");
      // \u2002: En space, \u2003: Em space
      assert.equal(normalizeTaskTitle("Task\u2002\u2003Title"), "Task Title");
      // \u2009: Thin space, \u3000: Ideographic space
      assert.equal(normalizeTaskTitle("Task\u2009\u3000Title"), "Task Title");
      // Mixed Unicode and standard whitespace
      assert.equal(normalizeTaskTitle("Task \u00A0\t \u2003 Title"), "Task Title");
    });

    it("should handle multiple words with varied whitespace sequences", () => {
      const input = "  \u00A0Fix  \t all\u2003known   bugs\r\n in \u3000 production \t ";
      const expected = "Fix all known bugs in production";
      assert.equal(normalizeTaskTitle(input), expected);
    });
  });

  describe("AC-04: Preservation of case and punctuation", () => {
    it("should preserve uppercase, lowercase, and mixed letter casing intact", () => {
      assert.equal(normalizeTaskTitle("ALL UPPERCASE"), "ALL UPPERCASE");
      assert.equal(normalizeTaskTitle("all lowercase"), "all lowercase");
      assert.equal(normalizeTaskTitle("camelCase and PascalCase"), "camelCase and PascalCase");
      assert.equal(normalizeTaskTitle("mIxEd CaSe InPuT"), "mIxEd CaSe InPuT");
    });

    it("should preserve punctuation marks including colons, hyphens, and brackets", () => {
      const input = "feat(auth): add OAuth2 support - #123";
      assert.equal(normalizeTaskTitle(input), input);
    });

    it("should preserve symbols, quotes, math symbols, and special punctuation", () => {
      const input = "[BUG] 'fix' \"critical\" issue?! ($100 & 50% / @team * <tag>)";
      assert.equal(normalizeTaskTitle(input), input);
    });

    it("should preserve punctuation at string boundaries while trimming whitespace", () => {
      assert.equal(normalizeTaskTitle("  ...loading...  "), "...loading...");
      assert.equal(normalizeTaskTitle("  !important!  "), "!important!");
      assert.equal(normalizeTaskTitle("  --flag--  "), "--flag--");
    });

    it("should preserve accented letters, non-ASCII characters, and unicode punctuation", () => {
      const input = "Café — crème: déjà-vu «test» & 100€";
      assert.equal(normalizeTaskTitle(`  ${input}  `), input);
    });
  });

  describe("AC-05: Empty after trimming validation", () => {
    it("should throw Error when input is an empty string", () => {
      assert.throws(
        () => normalizeTaskTitle(""),
        (err) => {
          assert(err instanceof Error, `Expected Error but got ${err}`);
          return true;
        }
      );
    });

    it("should throw Error when input contains only standard whitespace", () => {
      const inputs = [" ", "   ", "\t", "\n", "\r", "  \t \r\n  "];
      for (const input of inputs) {
        assert.throws(
          () => normalizeTaskTitle(input),
          (err) => {
            assert(err instanceof Error, `Expected Error but got ${err}`);
            return true;
          }
        );
      }
    });

    it("should throw Error when input contains only Unicode whitespace", () => {
      const inputs = [
        "\u00A0",
        "\u2002",
        "\u2003",
        "\u3000",
        "  \u00A0 \u2002\u2003 \u3000 \t\n  ",
      ];
      for (const input of inputs) {
        assert.throws(
          () => normalizeTaskTitle(input),
          (err) => {
            assert(err instanceof Error, `Expected Error but got ${err}`);
            return true;
          }
        );
      }
    });
  });
});
