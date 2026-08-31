import { PreConditionError } from "../sources/preConditionError.js";
import {
    escape, escapeAndQuote, getLength, isDigit, isLetter, isLetterOrDigit, isLowercasedLetter,
    isUppercasedLetter, isWhitespace, iterateLines, join, quote
} from "../sources/strings.js";
import { Test } from "./test.js";
import { TestRunner } from "./testRunner.js";

export function test(runner: TestRunner): void
{
    runner.testFile("strings.ts", () =>
    {
        runner.testFunction("getLength(string | undefined | null)", () =>
        {
            function getLengthTest(value: string | undefined | null, expected: number): void
            {
                runner.test(`with ${runner.toString(value)}`, (test: Test) =>
                {
                    test.assertSame(getLength(value), expected);
                });
            }

            getLengthTest(undefined, 0);
            getLengthTest(null, 0);
            getLengthTest("", 0);
            getLengthTest("a", 1);
            getLengthTest("abc", 3);
        });

        runner.testFunction("join(string, string[])", () =>
        {
            function joinErrorTest(separator: string, values: string[], expected: Error): void
            {
                runner.test(`with ${runner.andList([separator, values.map(v => runner.toString(v))])}`, (test: Test) =>
                {
                    test.assertThrows(() => join(separator, values), expected);
                });
            }

            joinErrorTest(undefined!, [],
                new PreConditionError(
                    "Expression: separator",
                    "Expected: not undefined and not null",
                    "Actual: undefined"));
            joinErrorTest(undefined!, ["a"],
                new PreConditionError(
                    "Expression: separator",
                    "Expected: not undefined and not null",
                    "Actual: undefined"));
            joinErrorTest(undefined!, ["a", "b"],
                new PreConditionError(
                    "Expression: separator",
                    "Expected: not undefined and not null",
                    "Actual: undefined"));
            joinErrorTest(undefined!, ["a", "b", "c"],
                new PreConditionError(
                    "Expression: separator",
                    "Expected: not undefined and not null",
                    "Actual: undefined"));

            joinErrorTest(null!, [],
                new PreConditionError(
                    "Expression: separator",
                    "Expected: not undefined and not null",
                    "Actual: null"));
            joinErrorTest(null!, ["a"],
                new PreConditionError(
                    "Expression: separator",
                    "Expected: not undefined and not null",
                    "Actual: null"));
            joinErrorTest(null!, ["a", "b"],
                new PreConditionError(
                    "Expression: separator",
                    "Expected: not undefined and not null",
                    "Actual: null"));
            joinErrorTest(null!, ["a", "b", "c"],
                new PreConditionError(
                    "Expression: separator",
                    "Expected: not undefined and not null",
                    "Actual: null"));

            function joinTest(separator: string, values: string[], expected: string): void
            {
                runner.test(`with ${runner.andList([separator, values.map(v => runner.toString(v))])}`, (test: Test) =>
                {
                    test.assertSame(join(separator, values), expected);
                });
            }

            

            joinTest("", [], "");
            joinTest("", ["a"], "a");
            joinTest("", ["a", "b"], "ab");
            joinTest("", ["a", "b", "c"], "abc");

            joinTest(" ", [], "");
            joinTest(" ", ["a"], "a");
            joinTest(" ", ["a", "b"], "a b");
            joinTest(" ", ["a", "b", "c"], "a b c");

            joinTest(" _ ", [], "");
            joinTest(" _ ", ["a"], "a");
            joinTest(" _ ", ["a", "b"], "a _ b");
            joinTest(" _ ", ["a", "b", "c"], "a _ b _ c");
        });

        runner.testFunction("escape(string|undefined|null,string[]|undefined)", () =>
        {
            function escapeTest(value: string | undefined | null, dontEscape: string[] | undefined, expected: string): void
            {
                runner.test(`with ${runner.andList([value, dontEscape?.map((value: string) => runner.toString(value))])}`, (test: Test) =>
                {
                    const result: string = escape(value, dontEscape);
                    test.assertSame(result, expected);
                });
            }

            escapeTest(undefined, undefined, "undefined");
            escapeTest(null, undefined, "null");
            escapeTest("", undefined, "");
            escapeTest("a", undefined, "a");
            escapeTest("A", undefined, "A");
            escapeTest("abc", undefined, "abc");
            escapeTest("\t", undefined, "\\t");
            escapeTest("\n", undefined, "\\n");
            escapeTest("\r", undefined, "\\r");
            escapeTest("'", undefined, "\\'");
            escapeTest("\"", undefined, "\\\"");
            escapeTest("&", undefined, "&");
            escapeTest(" \r\n \t ", undefined, " \\r\\n \\t ");
            escapeTest("\t", [], "\\t");
            escapeTest("\t", ["\n"], "\\t");
            escapeTest("\t", ["\t"], "\t");
        });

        runner.testFunction("quote(string|undefined|null)", () =>
        {
            function quoteTest(value: string | undefined | null, quoteString: string | undefined, expected: string): void
            {
                runner.test(`with ${runner.andList([value, quoteString])}`, (test: Test) =>
                {
                    const result: string = quote(value, quoteString);
                    test.assertSame(result, expected);
                });
            }

            quoteTest(undefined, undefined, "undefined");
            quoteTest(null, undefined, "null");
            quoteTest("", undefined, `""`);
            quoteTest("a", undefined, `"a"`);
            quoteTest("A", undefined, `"A"`);
            quoteTest("abc", undefined, `"abc"`);
            quoteTest("abc", "'", `'abc'`);
        });

        runner.testFunction("escapeAndQuote(string|undefined|null,string|undefined,string[]|undefined)", () =>
        {
            function escapeAndQuoteTest(value: string | undefined | null, quote: string | undefined, dontEscape: string[] | undefined, expected: string): void
            {
                runner.test(`with ${runner.andList([value, quote, dontEscape?.map(x => runner.toString(x))])}`, (test: Test) =>
                {
                    const result: string = escapeAndQuote(value, quote, dontEscape);
                    test.assertSame(result, expected);
                });
            }

            escapeAndQuoteTest(undefined, undefined, undefined, "undefined");
            escapeAndQuoteTest(null, undefined, undefined, "null");
            escapeAndQuoteTest("", undefined, undefined, `""`);
            escapeAndQuoteTest("a", undefined, undefined, `"a"`);
            escapeAndQuoteTest("A", undefined, undefined, `"A"`);
            escapeAndQuoteTest("abc", undefined, undefined, `"abc"`);
            escapeAndQuoteTest("\t", undefined, undefined, `"\\t"`);
            escapeAndQuoteTest("\n", undefined, undefined, `"\\n"`);
            escapeAndQuoteTest("\r", undefined, undefined, `"\\r"`);
            escapeAndQuoteTest("'", undefined, undefined, `"\\'"`);
            escapeAndQuoteTest("\"", undefined, undefined, `"\\""`);
            escapeAndQuoteTest("&", undefined, undefined, `"&"`);
            escapeAndQuoteTest(" \r\n \t ", undefined, undefined, `" \\r\\n \\t "`);
            escapeAndQuoteTest("\t", undefined, [], `"\\t"`);
            escapeAndQuoteTest("\t", undefined, ["\n"], `"\\t"`);
            escapeAndQuoteTest("\t", undefined, ["\t"], `"\t"`);
        });

        runner.testFunction("isWhitespace(string)", () =>
        {
            function isWhitespaceErrorTest(value: string | undefined | null, expectedError: Error): void
            {
                runner.test(`with ${runner.toString(value)}`, (test: Test) =>
                {
                    test.assertThrows(() => isWhitespace(value!), expectedError);
                });
            }

            isWhitespaceErrorTest(undefined, new PreConditionError(join("\n", [
                "Expression: value",
                "Expected: not undefined and not null",
                "Actual: undefined",
            ])));
            isWhitespaceErrorTest(null, new PreConditionError(join("\n", [
                "Expression: value",
                "Expected: not undefined and not null",
                "Actual: null",
            ])));
            isWhitespaceErrorTest("", new PreConditionError(join("\n", [
                "Expression: value.length",
                "Expected: 1",
                "Actual: 0",
            ])));
            isWhitespaceErrorTest("  ", new PreConditionError(join("\n", [
                "Expression: value.length",
                "Expected: 1",
                "Actual: 2",
            ])));

            function isWhitespaceTest(value: string, expected: boolean): void
            {
                runner.test(`with ${runner.toString(value)}`, (test: Test) =>
                {
                    test.assertSame(isWhitespace(value), expected);
                });
            }

            isWhitespaceTest(" ", true);
            isWhitespaceTest("\n", true);
            isWhitespaceTest("\r", true);
            isWhitespaceTest("\t", true);

            isWhitespaceTest("a", false);
            isWhitespaceTest("_", false);
            isWhitespaceTest("-", false);
        });

        runner.testFunction("isLetter(string)", () =>
        {
            function isLetterErrorTest(value: string | undefined | null, expectedError: Error): void
            {
                runner.test(`with ${runner.toString(value)}`, (test: Test) =>
                {
                    test.assertThrows(() => isLetter(value!), expectedError);
                });
            }

            isLetterErrorTest(undefined, new PreConditionError(join("\n", [
                "Expression: value",
                "Expected: not undefined and not null",
                "Actual: undefined",
            ])));
            isLetterErrorTest(null, new PreConditionError(join("\n", [
                "Expression: value",
                "Expected: not undefined and not null",
                "Actual: null",
            ])));
            isLetterErrorTest("", new PreConditionError(join("\n", [
                "Expression: value.length",
                "Expected: 1",
                "Actual: 0",
            ])));
            isLetterErrorTest("  ", new PreConditionError(join("\n", [
                "Expression: value.length",
                "Expected: 1",
                "Actual: 2",
            ])));

            function isLetterTest(value: string, expected: boolean): void
            {
                runner.test(`with ${runner.toString(value)}`, (test: Test) =>
                {
                    test.assertSame(isLetter(value), expected);
                });
            }

            isLetterTest("a", true);
            isLetterTest("m", true);
            isLetterTest("z", true);
            isLetterTest("A", true);
            isLetterTest("N", true);
            isLetterTest("Z", true);
            
            isLetterTest(" ", false);
            isLetterTest("\n", false);
            isLetterTest("\r", false);
            isLetterTest("\t", false);
            isLetterTest("_", false);
            isLetterTest("-", false);
            isLetterTest("5", false);
        });

        runner.testFunction("isLowercasedLetter(string)", () =>
        {
            function isLowercasedLetterErrorTest(value: string | undefined | null, expectedError: Error): void
            {
                runner.test(`with ${runner.toString(value)}`, (test: Test) =>
                {
                    test.assertThrows(() => isLowercasedLetter(value!), expectedError);
                });
            }

            isLowercasedLetterErrorTest(undefined, new PreConditionError(join("\n", [
                "Expression: value",
                "Expected: not undefined and not null",
                "Actual: undefined",
            ])));
            isLowercasedLetterErrorTest(null, new PreConditionError(join("\n", [
                "Expression: value",
                "Expected: not undefined and not null",
                "Actual: null",
            ])));
            isLowercasedLetterErrorTest("", new PreConditionError(join("\n", [
                "Expression: value.length",
                "Expected: 1",
                "Actual: 0",
            ])));
            isLowercasedLetterErrorTest("  ", new PreConditionError(join("\n", [
                "Expression: value.length",
                "Expected: 1",
                "Actual: 2",
            ])));

            function isLowercasedLetterTest(value: string, expected: boolean): void
            {
                runner.test(`with ${runner.toString(value)}`, (test: Test) =>
                {
                    test.assertSame(isLowercasedLetter(value), expected);
                });
            }

            isLowercasedLetterTest("a", true);
            isLowercasedLetterTest("m", true);
            isLowercasedLetterTest("z", true);

            isLowercasedLetterTest("A", false);
            isLowercasedLetterTest("N", false);
            isLowercasedLetterTest("Z", false);
            isLowercasedLetterTest(" ", false);
            isLowercasedLetterTest("\n", false);
            isLowercasedLetterTest("\r", false);
            isLowercasedLetterTest("\t", false);
            isLowercasedLetterTest("_", false);
            isLowercasedLetterTest("-", false);
            isLowercasedLetterTest("5", false);
        });

        runner.testFunction("isUppercasedLetter(string)", () =>
        {
            function isUppercasedLetterErrorTest(value: string | undefined | null, expectedError: Error): void
            {
                runner.test(`with ${runner.toString(value)}`, (test: Test) =>
                {
                    test.assertThrows(() => isUppercasedLetter(value!), expectedError);
                });
            }

            isUppercasedLetterErrorTest(undefined, new PreConditionError(join("\n", [
                "Expression: value",
                "Expected: not undefined and not null",
                "Actual: undefined",
            ])));
            isUppercasedLetterErrorTest(null, new PreConditionError(join("\n", [
                "Expression: value",
                "Expected: not undefined and not null",
                "Actual: null",
            ])));
            isUppercasedLetterErrorTest("", new PreConditionError(join("\n", [
                "Expression: value.length",
                "Expected: 1",
                "Actual: 0",
            ])));
            isUppercasedLetterErrorTest("  ", new PreConditionError(join("\n", [
                "Expression: value.length",
                "Expected: 1",
                "Actual: 2",
            ])));

            function isUppercasedLetterTest(value: string, expected: boolean): void
            {
                runner.test(`with ${runner.toString(value)}`, (test: Test) =>
                {
                    test.assertSame(isUppercasedLetter(value), expected);
                });
            }
            
            isUppercasedLetterTest("A", true);
            isUppercasedLetterTest("N", true);
            isUppercasedLetterTest("Z", true);

            isUppercasedLetterTest("a", false);
            isUppercasedLetterTest("m", false);
            isUppercasedLetterTest("z", false);
            isUppercasedLetterTest(" ", false);
            isUppercasedLetterTest("\n", false);
            isUppercasedLetterTest("\r", false);
            isUppercasedLetterTest("\t", false);
            isUppercasedLetterTest("_", false);
            isUppercasedLetterTest("-", false);
            isUppercasedLetterTest("5", false);
        });

        runner.testFunction("isDigit(string)", () =>
        {
            function isDigitErrorTest(value: string | undefined | null, expectedError: Error): void
            {
                runner.test(`with ${runner.toString(value)}`, (test: Test) =>
                {
                    test.assertThrows(() => isDigit(value!), expectedError);
                });
            }

            isDigitErrorTest(undefined, new PreConditionError(join("\n", [
                "Expression: value",
                "Expected: not undefined and not null",
                "Actual: undefined",
            ])));
            isDigitErrorTest(null, new PreConditionError(join("\n", [
                "Expression: value",
                "Expected: not undefined and not null",
                "Actual: null",
            ])));
            isDigitErrorTest("", new PreConditionError(join("\n", [
                "Expression: value.length",
                "Expected: 1",
                "Actual: 0",
            ])));
            isDigitErrorTest("  ", new PreConditionError(join("\n", [
                "Expression: value.length",
                "Expected: 1",
                "Actual: 2",
            ])));

            function isDigitTest(value: string, expected: boolean): void
            {
                runner.test(`with ${runner.toString(value)}`, (test: Test) =>
                {
                    test.assertSame(isDigit(value), expected);
                });
            }
            
            isDigitTest("0", true);
            isDigitTest("5", true);
            isDigitTest("9", true);

            isDigitTest(".", false);
            isDigitTest("a", false);
            isDigitTest("m", false);
            isDigitTest("z", false);
            isDigitTest("A", false);
            isDigitTest("N", false);
            isDigitTest("Z", false);
            isDigitTest(" ", false);
            isDigitTest("\n", false);
            isDigitTest("\r", false);
            isDigitTest("\t", false);
            isDigitTest("_", false);
            isDigitTest("-", false);
        });

        runner.testFunction("isLetterOrDigit(string)", () =>
        {
            function isLetterOrDigitErrorTest(value: string | undefined | null, expectedError: Error): void
            {
                runner.test(`with ${runner.toString(value)}`, (test: Test) =>
                {
                    test.assertThrows(() => isLetterOrDigit(value!), expectedError);
                });
            }

            isLetterOrDigitErrorTest(undefined, new PreConditionError(join("\n", [
                "Expression: value",
                "Expected: not undefined and not null",
                "Actual: undefined",
            ])));
            isLetterOrDigitErrorTest(null, new PreConditionError(join("\n", [
                "Expression: value",
                "Expected: not undefined and not null",
                "Actual: null",
            ])));
            isLetterOrDigitErrorTest("", new PreConditionError(join("\n", [
                "Expression: value.length",
                "Expected: 1",
                "Actual: 0",
            ])));
            isLetterOrDigitErrorTest("ab", new PreConditionError(join("\n", [
                "Expression: value.length",
                "Expected: 1",
                "Actual: 2",
            ])));

            function isLetterOrDigitTest(value: string, expected: boolean): void
            {
                runner.test(`with ${runner.toString(value)}`, (test: Test) =>
                {
                    test.assertSame(isLetterOrDigit(value), expected);
                });
            }
            
            isLetterOrDigitTest("0", true);
            isLetterOrDigitTest("5", true);
            isLetterOrDigitTest("9", true);
            isLetterOrDigitTest("a", true);
            isLetterOrDigitTest("m", true);
            isLetterOrDigitTest("z", true);
            isLetterOrDigitTest("A", true);
            isLetterOrDigitTest("N", true);
            isLetterOrDigitTest("Z", true);

            isLetterOrDigitTest(".", false);
            isLetterOrDigitTest(" ", false);
            isLetterOrDigitTest("\n", false);
            isLetterOrDigitTest("\r", false);
            isLetterOrDigitTest("\t", false);
            isLetterOrDigitTest("_", false);
            isLetterOrDigitTest("-", false);
        });

        runner.testFunction("iterateLines()", () =>
        {
            function iterateLinesTest(value: string, expected: string[]): void
            {
                runner.test(`with ${runner.toString(value)}`, (test: Test) =>
                {
                    const lines: string[] = iterateLines(value).toArray().await();
                    test.assertEqual(expected, lines);
                });
            }

            iterateLinesTest(undefined!, []);
            iterateLinesTest(null!, []);
            iterateLinesTest("", []);
            iterateLinesTest("\n", ["", ""]);
            iterateLinesTest("a", ["a"]);
            iterateLinesTest("abc", ["abc"]);
            iterateLinesTest("a\nb", ["a", "b"]);
            iterateLinesTest("a\r\nb", ["a", "b"]);
            iterateLinesTest("a\nb\n", ["a", "b", ""]);
            iterateLinesTest("a\nb\nc", ["a", "b", "c"]);
        });
    });
}