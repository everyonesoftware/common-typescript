import { CharacterWriteStream, Indexable, InMemoryCharacterWriteStream, isString, Iterable, JavascriptIterable, join, List, PreCondition, PreConditionError } from "../sources/index.js";
import { StringTable, StringTableWriteToOptions } from "../sources/StringTable.js";
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

            runner.testFunction("getColumnWidths()", () =>
            {
                function getColumnWidthsTest(rows: JavascriptIterable<JavascriptIterable<string>>, expected: JavascriptIterable<number>): void
                {
                    runner.test(`with ${runner.toString(rows)}`, (test: Test) =>
                    {
                        const rowsList: List<List<string>> = List.create();
                        for (const row of rows)
                        {
                            rowsList.add(List.create(row));
                        }
                        test.assertEqual(StringTable.getColumnWidths(rowsList, text => text.length), Iterable.create<number>(expected));
                    });
                }

                getColumnWidthsTest([], []);
                getColumnWidthsTest([List.create()], []);
                getColumnWidthsTest([List.create(["a"])], [1]);
                getColumnWidthsTest(
                    [
                        ["abc", "d", "efgh"],
                    ],
                    [3, 1, 4],
                );
                getColumnWidthsTest(
                    [
                        ["✓ Passed:", "1836"],
                        ["◌ Skipped:", "3"],
                    ],
                    [10, 4],
                );
                getColumnWidthsTest(
                    [
                        ["✓ Passed:", "1836"],
                        ["◌ Skipped:", "3"],
                        ["Duration:", "4.411 seconds"],
                    ],
                    [10, 13],
                );
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

                addRowErrorTest(undefined!, new PreConditionError({
                    expression: "row",
                    expectedString: "not undefined and not null",
                    actualString: "undefined",
                }));
                addRowErrorTest(null!, new PreConditionError({
                    expression: "row",
                    expectedString: "not undefined and not null",
                    actualString: "null",
                }));

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

                addRowsErrorTest(undefined!, new PreConditionError({
                    expression: "rows",
                    expectedString: "not undefined and not null",
                    actualString: "undefined",
                }));
                addRowsErrorTest(null!, new PreConditionError({
                    expression: "rows",
                    expectedString: "not undefined and not null",
                    actualString: "null",
                }));

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

                writeToErrorTest(undefined!, new PreConditionError({
                    expression: "writeStream",
                    expectedString: "not undefined and not null",
                    actualString: "undefined",
                }));
                writeToErrorTest(null!, new PreConditionError({
                    expression: "writeStream",
                    expectedString: "not undefined and not null",
                    actualString: "null",
                }));

                function writeToTest(values: string[][], expected: string): void;
                function writeToTest(values: string[][], options: StringTableWriteToOptions, expected: string): void;
                function writeToTest(values: string[][], expectedOrOptions: string | StringTableWriteToOptions, expected?: string): void
                {
                    let parameters: StringTableWriteToOptions;
                    if (isString(expectedOrOptions))
                    {
                        parameters = {};
                        expected = expectedOrOptions;
                    }
                    else
                    {
                        parameters = expectedOrOptions;
                    }
                    PreCondition.assertNotUndefinedAndNotNull(values, "values");
                    PreCondition.assertNotUndefinedAndNotNull(parameters, "parameters");
                    PreCondition.assertNotUndefinedAndNotNull(expected, "expected");

                    runner.test(`with ${runner.andList([values, parameters])}`, async (test: Test) =>
                    {
                        const table: StringTable = StringTable.create().addRows(values);
                        const stream: InMemoryCharacterWriteStream = InMemoryCharacterWriteStream.create();
                        const result = await table.writeTo(stream, parameters);
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

                writeToTest([["a", "b", "c"], ["dd", "ee", "ff"]], {}, "a  b  c\ndd ee ff");
                writeToTest([["a", "b", "c"], ["dd", "ee", "ff"]], { betweenColumns: "|"}, "a |b |c\ndd|ee|ff");

                writeToTest(
                    [["a", "b", "c"], ["dd", "eee", "ffff"]],
                    { betweenColumns: "|", columnStyle: { alignment: "left" }},
                    "a |b  |c\ndd|eee|ffff",
                );
                writeToTest(
                    [["a", "b", "c"], ["dd", "eee", "ffff"]],
                    { betweenColumns: "|", columnStyle: { alignment: "center" }},
                    "a | b | c\ndd|eee|ffff",
                );
                writeToTest(
                    [["a", "b", "c"], ["dd", "eee", "ffff"]],
                    { betweenColumns: "|", columnStyle: { alignment: "right" } },
                    " a|  b|   c\ndd|eee|ffff",
                );

                writeToTest(
                    [["✓ Passed:","1830"], ["◌ Skipped:", "3"]],
                    {},
                    join("\n", [
                        "✓ Passed:  1830",
                        "◌ Skipped: 3",
                    ]),
                );
                writeToTest(
                    [["✓ Passed:","1830"], ["◌ Skipped:", "3"], ["Duration:", "4.575 seconds"]],
                    {},
                    join("\n", [
                        "✓ Passed:  1830",
                        "◌ Skipped: 3",
                        "Duration:  4.575 seconds",
                    ]),
                );
            });
        });
    });
}