import { SyncDisposable } from "../sources/SyncDisposable.js";
import { PreConditionError } from "../sources/preConditionError.js";
import { SyncResult } from "../sources/syncResult.js";
import { Test } from "./test.js";
import { TestRunner } from "./testRunner.js";

export function test(runner: TestRunner): void
{
    runner.testFile("SyncDisposable.ts", () =>
    {
        runner.testType("SyncDisposable", () =>
        {
            runner.testFunction("create()", () =>
            {
                function createErrorTest(testName: string, disposedFunction: () => void, expectedError: Error): void
                {
                    runner.test(testName, (test: Test) =>
                    {
                        test.assertThrows(() => SyncDisposable.create(disposedFunction), expectedError);
                    });
                }

                createErrorTest("with undefined", undefined!, new PreConditionError(
                    "Expression: disposeFunction",
                    "Expected: not undefined and not null",
                    "Actual: undefined",
                ));
                createErrorTest("with null", null!, new PreConditionError(
                    "Expression: disposeFunction",
                    "Expected: not undefined and not null",
                    "Actual: null",
                ));

                runner.test("with function", (test: Test) =>
                {
                    let value: number = 0;
                    const disposable: SyncDisposable = SyncDisposable.create(() => value += 1);
                    test.assertNotUndefinedAndNotNull(disposable);
                    test.assertFalse(disposable.isDisposed());
                    test.assertEqual(value, 0);
                });
            });

            runner.testFunction("dispose()", () =>
            {
                runner.test("with function that doesn't throw", (test: Test) =>
                {
                    let value: number = 0;
                    const disposable: SyncDisposable = SyncDisposable.create(() =>
                    {
                        test.assertEqual(disposable.isDisposed(), value !== 0);
                        value += 1;
                    });

                    const result1: SyncResult<boolean> = disposable.dispose();
                    test.assertNotUndefinedAndNotNull(result1);
                    test.assertTrue(disposable.isDisposed());
                    test.assertEqual(value, 1);

                    for (let i = 0; i < 3; i++)
                    {
                        const resultValue: boolean = result1.await();
                        test.assertTrue(resultValue);
                        test.assertTrue(disposable.isDisposed());
                        test.assertEqual(value, 1);
                    }

                    const result2: SyncResult<boolean> = disposable.dispose();
                    test.assertNotUndefinedAndNotNull(result2);
                    test.assertTrue(disposable.isDisposed());
                    test.assertEqual(value, 1);

                    for (let i = 0; i < 3; i++)
                    {
                        const resultValue: boolean = result2.await();
                        test.assertFalse(resultValue);
                        test.assertTrue(disposable.isDisposed());
                        test.assertEqual(value, 1);
                    }
                });

                runner.test("with function that throws", (test: Test) =>
                {
                    let value: number = 0;
                    const disposable: SyncDisposable = SyncDisposable.create(() =>
                    {
                        test.assertEqual(disposable.isDisposed(), value !== 0);
                        value += 1;
                        throw new Error("oops!");
                    });

                    const result1: SyncResult<boolean> = disposable.dispose();
                    test.assertNotUndefinedAndNotNull(result1);
                    test.assertTrue(disposable.isDisposed());
                    test.assertEqual(value, 1);

                    for (let i = 0; i < 3; i++)
                    {
                        test.assertThrows(() => result1.await(), new Error("oops!"));
                        test.assertTrue(disposable.isDisposed());
                        test.assertEqual(value, 1);
                    }

                    const result2: SyncResult<boolean> = disposable.dispose();
                    test.assertNotUndefinedAndNotNull(result2);
                    test.assertTrue(disposable.isDisposed());
                    test.assertEqual(value, 1);

                    for (let i = 0; i < 3; i++)
                    {
                        const resultValue: boolean = result2.await();
                        test.assertFalse(resultValue);
                        test.assertTrue(disposable.isDisposed());
                        test.assertEqual(value, 1);
                    }
                });
            });
        });
    });
}