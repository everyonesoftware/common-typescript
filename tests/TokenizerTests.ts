import { Iterator, JavascriptIterable, PreConditionError, Tokenizer } from "../sources";
import { Token } from "../sources/Token";
import { Test } from "./test";
import { TestRunner } from "./testRunner";

export function test(runner: TestRunner): void
{
    runner.testFile("Tokenizer.ts", () =>
    {
        runner.testType("Tokenizer", () =>
        {
            runner.testFunction("create()", () =>
            {
                function createErrorTest(characters: Iterator<string>, expected: Error): void
                {
                    runner.test(`with ${runner.toString(characters)}`, (test: Test) =>
                    {
                        test.assertThrows(() => Tokenizer.create(characters), expected);
                    });
                }

                createErrorTest(undefined!, new PreConditionError(
                    "Expression: characters",
                    "Expected: not undefined and not null",
                    "Actual: undefined",
                ));
                createErrorTest(null!, new PreConditionError(
                    "Expression: characters",
                    "Expected: not undefined and not null",
                    "Actual: null",
                ));

                function createTest(characters: string): void
                {
                    runner.test(`with ${runner.toString(characters)}`, (test: Test) =>
                    {
                        const tokenizer: Tokenizer = Tokenizer.create(Iterator.create(characters));
                        test.assertNotUndefinedAndNotNull(tokenizer);
                        test.assertFalse(tokenizer.hasStarted());
                        test.assertFalse(tokenizer.hasCurrent());
                    });
                }

                createTest("");
                createTest("abc");
            });

            runner.testFunction("next()", () =>
            {
                function nextTest(text: string, expected: Token | JavascriptIterable<Token>): void
                {
                    runner.test(`with ${runner.toString(text)}`, (test: Test) =>
                    {
                        if (expected instanceof Token)
                        {
                            expected = [expected];
                        }

                        const tokenizer: Tokenizer = Tokenizer.create(text);

                        const tokens: Token[] = tokenizer.toArray().await();
                        test.assertEqual(expected, tokens);

                        test.assertTrue(tokenizer.hasStarted());
                        test.assertFalse(tokenizer.hasCurrent());
                    });
                }

                nextTest("", []);
                nextTest(" ", Token.whitespace(" "));
                nextTest("\t", Token.whitespace("\t"));
                nextTest("\n", Token.newLine());
                nextTest("\r\n", Token.newLine("\r\n"));
                nextTest("\r", Token.whitespace("\r"));
                nextTest("(", Token.leftParenthesis());
                nextTest(")", Token.rightParenthesis());
                nextTest(".", Token.period());
                nextTest("_", Token.underscore());
                nextTest("a", Token.letters("a"));
                nextTest("abcdef", Token.letters("abcdef"));
                nextTest("1", Token.digits("1"));
                nextTest("1234", Token.digits("1234"));
                nextTest("/", Token.forwardSlash());
                nextTest("\\", Token.backslash());
                nextTest(":", Token.colon());
                nextTest("*", Token.unknown("*"));
                nextTest("  at ", [
                    Token.whitespace("  "),
                    Token.letters("at"),
                    Token.whitespace(" "),
                ]);
                nextTest("  at _AssertTest.assertEqual (tests/assertTest.ts:76:16)", [
                    Token.whitespace("  "),
                    Token.letters("at"),
                    Token.whitespace(" "),
                    Token.underscore(),
                    Token.letters("AssertTest"),
                    Token.period(),
                    Token.letters("assertEqual"),
                    Token.whitespace(" "),
                    Token.leftParenthesis(),
                    Token.letters("tests"),
                    Token.forwardSlash(),
                    Token.letters("assertTest"),
                    Token.period(),
                    Token.letters("ts"),
                    Token.colon(),
                    Token.digits("76"),
                    Token.colon(),
                    Token.digits("16"),
                    Token.rightParenthesis(),
                ]);
                nextTest("  at tests/TokenizerTests.ts:61:30", [
                    Token.whitespace("  "),
                    Token.letters("at"),
                    Token.whitespace(" "),
                    Token.letters("tests"),
                    Token.forwardSlash(),
                    Token.letters("TokenizerTests"),
                    Token.period(),
                    Token.letters("ts"),
                    Token.colon(),
                    Token.digits("61"),
                    Token.colon(),
                    Token.digits("30"),
                ]);
            });
        });
    });
}