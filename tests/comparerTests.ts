import { Comparer } from "../sources/comparer.js";
import { Comparison } from "../sources/comparison.js";
import { Test } from "./test.js";
import { TestRunner } from "./testRunner.js";

export function test(runner: TestRunner): void
{
    runner.testFile("comparer.ts", () =>
    {
        runner.testType("Comparer<TLeft,TRight>", () =>
        {
            runner.testFunction("compareSameUndefinedNull()", () =>
            {
                function compareSameUndefinedNullTest(left: unknown, right: unknown, expected: Comparison | undefined): void
                {
                    runner.test(`with ${runner.andList([left, right])}`, (test: Test) =>
                    {
                        test.assertEqual(Comparer.compareSameUndefinedNull(left, right), expected);
                    });
                }

                compareSameUndefinedNullTest(undefined, undefined, Comparison.Equal);
                compareSameUndefinedNullTest(undefined, null, Comparison.LessThan);
                compareSameUndefinedNullTest(undefined, "hello", Comparison.LessThan);
                compareSameUndefinedNullTest(undefined, 50, Comparison.LessThan);

                compareSameUndefinedNullTest(null, undefined, Comparison.GreaterThan);
                compareSameUndefinedNullTest(null, null, Comparison.Equal);
                compareSameUndefinedNullTest(null, "hello", Comparison.LessThan);
                compareSameUndefinedNullTest(null, 50, Comparison.LessThan);

                compareSameUndefinedNullTest("hello", undefined, Comparison.GreaterThan);
                compareSameUndefinedNullTest("hello", null, Comparison.GreaterThan);
                compareSameUndefinedNullTest("hello", "hello", Comparison.Equal);
                compareSameUndefinedNullTest("hello", "abc", undefined);
                compareSameUndefinedNullTest("hello", 50, undefined);
            });

            runner.testFunction("equalSameUndefinedNull()", () =>
            {
                function equalSameUndefinedNullTest(left: unknown, right: unknown, expected: boolean | undefined): void
                {
                    runner.test(`with ${runner.andList([left, right])}`, (test: Test) =>
                    {
                        test.assertEqual(Comparer.equalSameUndefinedNull(left, right), expected);
                    });
                }

                equalSameUndefinedNullTest(undefined, undefined, true);
                equalSameUndefinedNullTest(undefined, null, false);
                equalSameUndefinedNullTest(undefined, "hello", false);
                equalSameUndefinedNullTest(undefined, 50, false);

                equalSameUndefinedNullTest(null, undefined, false);
                equalSameUndefinedNullTest(null, null, true);
                equalSameUndefinedNullTest(null, "hello", false);
                equalSameUndefinedNullTest(null, 50, false);

                equalSameUndefinedNullTest("hello", undefined, false);
                equalSameUndefinedNullTest("hello", null, false);
                equalSameUndefinedNullTest("hello", "hello", true);
                equalSameUndefinedNullTest("hello", "abc", undefined);
                equalSameUndefinedNullTest("hello", 50, undefined);
            });

            runner.testFunction("compareNumbers()", () =>
            {
                function compareNumbersTest(left: number | null | undefined, right: number | null | undefined, expected: Comparison | undefined): void
                {
                    runner.test(`with ${runner.andList([left, right])}`, (test: Test) =>
                    {
                        test.assertEqual(Comparer.compareNumbers(left, right), expected);
                    });
                }

                compareNumbersTest(undefined, undefined, Comparison.Equal);
                compareNumbersTest(undefined, null, Comparison.LessThan);
                compareNumbersTest(undefined, 50, Comparison.LessThan);

                compareNumbersTest(null, undefined, Comparison.GreaterThan);
                compareNumbersTest(null, null, Comparison.Equal);
                compareNumbersTest(null, 50, Comparison.LessThan);

                compareNumbersTest(50, undefined, Comparison.GreaterThan);
                compareNumbersTest(50, null, Comparison.GreaterThan);
                compareNumbersTest(50, 30, Comparison.GreaterThan);
                compareNumbersTest(50, 50, Comparison.Equal);
                compareNumbersTest(50, 60, Comparison.LessThan);
            });
        });
    });
}