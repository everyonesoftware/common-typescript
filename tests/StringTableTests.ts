import { CharacterWriteStream, Indexable, InMemoryCharacterWriteStream, isString, JavascriptIterable, List, PreCondition, PreConditionError } from "../sources/index.js";
import { StringTable, StringTableWriteToParameters } from "../sources/StringTable.js";
import { Test } from "./test.js";
import { TestRunner } from "./testRunner.js";

export function test(runner: TestRunner): void
{
    runner.testFile("StringTable.ts", () =>
    {
        runner.testType("StringTable", () =>
        {
            runner.testFunction("create()", (test: Test) =>
            {
                const table: StringTable = StringTable.create();
                test.assertNotUndefinedAndNotNull(table);
            });

            runner.testFunction("addRow()", () =>
            {
                function addRowErrorTest(row: JavascriptIterable<string>, expected: Error): void
                {
                    runner.test(`with ${runner.toString(row)}`, (test: Test) =>
                    {
                        const table: StringTable = StringTable.create();

                        test.assertThrows(() => table.addRow(row), expected);

                        test.assertEqual(Indexable.create(), table.getRows());
                    });
                }

                addRowErrorTest(undefined!, new PreConditionError(
                    "Expression: row",
                    "Expected: not undefined and not null",
                    "Actual: undefined",
                ));
                addRowErrorTest(null!, new PreConditionError(
                    "Expression: row",
                    "Expected: not undefined and not null",
                    "Actual: null",
                ));

                function addRowTest(row: JavascriptIterable<string>): void
                {
                    runner.test(`with ${runner.toString(row)}`, (test: Test) =>
                    {
                        const table: StringTable = StringTable.create();

                        const addRowResult: StringTable = table.addRow(row);
                        test.assertSame(table, addRowResult);

                        const actualRows: Indexable<Indexable<string>> = table.getRows();
                        const expectedRows: Indexable<Indexable<string>> = List.create([Indexable.create(row)]);
                        test.assertEqual(expectedRows, actualRows);
                    });
                }

                addRowTest([]);
                addRowTest(["a"]);
                addRowTest(["a", "b"]);
            });

            runner.testFunction("addRows()", () =>
            {
                function addRowsErrorTest(rows: JavascriptIterable<JavascriptIterable<string>>, expected: Error): void
                {
                    runner.test(`with ${runner.toString(rows)}`, (test: Test) =>
                    {
                        const table: StringTable = StringTable.create();

                        test.assertThrows(() => table.addRows(rows), expected);

                        test.assertEqual(Indexable.create(), table.getRows());
                    });
                }

                addRowsErrorTest(undefined!, new PreConditionError(
                    "Expression: rows",
                    "Expected: not undefined and not null",
                    "Actual: undefined",
                ));
                addRowsErrorTest(null!, new PreConditionError(
                    "Expression: rows",
                    "Expected: not undefined and not null",
                    "Actual: null",
                ));

                function addRowsTest(rows: JavascriptIterable<JavascriptIterable<string>>): void
                {
                    runner.test(`with ${runner.toString(rows)}`, (test: Test) =>
                    {
                        const table: StringTable = StringTable.create();

                        const addRowsResult: StringTable = table.addRows(rows);
                        test.assertSame(table, addRowsResult);

                        const actualRows: Indexable<Indexable<string>> = table.getRows();
                        const expectedRows: List<Indexable<string>> = List.create();
                        for (const row of rows)
                        {
                            expectedRows.add(Indexable.create(row));
                        }
                        test.assertEqual(expectedRows, actualRows);
                    });
                }

                addRowsTest([]);
                addRowsTest([[]]);
                addRowsTest([["a"], ["b"]]);
            });

            runner.testFunction("writeTo()", () =>
            {
                function writeToErrorTest(writeStream: CharacterWriteStream, expected: Error): void
                {
                    runner.test(`with ${runner.toString(writeStream)}`, async (test: Test) =>
                    {
                        const table: StringTable = StringTable.create();
                        await test.assertThrowsAsync(async () => await table.writeTo(writeStream), expected);
                    });
                }

                writeToErrorTest(undefined!, new PreConditionError(
                    "Expression: writeStream",
                    "Expected: not undefined and not null",
                    "Actual: undefined",
                ));
                writeToErrorTest(null!, new PreConditionError(
                    "Expression: writeStream",
                    "Expected: not undefined and not null",
                    "Actual: null",
                ));

                function writeToTest(values: string[][], expected: string): void;
                function writeToTest(values: string[][], parameters: Omit<StringTableWriteToParameters, "writeStream">, expected: string): void;
                function writeToTest(values: string[][], expectedOrParameters: string | Omit<StringTableWriteToParameters, "writeStream">, expected?: string): void
                {
                    let parameters: Omit<StringTableWriteToParameters, "writeStream">;
                    if (isString(expectedOrParameters))
                    {
                        parameters = {};
                        expected = expectedOrParameters;
                    }
                    else
                    {
                        parameters = expectedOrParameters;
                    }
                    PreCondition.assertNotUndefinedAndNotNull(values, "values");
                    PreCondition.assertNotUndefinedAndNotNull(parameters, "parameters");
                    PreCondition.assertNotUndefinedAndNotNull(expected, "expected");

                    runner.test(`with ${runner.andList([values, parameters])}`, async (test: Test) =>
                    {
                        const table: StringTable = StringTable.create().addRows(values);
                        const stream: InMemoryCharacterWriteStream = InMemoryCharacterWriteStream.create();
                        const result = await table.writeTo({
                            ...parameters,
                            writeStream: stream,
                        });
                        test.assertEqual(stream.getWrittenText(), expected);
                        test.assertEqual(result, expected.length);
                    });
                }

                writeToTest([], "");
                writeToTest([[]], "");
                writeToTest([[],[]], "\n");
                writeToTest([[],[],[]], "\n\n");

                writeToTest([["a"]], "a");
                writeToTest([["a", "b"]], "a b");
                writeToTest([["a", "bc", "d"]], "a bc d");

                writeToTest([["a"], ["b"], ["c", "de"]], "a\nb\nc de");

                writeToTest([["a", "b", "c"], ["dd", "ee", "ff"]], {}, "a  b  c \ndd ee ff");
                writeToTest([["a", "b", "c"], ["dd", "ee", "ff"]], { betweenColumns: "|"}, "a |b |c \ndd|ee|ff");

                writeToTest(
                    [["a", "b", "c"], ["dd", "eee", "ffff"]],
                    { betweenColumns: "|", columnStyle: { alignment: "left" }},
                    "a |b  |c   \ndd|eee|ffff",
                );
                writeToTest(
                    [["a", "b", "c"], ["dd", "eee", "ffff"]],
                    { betweenColumns: "|", columnStyle: { alignment: "center" }},
                    "a | b | c  \ndd|eee|ffff",
                );
                writeToTest(
                    [["a", "b", "c"], ["dd", "eee", "ffff"]],
                    { betweenColumns: "|", columnStyle: { alignment: "right" }},
                    " a|  b|   c\ndd|eee|ffff",
                );
            });
        });
    });
}