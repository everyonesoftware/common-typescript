import { Iterator } from "../sources/iterator.js";
import { PreConditionError } from "../sources/preConditionError.js";
import { WhereIterator } from "../sources/whereIterator.js";
import { iteratorTests } from "./iteratorTests.js";
import { Test } from "./test.js";
import { TestRunner } from "./testRunner.js";

export function test(runner: TestRunner): void
{
    runner.testFile("whereIterator.ts", () =>
    {
        runner.testType("WhereIterator<T>", () =>
        {
            iteratorTests(runner, () => WhereIterator.create(Iterator.create<number>([]), (_: number) => true));

            runner.testFunction("create(T[])", () =>
            {
                function createErrorTest<T>(testName: string, innerIterator: Iterator<T>, condition: (value: T) => boolean, expected: Error): void
                {
                    runner.test(testName, (test: Test) =>
                    {
                        test.assertThrows(() => WhereIterator.create(innerIterator, condition), expected);
                    });
                }

                createErrorTest(
                    `with undefined innerIterator`,
                    undefined!,
                    (_: number) => true,
                    new PreConditionError(
                        "Expression: innerIterator",
                        "Expected: not undefined and not null",
                        "Actual: undefined",
                    ),
                );
                createErrorTest(
                    `with null innerIterator`,
                    null!,
                    (_: number) => true,
                    new PreConditionError(
                        "Expression: innerIterator",
                        "Expected: not undefined and not null",
                        "Actual: null",
                    ),
                );

                function createTest<T>(testName: string, innerIterator: Iterator<T>, condition: (value: T) => boolean, expected: T[]): void
                {
                    runner.test(testName, async (test: Test) =>
                    {
                        const iterator: WhereIterator<T> = WhereIterator.create(innerIterator, condition);
                        test.assertEqual(await iterator.toArray(), expected);
                    });
                }

                createTest(
                    `with empty innerIterator`,
                    Iterator.create<number>([]),
                    (_: number) => true,
                    [],
                );
                createTest(
                    `with none of the iterator values match the condition`,
                    Iterator.create([1, 2, 3]),
                    (value: number) => value > 10,
                    [],
                );
                createTest(
                    `with some of the iterator values match the condition`,
                    Iterator.create([1, 2, 3]),
                    (value: number) => value % 2 == 1,
                    [1, 3],
                );
            });
        });
    });
}