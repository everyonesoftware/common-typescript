import { CharacterWriteStream, InMemoryCharacterWriteStream, PreConditionError } from "../sources";
import { IndentedCharacterWriteStream } from "../sources/IndentedCharacterWriteStream";
import { Test } from "./test";
import { TestRunner } from "./testRunner";

export function test(runner: TestRunner): void
{
    runner.testFile("IndentedCharacterWriteStream.ts", () =>
    {
        runner.testType("IndentedCharacterWriteStream", () =>
        {
            runner.testFunction("create()", () =>
            {
                function createErrorTest(innerStream: CharacterWriteStream, expected: Error): void
                {
                    runner.test(`with ${runner.toString(innerStream)}`, (test: Test) =>
                    {
                        test.assertThrows(() => IndentedCharacterWriteStream.create(innerStream), expected);
                    });
                }

                createErrorTest(undefined!, new PreConditionError(
                    "Expression: innerStream",
                    "Expected: not undefined and not null",
                    "Actual: undefined",
                ));
                createErrorTest(null!, new PreConditionError(
                    "Expression: innerStream",
                    "Expected: not undefined and not null",
                    "Actual: null",
                ));

                runner.test("with valid innerStream", (test: Test) =>
                {
                    const innerStream: InMemoryCharacterWriteStream = InMemoryCharacterWriteStream.create();
                    const stream: IndentedCharacterWriteStream = IndentedCharacterWriteStream.create(innerStream);
                    test.assertNotUndefinedAndNotNull(stream);
                    test.assertEqual("", stream.getCurrentIndentation());
                    test.assertEqual("  ", stream.getSingleIndent());
                    test.assertEqual(0, stream.getCurrentIndentationCount());
                });
            });

            runner.testFunction("setSingleIndent()", () =>
            {
                function setSingleIndentErrorTest(singleIndent: string, expected: Error): void
                {
                    runner.test(`with ${runner.toString(singleIndent)}`, (test: Test) =>
                    {
                        const innerStream: InMemoryCharacterWriteStream = InMemoryCharacterWriteStream.create();
                        const stream: IndentedCharacterWriteStream = IndentedCharacterWriteStream.create(innerStream);
                        const initialSingleIndent: string = stream.getSingleIndent();

                        test.assertThrows(() => stream.setSingleIndent(singleIndent), expected);

                        test.assertEqual(initialSingleIndent, stream.getSingleIndent());
                        test.assertEqual(0, stream.getCurrentIndentationCount());
                        test.assertEqual("", innerStream.getWrittenText());
                    });
                }

                setSingleIndentErrorTest(undefined!, new PreConditionError(
                    "Expression: singleIndent",
                    "Expected: not undefined and not null",
                    "Actual: undefined",
                ));
                setSingleIndentErrorTest(null!, new PreConditionError(
                    "Expression: singleIndent",
                    "Expected: not undefined and not null",
                    "Actual: null",
                ));

                function setSingleIndentTest(singleIndent: string): void
                {
                    runner.test(`with ${runner.toString(singleIndent)}`, (test: Test) =>
                    {
                        const innerStream: InMemoryCharacterWriteStream = InMemoryCharacterWriteStream.create();
                        const stream: IndentedCharacterWriteStream = IndentedCharacterWriteStream.create(innerStream);

                        const result: IndentedCharacterWriteStream = stream.setSingleIndent(singleIndent);

                        test.assertSame(stream, result);
                        test.assertEqual(singleIndent, stream.getSingleIndent());
                        test.assertEqual(0, stream.getCurrentIndentationCount());
                        test.assertEqual("", innerStream.getWrittenText());
                    });
                }

                setSingleIndentTest("");
                setSingleIndentTest(" ");
                setSingleIndentTest("  ");
                setSingleIndentTest("    ");
                setSingleIndentTest("\t");
                setSingleIndentTest("abc");
            });

            runner.testFunction("addIndentation()", () =>
            {
                function addIndentationWithNoArgumentsTest(singleIndent: string): void
                {
                    runner.test(`with ${runner.toString(singleIndent)} single indent and no arguments`, (test: Test) =>
                    {
                        const innerStream: InMemoryCharacterWriteStream = InMemoryCharacterWriteStream.create();
                        const stream: IndentedCharacterWriteStream = IndentedCharacterWriteStream.create(innerStream)
                            .setSingleIndent(singleIndent);

                        const result: IndentedCharacterWriteStream = stream.addIndentation();

                        test.assertSame(stream, result);
                        test.assertEqual(singleIndent, stream.getSingleIndent());
                        test.assertEqual(1, stream.getCurrentIndentationCount());
                        test.assertEqual(singleIndent, stream.getCurrentIndentation());
                        test.assertEqual("", innerStream.getWrittenText());
                    });
                }

                addIndentationWithNoArgumentsTest("");
                addIndentationWithNoArgumentsTest(" ");
                addIndentationWithNoArgumentsTest("  ");

                function addIndentationWithArgumentTest(singleIndent: string): void
                {
                    runner.test(`with default single indent and ${runner.toString(singleIndent)} single indent argument`, (test: Test) =>
                    {
                        const innerStream: InMemoryCharacterWriteStream = InMemoryCharacterWriteStream.create();
                        const stream: IndentedCharacterWriteStream = IndentedCharacterWriteStream.create(innerStream);
                        const initialSingleIndent: string = stream.getSingleIndent();

                        const result: IndentedCharacterWriteStream = stream.addIndentation(singleIndent);

                        test.assertSame(stream, result);
                        test.assertEqual(initialSingleIndent, stream.getSingleIndent());
                        test.assertEqual(1, stream.getCurrentIndentationCount());
                        test.assertEqual(singleIndent, stream.getCurrentIndentation());
                        test.assertEqual("", innerStream.getWrittenText());
                    });
                }

                addIndentationWithArgumentTest("");
                addIndentationWithArgumentTest(" ");
                addIndentationWithArgumentTest("  ");
            });

            runner.testFunction("removeIndentation()", () =>
            {
                runner.test("with no current indentation", (test: Test) =>
                {
                    const innerStream: InMemoryCharacterWriteStream = InMemoryCharacterWriteStream.create();
                    const stream: IndentedCharacterWriteStream = IndentedCharacterWriteStream.create(innerStream);

                    test.assertThrows(() => stream.removeIndentation(), new PreConditionError(
                        "Expression: this.getCurrentIndentationCount()",
                        "Expected: greater than or equal to 1",
                        "Actual: 0",
                    ));

                    test.assertEqual(0, stream.getCurrentIndentationCount());
                    test.assertEqual("", stream.getCurrentIndentation());
                    test.assertEqual("", innerStream.getWrittenText());
                });

                runner.test("with empty current indentation", (test: Test) =>
                {
                    const innerStream: InMemoryCharacterWriteStream = InMemoryCharacterWriteStream.create();
                    const stream: IndentedCharacterWriteStream = IndentedCharacterWriteStream.create(innerStream);
                    stream.addIndentation("");

                    const result: string = stream.removeIndentation();

                    test.assertEqual("", result);
                    test.assertEqual(0, stream.getCurrentIndentationCount());
                    test.assertEqual("", stream.getCurrentIndentation());
                });

                runner.test("with non-empty current indentation", (test: Test) =>
                {
                    const innerStream: InMemoryCharacterWriteStream = InMemoryCharacterWriteStream.create();
                    const stream: IndentedCharacterWriteStream = IndentedCharacterWriteStream.create(innerStream);
                    stream.addIndentation("  ");

                    const result: string = stream.removeIndentation();

                    test.assertEqual("  ", result);
                    test.assertEqual(0, stream.getCurrentIndentationCount());
                    test.assertEqual("", stream.getCurrentIndentation());
                });
            });

            runner.testFunction("indent()", () =>
            {
                runner.test("with no singleIndent and undefined action", (test: Test) =>
                {
                    const innerStream: InMemoryCharacterWriteStream = InMemoryCharacterWriteStream.create();
                    const stream: IndentedCharacterWriteStream = IndentedCharacterWriteStream.create(innerStream);

                    test.assertThrowsAsync(async () => await stream.indent(undefined!), new PreConditionError(
                        "Expression: action",
                        "Expected: not undefined and not null",
                        "Actual: undefined",
                    ));

                    test.assertEqual("", innerStream.getWrittenText());
                    test.assertEqual(0, stream.getCurrentIndentationCount());
                });

                runner.test("with no singleIndent and null action", (test: Test) =>
                {
                    const innerStream: InMemoryCharacterWriteStream = InMemoryCharacterWriteStream.create();
                    const stream: IndentedCharacterWriteStream = IndentedCharacterWriteStream.create(innerStream);

                    test.assertThrowsAsync(async () => await stream.indent(null!), new PreConditionError(
                        "Expression: action",
                        "Expected: not undefined and not null",
                        "Actual: null",
                    ));

                    test.assertEqual("", innerStream.getWrittenText());
                    test.assertEqual(0, stream.getCurrentIndentationCount());
                });

                runner.test("with singleIndent and undefined action", (test: Test) =>
                {
                    const innerStream: InMemoryCharacterWriteStream = InMemoryCharacterWriteStream.create();
                    const stream: IndentedCharacterWriteStream = IndentedCharacterWriteStream.create(innerStream);

                    test.assertThrowsAsync(async () => await stream.indent("  ", undefined!), new PreConditionError(
                        "Expression: action",
                        "Expected: not undefined and not null",
                        "Actual: undefined",
                    ));

                    test.assertEqual("", innerStream.getWrittenText());
                    test.assertEqual(0, stream.getCurrentIndentationCount());
                });

                runner.test("with singleIndent and null action", (test: Test) =>
                {
                    const innerStream: InMemoryCharacterWriteStream = InMemoryCharacterWriteStream.create();
                    const stream: IndentedCharacterWriteStream = IndentedCharacterWriteStream.create(innerStream);

                    test.assertThrowsAsync(async () => await stream.indent(" ", null!), new PreConditionError(
                        "Expression: action",
                        "Expected: not undefined and not null",
                        "Actual: null",
                    ));

                    test.assertEqual("", innerStream.getWrittenText());
                    test.assertEqual(0, stream.getCurrentIndentationCount());
                });

                runner.test("with singleIndent and empty action", async (test: Test) =>
                {
                    const innerStream: InMemoryCharacterWriteStream = InMemoryCharacterWriteStream.create();
                    const stream: IndentedCharacterWriteStream = IndentedCharacterWriteStream.create(innerStream);

                    const result: number = await stream.indent(" ", async () =>
                    {
                        return 0;
                    });

                    test.assertEqual(0, result);
                    test.assertEqual("", innerStream.getWrittenText());
                    test.assertEqual(0, stream.getCurrentIndentationCount());
                });

                runner.test("with no singleIndent and non-empty action", async (test: Test) =>
                {
                    const innerStream: InMemoryCharacterWriteStream = InMemoryCharacterWriteStream.create();
                    const stream: IndentedCharacterWriteStream = IndentedCharacterWriteStream.create(innerStream);

                    const result: number = await stream.indent(async () =>
                    {
                        let result: number = 0;

                        result += await stream.writeLine("Hello");
                        result += await stream.writeLine("World!");

                        return result;
                    });

                    test.assertEqual(17, result);
                    test.assertEqual("  Hello\n  World!\n", innerStream.getWrittenText());
                    test.assertEqual(0, stream.getCurrentIndentationCount());
                });

                runner.test("with singleIndent and non-empty action", async (test: Test) =>
                {
                    const innerStream: InMemoryCharacterWriteStream = InMemoryCharacterWriteStream.create();
                    const stream: IndentedCharacterWriteStream = IndentedCharacterWriteStream.create(innerStream);

                    const result: number = await stream.indent(" ", async () =>
                    {
                        let result: number = 0;

                        result += await stream.writeLine("Hello");
                        result += await stream.writeLine("World!");

                        return result;
                    });

                    test.assertEqual(15, result);
                    test.assertEqual(" Hello\n World!\n", innerStream.getWrittenText());
                    test.assertEqual(0, stream.getCurrentIndentationCount());
                });

                runner.test("with action that doesn't return a value", async (test: Test) =>
                {
                    const innerStream: InMemoryCharacterWriteStream = InMemoryCharacterWriteStream.create();
                    const stream: IndentedCharacterWriteStream = IndentedCharacterWriteStream.create(innerStream);

                    const result: number = await stream.indent(" ", async () =>
                    {
                        await stream.writeLine("Hello");
                        await stream.writeLine("World!");
                    });

                    test.assertEqual(0, result);
                    test.assertEqual(" Hello\n World!\n", innerStream.getWrittenText());
                    test.assertEqual(0, stream.getCurrentIndentationCount());
                });
            });

            runner.testFunction("writeString()", () =>
            {
                runner.test("with empty", async (test: Test) =>
                {
                    const innerStream: InMemoryCharacterWriteStream = InMemoryCharacterWriteStream.create();
                    const stream: IndentedCharacterWriteStream = IndentedCharacterWriteStream.create(innerStream);

                    const result: number = await stream.writeString("");

                    test.assertEqual(0, result);
                    test.assertEqual("", innerStream.getWrittenText());
                });

                runner.test("with no newline characters or current indentation", async (test: Test) =>
                {
                    const innerStream: InMemoryCharacterWriteStream = InMemoryCharacterWriteStream.create();
                    const stream: IndentedCharacterWriteStream = IndentedCharacterWriteStream.create(innerStream);

                    let result: number = 0;
                    result += await stream.writeString("Hello");
                    result += await stream.writeString(" there!");

                    test.assertEqual(12, result);
                    test.assertEqual("Hello there!", innerStream.getWrittenText());
                });

                runner.test("with newline characters but no current indentation", async (test: Test) =>
                {
                    const innerStream: InMemoryCharacterWriteStream = InMemoryCharacterWriteStream.create();
                    const stream: IndentedCharacterWriteStream = IndentedCharacterWriteStream.create(innerStream);

                    let result: number = 0;
                    result += await stream.writeString("Hel");
                    result += await stream.writeString("lo\n");
                    result += await stream.writeString("there!");

                    test.assertEqual(12, result);
                    test.assertEqual("Hello\nthere!", innerStream.getWrittenText());
                });

                runner.test("with newline characters and current indentation", async (test: Test) =>
                {
                    const innerStream: InMemoryCharacterWriteStream = InMemoryCharacterWriteStream.create();
                    const stream: IndentedCharacterWriteStream = IndentedCharacterWriteStream.create(innerStream);

                    const result: number = await stream.indent(async () =>
                    {
                        return await stream.writeString("Hel") +
                            await stream.writeString("lo\n") +
                            await stream.writeString("there!");
                    });

                    test.assertEqual(16, result);
                    test.assertEqual("  Hello\n  there!", innerStream.getWrittenText());
                });

                runner.test("with Windows newline characters and current indentation", async (test: Test) =>
                {
                    const innerStream: InMemoryCharacterWriteStream = InMemoryCharacterWriteStream.create();
                    const stream: IndentedCharacterWriteStream = IndentedCharacterWriteStream.create(innerStream);

                    const result: number = await stream.indent(async () =>
                    {
                        return await stream.writeString("Hel") +
                            await stream.writeString("lo\r\n") +
                            await stream.writeString("there!");
                    });

                    test.assertEqual(17, result);
                    test.assertEqual("  Hello\r\n  there!", innerStream.getWrittenText());
                });

                runner.test("with empty line and current indentation", async (test: Test) =>
                {
                    const innerStream: InMemoryCharacterWriteStream = InMemoryCharacterWriteStream.create();
                    const stream: IndentedCharacterWriteStream = IndentedCharacterWriteStream.create(innerStream);

                    const result: number = await stream.indent(async () =>
                    {
                        return await stream.writeString("Hel") +
                            await stream.writeString("lo\n\n") +
                            await stream.writeString("there!");
                    });

                    test.assertEqual(17, result);
                    test.assertEqual("  Hello\n\n  there!", innerStream.getWrittenText());
                });

                runner.test("with Windows empty line and current indentation", async (test: Test) =>
                {
                    const innerStream: InMemoryCharacterWriteStream = InMemoryCharacterWriteStream.create();
                    const stream: IndentedCharacterWriteStream = IndentedCharacterWriteStream.create(innerStream);

                    const result: number = await stream.indent(async () =>
                    {
                        return await stream.writeString("Hel") +
                            await stream.writeString("lo\r\n\r\n") +
                            await stream.writeString("there!");
                    });

                    test.assertEqual(19, result);
                    test.assertEqual("  Hello\r\n\r\n  there!", innerStream.getWrittenText());
                });
            });
        });
    });
}