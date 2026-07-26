import { CharacterListStream } from "../sources/characterListStream.js";
import { EmptyError } from "../sources/emptyError.js";
import { PreConditionError } from "../sources/preConditionError.js";
import { Test } from "./test.js";
import { TestRunner } from "./testRunner.js";

export function test(runner: TestRunner): void
{
    runner.testFile("characterListStream.ts", () =>
    {
        runner.testType("CharacterListStream", () =>
        {
            runner.testFunction("create()", () =>
            {
                runner.test("with no arguments", (test: Test) =>
                {
                    const stream: CharacterListStream = CharacterListStream.create();
                    test.assertNotUndefinedAndNotNull(stream);
                    test.assertEqual(0, stream.getAvailableCharacterCount());
                });

                runner.test("with empty array", (test: Test) =>
                {
                    const stream: CharacterListStream = CharacterListStream.create([]);
                    test.assertNotUndefinedAndNotNull(stream);
                    test.assertEqual(0, stream.getAvailableCharacterCount());
                });

                runner.test("with non-empty array", (test: Test) =>
                {
                    const stream: CharacterListStream = CharacterListStream.create("abc");
                    test.assertNotUndefinedAndNotNull(stream);
                    test.assertEqual(3, stream.getAvailableCharacterCount());
                });
            });

            runner.testFunction("writeCharacters()", () =>
            {
                runner.test("with undefined characters", (test: Test) =>
                {
                    const stream: CharacterListStream = CharacterListStream.create();
                    test.assertThrows(() => stream.writeCharacters(undefined!), new PreConditionError(
                        "Expression: characters",
                        "Expected: not undefined and not null",
                        "Actual: undefined",
                    ));
                    test.assertEqual(0, stream.getAvailableCharacterCount());
                });

                runner.test("with null characters", (test: Test) =>
                {
                    const stream: CharacterListStream = CharacterListStream.create();
                    test.assertThrows(() => stream.writeCharacters(null!), new PreConditionError(
                        "Expression: characters",
                        "Expected: not undefined and not null",
                        "Actual: null",
                    ));
                    test.assertEqual(0, stream.getAvailableCharacterCount());
                });

                runner.test("with empty characters", (test: Test) =>
                {
                    const stream: CharacterListStream = CharacterListStream.create();
                    test.assertEqual(0, stream.writeCharacters([]).await());
                    test.assertEqual(0, stream.getAvailableCharacterCount());
                });

                runner.test("with non-empty characters", (test: Test) =>
                {
                    const stream: CharacterListStream = CharacterListStream.create();

                    test.assertEqual(4, stream.writeCharacters("abcd").await());
                    test.assertEqual(4, stream.getAvailableCharacterCount());

                    const characters: string = stream.readCharacters(10).await();
                    test.assertNotUndefinedAndNotNull(characters);
                    test.assertEqual(4, characters.length);
                    test.assertEqual("abcd", characters);
                    test.assertEqual(0, stream.getAvailableCharacterCount());
                });

                runner.test("with negative startIndex", (test: Test) =>
                {
                    const stream: CharacterListStream = CharacterListStream.create();
                    test.assertThrows(() => stream.writeCharacters("ab", -1), new PreConditionError(
                        "Expression: startIndex",
                        "Expected: between 0 and 2",
                        "Actual: -1",
                    ));
                    test.assertEqual(0, stream.getAvailableCharacterCount());
                });

                runner.test("with too large startIndex", (test: Test) =>
                {
                    const stream: CharacterListStream = CharacterListStream.create();
                    test.assertThrows(() => stream.writeCharacters("ab", 3), new PreConditionError(
                        "Expression: startIndex",
                        "Expected: between 0 and 2",
                        "Actual: 3",
                    ));
                    test.assertEqual(0, stream.getAvailableCharacterCount());
                });

                runner.test("with valid non-zero startIndex", (test: Test) =>
                {
                    const stream: CharacterListStream = CharacterListStream.create();
                    const writeCharactersResult: number = stream.writeCharacters("ab", 1).await();
                    test.assertEqual(1, writeCharactersResult);
                    test.assertEqual(1, stream.getAvailableCharacterCount());

                    test.assertEqual("b", stream.readCharacters(5).await());
                    test.assertEqual(0, stream.getAvailableCharacterCount());
                });

                runner.test("with startIndex equal to characters length", (test: Test) =>
                {
                    const stream: CharacterListStream = CharacterListStream.create();
                    const writeCharactersResult: number = stream.writeCharacters("ab", 2).await();
                    test.assertEqual(0, writeCharactersResult);
                    test.assertEqual(0, stream.getAvailableCharacterCount());
                });

                runner.test("with negative length", (test: Test) =>
                {
                    const stream: CharacterListStream = CharacterListStream.create();
                    test.assertThrows(() => stream.writeCharacters("ab", 0, -1), new PreConditionError(
                        "Expression: length",
                        "Expected: between 0 and 2",
                        "Actual: -1",
                    ));
                    test.assertEqual(0, stream.getAvailableCharacterCount());
                });

                runner.test("with too large length", (test: Test) =>
                {
                    const stream: CharacterListStream = CharacterListStream.create();
                    test.assertThrows(() => stream.writeCharacters("ab", 0, 3), new PreConditionError(
                        "Expression: length",
                        "Expected: between 0 and 2",
                        "Actual: 3",
                    ));
                    test.assertEqual(0, stream.getAvailableCharacterCount());
                });

                runner.test("with valid startIndex and length values", (test: Test) =>
                {
                    const stream: CharacterListStream = CharacterListStream.create();
                    const writeCharactersResult: number = stream.writeCharacters(["a", "b", "c", "d", "e"], 2, 2).await();
                    test.assertEqual(2, writeCharactersResult);
                    test.assertEqual(2, stream.getAvailableCharacterCount());

                    test.assertEqual("cd", stream.readCharacters(50).await());
                    test.assertEqual(0, stream.getAvailableCharacterCount());
                });
            });

            runner.testFunction("readCharacters()", () =>
            {
                runner.testGroup("with empty stream", () =>
                {
                    runner.test("with negative count", (test: Test) =>
                    {
                        const stream: CharacterListStream = CharacterListStream.create();
                        test.assertThrows(() => stream.readCharacters(-1).await(), new PreConditionError(
                            "Expression: count",
                            "Expected: greater than or equal to 0",
                            "Actual: -1",
                        ));
                        test.assertEqual(0, stream.getAvailableCharacterCount());
                    });

                    runner.test("with zero count", (test: Test) =>
                    {
                        const stream: CharacterListStream = CharacterListStream.create();
                        test.assertThrows(() => stream.readCharacters(0).await(), new EmptyError());
                        test.assertEqual(0, stream.getAvailableCharacterCount());
                    });

                    runner.test("with positive count", (test: Test) =>
                    {
                        const stream: CharacterListStream = CharacterListStream.create();
                        test.assertThrows(() => stream.readCharacters(1).await(), new EmptyError());
                        test.assertEqual(0, stream.getAvailableCharacterCount());
                    });
                });

                runner.testGroup("with non-empty stream", () =>
                {
                    runner.test("with negative count", (test: Test) =>
                    {
                        const stream: CharacterListStream = CharacterListStream.create(["a", "b", "c"]);
                        test.assertThrows(() => stream.readCharacters(-1).await(), new PreConditionError(
                            "Expression: count",
                            "Expected: greater than or equal to 0",
                            "Actual: -1",
                        ));
                        test.assertEqual(3, stream.getAvailableCharacterCount());
                    });

                    runner.test("with zero count", (test: Test) =>
                    {
                        const stream: CharacterListStream = CharacterListStream.create(["a", "b", "c"]);
                        const readCharactersResult: string = stream.readCharacters(0).await();
                        test.assertEqual("", readCharactersResult);
                        test.assertEqual(3, stream.getAvailableCharacterCount());
                    });

                    runner.test("with positive count less than characters available", (test: Test) =>
                    {
                        const stream: CharacterListStream = CharacterListStream.create(["a", "b", "c"]);
                        const readCharactersResult: string = stream.readCharacters(2).await();
                        test.assertEqual("ab", readCharactersResult);
                        test.assertEqual(1, stream.getAvailableCharacterCount());
                    });

                    runner.test("with positive count equal to characters available", (test: Test) =>
                    {
                        const stream: CharacterListStream = CharacterListStream.create(["a", "b", "c"]);
                        const readCharactersResult: string = stream.readCharacters(3).await();
                        test.assertEqual("abc", readCharactersResult);
                        test.assertEqual(0, stream.getAvailableCharacterCount());
                    });

                    runner.test("with positive count greater than characters available", (test: Test) =>
                    {
                        const stream: CharacterListStream = CharacterListStream.create(["a", "b", "c"]);
                        const readCharactersResult: string = stream.readCharacters(4).await();
                        test.assertEqual("abc", readCharactersResult);
                        test.assertEqual(0, stream.getAvailableCharacterCount());
                    });

                    runner.test("with undefined output", (test: Test) =>
                    {
                        const stream: CharacterListStream = CharacterListStream.create(["a", "b", "c"]);
                        test.assertThrows(() => stream.readCharacters(undefined!), new PreConditionError(
                            "Expression: output",
                            "Expected: not undefined and not null",
                            "Actual: undefined",
                        ));
                        test.assertEqual(3, stream.getAvailableCharacterCount());
                    });

                    runner.test("with null output", (test: Test) =>
                    {
                        const stream: CharacterListStream = CharacterListStream.create(["a", "b", "c"]);
                        test.assertThrows(() => stream.readCharacters(null!), new PreConditionError(
                            "Expression: output",
                            "Expected: not undefined and not null",
                            "Actual: null",
                        ));
                        test.assertEqual(3, stream.getAvailableCharacterCount());
                    });

                    runner.test("with empty output", (test: Test) =>
                    {
                        const stream: CharacterListStream = CharacterListStream.create(["a", "b", "c"]);
                        const output: string[] = [];
                        const readCharactersResult: number = stream.readCharacters(output).await();
                        test.assertEqual(0, readCharactersResult);
                        test.assertEqual(output, []);
                        test.assertEqual(3, stream.getAvailableCharacterCount());
                    });

                    runner.test("with output smaller than the available characters", (test: Test) =>
                    {
                        const stream: CharacterListStream = CharacterListStream.create(["a", "b", "c"]);
                        const output: string[] = Array.from<string>({ length: 1 });
                        const readCharactersResult: number = stream.readCharacters(output).await();
                        test.assertEqual(1, readCharactersResult);
                        test.assertEqual(output, ["a"]);
                        test.assertEqual(2, stream.getAvailableCharacterCount());
                    });

                    runner.test("with output equal to the available characters", (test: Test) =>
                    {
                        const stream: CharacterListStream = CharacterListStream.create(["a", "b", "c"]);
                        const output: string[] = Array.from<string>({ length: 5 }).fill("");
                        const readCharactersResult: number = stream.readCharacters(output).await();
                        test.assertEqual(3, readCharactersResult);
                        test.assertEqual(output, ["a", "b", "c", "", ""]);
                        test.assertEqual(0, stream.getAvailableCharacterCount());
                    });

                    runner.test("with output larger than available characters", (test: Test) =>
                    {
                        const stream: CharacterListStream = CharacterListStream.create(["a", "b", "c"]);
                        const output: string[] = Array.from<string>({ length: 5 }).fill("");
                        const readCharactersResult: number = stream.readCharacters(output).await();
                        test.assertEqual(3, readCharactersResult);
                        test.assertEqual(output, ["a", "b", "c", "", ""]);
                        test.assertEqual(0, stream.getAvailableCharacterCount());
                    });

                    runner.test("with negative startIndex", (test: Test) =>
                    {
                        const stream: CharacterListStream = CharacterListStream.create(["a", "b", "c"]);
                        const output: string[] = Array.from<string>({ length: 5 });
                        test.assertThrows(() => stream.readCharacters(output, -1), new PreConditionError(
                            "Expression: startIndex",
                            "Expected: between 0 and 5",
                            "Actual: -1",
                        ));
                        test.assertEqual(3, stream.getAvailableCharacterCount());
                    });

                    runner.test("with too large startIndex", (test: Test) =>
                    {
                        const stream: CharacterListStream = CharacterListStream.create(["a", "b", "c"]);
                        const output: string[] = Array.from<string>({ length: 5 });
                        test.assertThrows(() => stream.readCharacters(output, 6), new PreConditionError(
                            "Expression: startIndex",
                            "Expected: between 0 and 5",
                            "Actual: 6",
                        ));
                        test.assertEqual(3, stream.getAvailableCharacterCount());
                    });

                    runner.test("with startIndex with enough space to read the entire stream", (test: Test) =>
                    {
                        const stream: CharacterListStream = CharacterListStream.create(["a", "b", "c"]);
                        const output: string[] = Array.from<string>({ length: 5 }).fill("");
                        test.assertEqual(3, stream.readCharacters(output, 2).await());
                        test.assertEqual(["", "", "a", "b", "c"], output);
                        test.assertEqual(0, stream.getAvailableCharacterCount());
                    });

                    runner.test("with startIndex with not enough space to read the entire stream", (test: Test) =>
                    {
                        const stream: CharacterListStream = CharacterListStream.create(["a", "b", "c"]);
                        const output: string[] = Array.from<string>({ length: 5 }).fill("");
                        test.assertEqual(2, stream.readCharacters(output, 3).await());
                        test.assertEqual(["", "", "", "a", "b"], output);
                        test.assertEqual(1, stream.getAvailableCharacterCount());
                    });

                    runner.test("with startIndex equal to output length", (test: Test) =>
                    {
                        const stream: CharacterListStream = CharacterListStream.create(["a", "b", "c"]);
                        const output: string[] = Array.from<string>({ length: 5 }).fill("");
                        test.assertEqual(0, stream.readCharacters(output, 5).await());
                        test.assertEqual(["", "", "", "", ""], output);
                        test.assertEqual(3, stream.getAvailableCharacterCount());
                    });

                    runner.test("with negative count", (test: Test) =>
                    {
                        const stream: CharacterListStream = CharacterListStream.create(["a", "b", "c"]);
                        const output: string[] = Array.from<string>({ length: 5 });
                        test.assertThrows(() => stream.readCharacters(output, 1, -1), new PreConditionError(
                            "Expression: count",
                            "Expected: between 0 and 4",
                            "Actual: -1",
                        ));
                        test.assertEqual(3, stream.getAvailableCharacterCount());
                    });

                    runner.test("with count larger than output.length - startIndex", (test: Test) =>
                    {
                        const stream: CharacterListStream = CharacterListStream.create(["a", "b", "c"]);
                        const output: string[] = Array.from<string>({ length: 5 });
                        test.assertThrows(() => stream.readCharacters(output, 1, 5), new PreConditionError(
                            "Expression: count",
                            "Expected: between 0 and 4",
                            "Actual: 5",
                        ));
                        test.assertEqual(3, stream.getAvailableCharacterCount());
                    });

                    runner.test("with startIndex with enough space to read the entire stream", (test: Test) =>
                    {
                        const stream: CharacterListStream = CharacterListStream.create(["a", "b", "c"]);
                        const output: string[] = Array.from<string>({ length: 5 }).fill("");
                        test.assertEqual(3, stream.readCharacters(output, 2, 3).await());
                        test.assertEqual(["", "", "a", "b", "c"], output);
                        test.assertEqual(0, stream.getAvailableCharacterCount());
                    });

                    runner.test("with startIndex with not enough space to read the entire stream", (test: Test) =>
                    {
                        const stream: CharacterListStream = CharacterListStream.create(["a", "b", "c"]);
                        const output: string[] = Array.from<string>({ length: 5 }).fill("");
                        test.assertEqual(1, stream.readCharacters(output, 3, 1).await());
                        test.assertEqual(["", "", "", "a", ""], output);
                        test.assertEqual(2, stream.getAvailableCharacterCount());
                    });
                });
            });
        });
    });
}