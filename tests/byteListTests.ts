import { ByteList, JavascriptIterable, PreConditionError } from "../sources/index.js";
import { Test } from "./test.js";
import { TestRunner } from "./testRunner.js";

export function test(runner: TestRunner): void
{
    runner.testFile("byteList.ts", () =>
    {
        runner.testType("ByteList", () =>
        {
            runner.testFunction("create()", () =>
            {
                runner.test("no arguments", (test: Test) =>
                {
                    const list: ByteList = ByteList.create();
                    test.assertNotUndefinedAndNotNull(list);
                    test.assertEqual(0, list.getCount().await());
                });

                function createErrorTest(initialValues: JavascriptIterable<number>, expected: Error): void
                {
                    runner.test(`with ${runner.toString(initialValues)}`, (test: Test) =>
                    {
                        test.assertThrows(() => ByteList.create(initialValues), expected);
                    });
                }

                createErrorTest([-1], new PreConditionError(
                    "Expression: value",
                    "Expected:   between 0 and 255",
                    "Actual:     -1",
                ));
                createErrorTest([256], new PreConditionError(
                    "Expression: value",
                    "Expected:   between 0 and 255",
                    "Actual:     256",
                ));

                function createTest(initialValues: JavascriptIterable<number>): void
                {
                    runner.test(`with ${runner.toString(initialValues)}`, (test: Test) =>
                    {
                        const list: ByteList = ByteList.create(initialValues);
                        test.assertNotUndefinedAndNotNull(list);
                        test.assertEqual([...initialValues], list.toArray().await());
                    });
                }

                createTest([]);
                createTest([1]);
                createTest([10, 20, 30]);
                createTest([255, 255]);
            });
        });
    });
}