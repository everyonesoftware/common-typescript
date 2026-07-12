import { andList, orList } from "../sources/english.js";
import { PreConditionError } from "../sources/preConditionError.js";
import { join } from "../sources/strings.js";
import { Test } from "./test.js";
import { TestRunner } from "./testRunner.js";

export function test(runner: TestRunner): void
{
    runner.testFile("english.ts", () =>
    {
        runner.testFunction("andList(string[])", () =>
        {
            function andListErrorTest(values: string[] | undefined | null, expectedError: Error): void
            {
                runner.test(`with ${runner.toString(values)}`, (test: Test) =>
                {
                    test.assertThrows(() => andList(values!), expectedError);
                });
            }

            andListErrorTest(
                undefined,
                new PreConditionError(
                    join("\n", [
                        "Expression: values",
                        "Expected: not undefined and not null",
                        "Actual: undefined",
                    ])));
                    andListErrorTest(
                null,
                new PreConditionError(
                    join("\n", [
                        "Expression: values",
                        "Expected: not undefined and not null",
                        "Actual: null",
                    ])));

            function andListTest(values: string[], expected: string): void
            {
                runner.test(`with ${runner.toString(values)}`, (test: Test) =>
                {
                    test.assertEqual(andList(values), expected);
                });
            }

            andListTest([], "");
            andListTest([""], "");
            andListTest(["", ""], " and ");
            andListTest(["", "", ""], ", , and ");
            
            andListTest(["a"], "a");
            andListTest(["a", "b"], "a and b");
            andListTest(["a", "b", "c"], "a, b, and c");
            andListTest(["a", "b", "c", "d"], "a, b, c, and d");
        });

        runner.testFunction("orList(string[])", () =>
        {
            function orListErrorTest(values: string[] | undefined | null, expectedError: Error): void
            {
                runner.test(`with ${runner.toString(values)}`, (test: Test) =>
                {
                    test.assertThrows(() => orList(values!), expectedError);
                });
            }

            orListErrorTest(
                undefined,
                new PreConditionError(
                    join("\n", [
                        "Expression: values",
                        "Expected: not undefined and not null",
                        "Actual: undefined",
                    ])));
                    orListErrorTest(
                null,
                new PreConditionError(
                    join("\n", [
                        "Expression: values",
                        "Expected: not undefined and not null",
                        "Actual: null",
                    ])));

            function orListTest(values: string[], expected: string): void
            {
                runner.test(`with ${runner.toString(values)}`, (test: Test) =>
                {
                    test.assertEqual(orList(values), expected);
                });
            }

            orListTest([], "");
            orListTest([""], "");
            orListTest(["", ""], " or ");
            orListTest(["", "", ""], ", , or ");
            
            orListTest(["a"], "a");
            orListTest(["a", "b"], "a or b");
            orListTest(["a", "b", "c"], "a, b, or c");
            orListTest(["a", "b", "c", "d"], "a, b, c, or d");
        });
    });
}