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
        });
    });
}