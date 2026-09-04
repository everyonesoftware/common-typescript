import { PreConditionError } from "../sources/index.js";
import { Indexable } from "../sources/Indexable.js";
import { iterableTests } from "./iterableTests.js";
import { Test } from "./test.js";
import { TestRunner } from "./testRunner.js";

export function indexableTests<T>(runner: TestRunner, creator: () => Indexable<T>): void
{
    runner.testType("Indexable<T>", () =>
    {
        iterableTests(runner, creator);

        runner.testFunction("get()", () =>
        {
            function getErrorTest(testName: string, index: number, expected: Error): void
            {
                runner.test(testName, (test: Test) =>
                {
                    const indexable: Indexable<T> = creator();
                    test.assertThrows(() => indexable.get(index).await(), expected);
                });
            }

            getErrorTest("with undefined", undefined!, new PreConditionError(
                "Expression: count",
                "Expected:   greater than or equal to 1",
                "Actual:     0",
            ));
            getErrorTest("with null", null!, new PreConditionError(
                "Expression: count",
                "Expected:   greater than or equal to 1",
                "Actual:     0",
            ));
            getErrorTest("with negative", -1!, new PreConditionError(
                "Expression: count",
                "Expected:   greater than or equal to 1",
                "Actual:     0",
            ));
        });
    });
}

export function test(runner: TestRunner): void
{
    runner.testFile("Indexable.ts", () =>
    {
        runner.testType("Indexable<T>", () =>
        {
            runner.testFunction("create()", () =>
            {
                runner.test("with no arguments", (test: Test) =>
                {
                    const indexable: Indexable<number> = Indexable.create();
                    test.assertNotUndefinedAndNotNull(indexable);
                    test.assertEqual(0, indexable.getCount().await());
                });

                runner.test("with empty array", (test: Test) =>
                {
                    const indexable: Indexable<number> = Indexable.create([]);
                    test.assertNotUndefinedAndNotNull(indexable);
                    test.assertEqual(0, indexable.getCount().await());
                });

                runner.test("with non-empty array", (test: Test) =>
                {
                    const indexable: Indexable<number> = Indexable.create([1, 2, 3]);
                    test.assertNotUndefinedAndNotNull(indexable);
                    test.assertEqual(3, indexable.getCount().await());
                    for (let i = 0; i < 3; i++)
                    {
                        test.assertEqual(i + 1, indexable.get(i).await());
                    }
                });
            });
        });
    });
}