import { AsyncDisposable } from "../sources/AsyncDisposable.js";
import { AsyncResult } from "../sources/asyncResult.js";
import { PreConditionError } from "../sources/preConditionError.js";
import { Test } from "./test.js";
import { TestRunner } from "./testRunner.js";

export function test(runner: TestRunner): void
{
    runner.testFile("AsyncDisposable.ts", () =>
    {
        runner.testType("AsyncDisposable", () =>
        {
            runner.testFunction("create()", () =>
            {
                function createErrorTest(testName: string, disposedFunction: () => (void | Promise<void>), expectedError: Error): void
                {
                    runner.test(testName, (test: Test) =>
                    {
                        test.assertThrows(() => AsyncDisposable.create(disposedFunction), expectedError);
                    });
                }

                createErrorTest("with undefined", undefined!, new PreConditionError(
                    "Expression: disposeFunction",
                    "Expected:   not undefined and not null",
                    "Actual:     undefined",
                ));
                createErrorTest("with null", null!, new PreConditionError(
                    "Expression: disposeFunction",
                    "Expected:   not undefined and not null",
                    "Actual:     null",
                ));

                runner.test("with function", (test: Test) =>
                {
                    let value: number = 0;
                    const disposable: AsyncDisposable = AsyncDisposable.create(() => value += 1);
                    test.assertNotUndefinedAndNotNull(disposable);
                    test.assertFalse(disposable.isDisposed());
                    test.assertEqual(value, 0);
                });
            });

            runner.testFunction("dispose()", () =>
            {
                runner.test("with function that doesn't throw", async (test: Test) =>
                {
                    let value: number = 0;
                    const disposable: AsyncDisposable = AsyncDisposable.create(() =>
                    {
                        test.assertEqual(disposable.isDisposed(), value !== 0);
                        value += 1;
                    });

                    const result1: AsyncResult<boolean> = disposable.dispose();
                    test.assertNotUndefinedAndNotNull(result1);
                    test.assertFalse(disposable.isDisposed());
                    test.assertEqual(value, 1);

                    for (let i = 0; i < 3; i++)
                    {
                        const resultValue: boolean = await result1;
                        test.assertTrue(resultValue);
                        test.assertTrue(disposable.isDisposed());
                        test.assertEqual(value, 1);
                    }

                    const result2: AsyncResult<boolean> = disposable.dispose();
                    test.assertNotUndefinedAndNotNull(result2);
                    test.assertTrue(disposable.isDisposed());
                    test.assertEqual(value, 1);

                    for (let i = 0; i < 3; i++)
                    {
                        const resultValue: boolean = await result2;
                        test.assertFalse(resultValue);
                        test.assertTrue(disposable.isDisposed());
                        test.assertEqual(value, 1);
                    }
                });

                runner.test("with function that throws", async (test: Test) =>
                {
                    let value: number = 0;
                    const disposable: AsyncDisposable = AsyncDisposable.create(() =>
                    {
                        test.assertEqual(disposable.isDisposed(), value !== 0);
                        value += 1;
                        throw new Error("oops!");
                    });

                    const result1: AsyncResult<boolean> = disposable.dispose();
                    test.assertNotUndefinedAndNotNull(result1);
                    test.assertTrue(disposable.isDisposed());
                    test.assertEqual(value, 1);

                    for (let i = 0; i < 3; i++)
                    {
                        await test.assertThrowsAsync(result1, new Error("oops!"));
                        test.assertTrue(disposable.isDisposed());
                        test.assertEqual(value, 1);
                    }

                    const result2: AsyncResult<boolean> = disposable.dispose();
                    test.assertNotUndefinedAndNotNull(result2);
                    test.assertTrue(disposable.isDisposed());
                    test.assertEqual(value, 1);

                    for (let i = 0; i < 3; i++)
                    {
                        const resultValue: boolean = await result2;
                        test.assertFalse(resultValue);
                        test.assertTrue(disposable.isDisposed());
                        test.assertEqual(value, 1);
                    }
                });
            });
        });
    });
}