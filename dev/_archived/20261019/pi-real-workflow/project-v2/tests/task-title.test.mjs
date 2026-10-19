import test, { describe, it } from "node:test";
import assert from "node:assert/strict";
import { normalizeTaskTitle } from "../src/task-title.mjs";

describe("normalizeTaskTitle", () => {
  describe("public interface and export", () => {
    it("exports normalizeTaskTitle as a function", () => {
      assert.strictEqual(typeof normalizeTaskTitle, "function");
    });
  });

  describe("type validation (reject non-string inputs)", () => {
    it("throws TypeError for undefined", () => {
      assert.throws(() => normalizeTaskTitle(undefined), {
        name: "TypeError",
      });
    });

    it("throws TypeError for null", () => {
      assert.throws(() => normalizeTaskTitle(null), {
        name: "TypeError",
      });
    });

    it("throws TypeError for numbers (including 0, NaN, Infinity)", () => {
      for (const val of [0, 42, -1, NaN, Infinity]) {
        assert.throws(() => normalizeTaskTitle(val), {
          name: "TypeError",
        });
      }
    });

    it("throws TypeError for booleans", () => {
      assert.throws(() => normalizeTaskTitle(true), {
        name: "TypeError",
      });
      assert.throws(() => normalizeTaskTitle(false), {
        name: "TypeError",
      });
    });

    it("throws TypeError for objects and arrays", () => {
      assert.throws(() => normalizeTaskTitle({}), {
        name: "TypeError",
      });
      assert.throws(() => normalizeTaskTitle({ title: "Task" }), {
        name: "TypeError",
      });
      assert.throws(() => normalizeTaskTitle([]), {
        name: "TypeError",
      });
      assert.throws(() => normalizeTaskTitle(["Task"]), {
        name: "TypeError",
      });
    });

    it("throws TypeError for symbols and functions", () => {
      assert.throws(() => normalizeTaskTitle(Symbol("task")), {
        name: "TypeError",
      });
      assert.throws(() => normalizeTaskTitle(() => "task"), {
        name: "TypeError",
      });
    });

    it("throws TypeError for BigInt values", () => {
      assert.throws(() => normalizeTaskTitle(100n), {
        name: "TypeError",
      });
    });
  });

  describe("empty or whitespace-only inputs rejection", () => {
    it("throws Error (and not TypeError) for an empty string", () => {
      assert.throws(
        () => normalizeTaskTitle(""),
        (err) => {
          assert.strictEqual(err.name, "Error");
          assert.ok(err instanceof Error);
          assert.ok(!(err instanceof TypeError));
          return true;
        }
      );
    });

    it("throws Error for standard whitespace-only strings", () => {
      const whitespaceCases = [" ", "   ", "\t", "\n", "\r\n", "  \t \n  "];
      for (const input of whitespaceCases) {
        assert.throws(
          () => normalizeTaskTitle(input),
          (err) => {
            assert.strictEqual(err.name, "Error");
            assert.ok(!(err instanceof TypeError));
            return true;
          }
        );
      }
    });

    it("throws Error for Unicode whitespace-only strings", () => {
      const unicodeWhitespaceCases = [
        "\u00A0", // NO-BREAK SPACE
        "\u2000", // EN QUAD
        "\u2003", // EM SPACE
        "\u2009", // THIN SPACE
        "\u200A", // HAIR SPACE
        "\u202F", // NARROW NO-BREAK SPACE
        "\u205F", // MEDIUM MATHEMATICAL SPACE
        "\u3000", // IDEOGRAPHIC SPACE
        "\u00A0\u2003 \t \u3000", // mixed Unicode whitespace
      ];
      for (const input of unicodeWhitespaceCases) {
        assert.throws(
          () => normalizeTaskTitle(input),
          (err) => {
            assert.strictEqual(err.name, "Error");
            assert.ok(!(err instanceof TypeError));
            return true;
          }
        );
      }
    });
  });

  describe("leading and trailing whitespace trimming", () => {
    it("trims standard leading and trailing spaces", () => {
      assert.strictEqual(normalizeTaskTitle("  Clean room  "), "Clean room");
      assert.strictEqual(normalizeTaskTitle("   Ship feature"), "Ship feature");
      assert.strictEqual(normalizeTaskTitle("Ship feature   "), "Ship feature");
    });

    it("trims leading and trailing tabs, carriage returns, and newlines", () => {
      assert.strictEqual(
        normalizeTaskTitle("\t\n\r Write unit tests \r\n\t"),
        "Write unit tests"
      );
    });

    it("trims leading and trailing Unicode whitespace", () => {
      assert.strictEqual(
        normalizeTaskTitle("\u00A0Refactor auth module\u00A0"),
        "Refactor auth module"
      );
      assert.strictEqual(
        normalizeTaskTitle("\u3000Fix memory leak\u3000"),
        "Fix memory leak"
      );
      assert.strictEqual(
        normalizeTaskTitle("\u2002\u2003Review PR\u2009\u200A"),
        "Review PR"
      );
    });
  });

  describe("internal whitespace normalization", () => {
    it("collapses multiple consecutive standard spaces into a single space", () => {
      assert.strictEqual(
        normalizeTaskTitle("Update    API    documentation"),
        "Update API documentation"
      );
    });

    it("collapses mixed standard whitespace (tabs, newlines, spaces) into a single space", () => {
      assert.strictEqual(
        normalizeTaskTitle("Update\t\nAPI\r\n  documentation"),
        "Update API documentation"
      );
    });

    it("collapses internal Unicode whitespace into a single ordinary space (U+0020)", () => {
      const input = "Deploy\u00A0to\u3000production\u2003cluster";
      const expected = "Deploy to production cluster";
      const result = normalizeTaskTitle(input);

      assert.strictEqual(result, expected);
      // Ensure the separator is specifically standard ASCII space \u0020
      assert.strictEqual(result.charCodeAt(6), 0x0020);
      assert.strictEqual(result.charCodeAt(9), 0x0020);
      assert.strictEqual(result.charCodeAt(20), 0x0020);
    });

    it("collapses runs of mixed Unicode and ASCII whitespace into a single ordinary space", () => {
      const input = "Fix \u00A0\t\u2003 bug";
      assert.strictEqual(normalizeTaskTitle(input), "Fix bug");
    });
  });

  describe("case, punctuation, and character preservation", () => {
    it("preserves letter casing exactly (uppercase, lowercase, mixed case)", () => {
      assert.strictEqual(
        normalizeTaskTitle("OAuth2 Support for iOS & Android"),
        "OAuth2 Support for iOS & Android"
      );
      assert.strictEqual(
        normalizeTaskTitle("UPPERCASE and lowercase"),
        "UPPERCASE and lowercase"
      );
    });

    it("preserves punctuation, symbols, and special characters", () => {
      const title =
        'TASK-102: [Refactor] Fix "quotes", commas, colons: & #hashtags! (100%)';
      assert.strictEqual(normalizeTaskTitle(title), title);
    });

    it("preserves non-ASCII letters, accents, and emoji", () => {
      assert.strictEqual(
        normalizeTaskTitle("🚀 Tâche: Résoudre l'anomalie #42"),
        "🚀 Tâche: Résoudre l'anomalie #42"
      );
      assert.strictEqual(
        normalizeTaskTitle("機能追加: ユーザー認証フロー"),
        "機能追加: ユーザー認証フロー"
      );
    });
  });

  describe("integrated scenarios", () => {
    it("handles complex strings with leading/trailing unicode whitespace, internal runs, and symbols", () => {
      const input =
        "\u3000\t  [BUG-404]:   Fix   login   timeout!   \n\r\u00A0";
      const expected = "[BUG-404]: Fix login timeout!";
      assert.strictEqual(normalizeTaskTitle(input), expected);
    });

    it("handles single-character titles", () => {
      assert.strictEqual(normalizeTaskTitle(" A "), "A");
      assert.strictEqual(normalizeTaskTitle("\u00A0Z\u3000"), "Z");
      assert.strictEqual(normalizeTaskTitle("?"), "?");
    });
  });
});
