import { PreConditionError } from "../sources";
import { BasicTestError } from "./BasicTestError";
import { Test } from "./test";
import { TestRunner } from "./testRunner";

export function test(runner: TestRunner): void
{
    runner.testFile("BasicTestError.ts", () =>
    {
        runner.testType("BasicTestError", () =>
        {
            runner.testFunction("create()", () =>
            {
                function createErrorTest(error: unknown, expected: Error): void
                {
                    runner.test(`with ${runner.toString(error)}`, (test: Test) =>
                    {
                        test.assertThrows(() => BasicTestError.create(error), expected);
                    });
                }

                createErrorTest(undefined, new PreConditionError(
                    "Expression: error",
                    "Expected: not undefined and not null",
                    "Actual: undefined",
                ));
                createErrorTest(null, new PreConditionError(
                    "Expression: error",
                    "Expected: not undefined and not null",
                    "Actual: null",
                ));

                runner.test(`with ${runner.toString("hello there")}`, (test: Test) =>
                {
                    const testError: BasicTestError = BasicTestError.create("hello there");
                    test.assertNotUndefinedAndNotNull(testError);
                    test.assertEqual("hello there", testError.getError());
                    test.assertEqual("hello there", testError.getErrorString());
                });

                runner.test(`with ${runner.toString(20)}`, (test: Test) =>
                {
                    const testError: BasicTestError = BasicTestError.create(20);
                    test.assertNotUndefinedAndNotNull(testError);
                    test.assertEqual(20, testError.getError());
                    test.assertEqual("20", testError.getErrorString());
                });

                runner.test(`with generic Error`, (test: Test) =>
                {
                    const error: Error = new Error("I'm an error!");
                    const testError: BasicTestError = BasicTestError.create(error);
                    test.assertNotUndefinedAndNotNull(testError);
                    test.assertSame(error, testError.getError());

                    const errorString: string = testError.getErrorString();
                    test.assertTrue(errorString.includes("Error: I'm an error!"));
                    test.assertTrue(errorString.includes("tests/BasicTestErrorTests.ts:"));
                    test.assertTrue(errorString.includes("tests/consoleTestRunner.ts:"));
                    test.assertTrue(errorString.includes("tests/tests.ts:"));
                });

                runner.test(`with TypeError`, (test: Test) =>
                {
                    const error: TypeError = new TypeError("Oops! Type error!");
                    const testError: BasicTestError = BasicTestError.create(error);
                    test.assertNotUndefinedAndNotNull(testError);
                    test.assertSame(error, testError.getError());

                    const errorString: string = testError.getErrorString();
                    test.assertTrue(errorString.includes("TypeError: Oops! Type error!"));
                    test.assertTrue(errorString.includes("tests/BasicTestErrorTests.ts:"));
                    test.assertTrue(errorString.includes("tests/consoleTestRunner.ts:"));
                    test.assertTrue(errorString.includes("tests/tests.ts:"));
                });

                runner.test(`with test failure error`, (test: Test) =>
                {
                    let testError: BasicTestError | undefined;
                    try
                    {
                        test.assertEqual(1, 2);
                    }
                    catch (error)
                    {
                        testError = BasicTestError.create(error);
                    }
                    test.assertNotUndefinedAndNotNull(testError);

                    const errorString: string = testError.getErrorString();
                    test.assertTrue(errorString.includes("AssertionError [ERR_ASSERTION]: Expected values to be strictly deep-equal:"));
                    test.assertTrue(errorString.includes("1 !== 2"));
                    test.assertTrue(errorString.includes("tests/BasicTestErrorTests.ts:"));
                    test.assertTrue(errorString.includes("tests/consoleTestRunner.ts:"));
                    test.assertTrue(errorString.includes("tests/tests.ts:"));
                });
            });
        });
    });
}