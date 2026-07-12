import { Comparison } from "../sources/comparison.js";
import { StringComparer } from "../sources/stringComparer.js";
import { Test } from "./test.js";
import { TestRunner } from "./testRunner.js";

export function test(runner: TestRunner): void
{
    runner.testFile("stringComparer.ts", () =>
    {
        runner.testType("StringComparer", () =>
        {
            runner.testFunction("compare(string, string)", () =>
            {
                function compareTest(left: string, right: string, expected: Comparison): void
                {
                    runner.test(`with ${runner.andList([left, right])}`, (test: Test) =>
                    {
                        const comparer: StringComparer = StringComparer.create();
                        test.assertEqual(comparer.compare(left, right), expected);
                        test.assertEqual(comparer.lessThan(left, right), expected === Comparison.LessThan);
                        test.assertEqual(comparer.lessThanOrEqual(left, right), expected !== Comparison.GreaterThan);
                        test.assertEqual(comparer.equal(left, right), expected === Comparison.Equal);
                        test.assertEqual(comparer.greaterThanOrEqualTo(left, right), expected !== Comparison.LessThan);
                        test.assertEqual(comparer.greaterThan(left, right), expected === Comparison.GreaterThan);
                    });
                }

                compareTest(undefined!, undefined!, Comparison.Equal);
                compareTest(undefined!, null!, Comparison.LessThan);
                compareTest(undefined!, "", Comparison.LessThan);
                compareTest(undefined!, "a", Comparison.LessThan);
                compareTest(undefined!, "def", Comparison.LessThan);

                compareTest(null!, undefined!, Comparison.GreaterThan);
                compareTest(null!, null!, Comparison.Equal);
                compareTest(null!, "", Comparison.LessThan);
                compareTest(null!, "a", Comparison.LessThan);
                compareTest(null!, "def", Comparison.LessThan);

                compareTest("", undefined!, Comparison.GreaterThan);
                compareTest("", null!, Comparison.GreaterThan);
                compareTest("", "", Comparison.Equal);
                compareTest("", "a", Comparison.LessThan);
                compareTest("", "def", Comparison.LessThan);

                compareTest("a", undefined!, Comparison.GreaterThan);
                compareTest("a", null!, Comparison.GreaterThan);
                compareTest("a", "", Comparison.GreaterThan);
                compareTest("a", "a", Comparison.Equal);
                compareTest("a", "def", Comparison.LessThan);

                compareTest("def", undefined!, Comparison.GreaterThan);
                compareTest("def", null!, Comparison.GreaterThan);
                compareTest("def", "", Comparison.GreaterThan);
                compareTest("def", "a", Comparison.GreaterThan);
                compareTest("def", "def", Comparison.Equal);
            });
        });
    });
}