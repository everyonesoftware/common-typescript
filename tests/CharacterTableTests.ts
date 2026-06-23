import { Indexable, JavascriptIterable, PreConditionError } from "../sources";
import { CharacterTable } from "../sources/CharacterTable";
import { Test } from "./test";
import { TestRunner } from "./testRunner";

export function test(runner: TestRunner): void
{
    runner.testFile("CharacterTable.ts", () =>
    {
        runner.testType("CharacterTable", () =>
        {
            runner.testFunction("create()", (test: Test) =>
            {
                const table: CharacterTable = CharacterTable.create();
                test.assertNotUndefinedAndNotNull(table);
            });

            runner.testFunction("addRow()", () =>
            {
                function addRowErrorTest(row: JavascriptIterable<string>, expected: Error): void
                {
                    runner.test(`with ${runner.toString(row)}`, (test: Test) =>
                    {
                        const table: CharacterTable = CharacterTable.create();

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
            });
        });
    });
}