import { NotFoundError } from "../sources/notFoundError.js";
import { PreConditionError } from "../sources/preConditionError.js";
import { SyncResult } from "../sources/syncResult.js";
import { Test } from "./test.js";
import { TestRunner } from "./testRunner.js";

export function test(runner: TestRunner): void
{
    runner.testFile("syncResult.ts", () =>
    {
        runner.testType("SyncResult<T>", () =>
        {
            runner.testFunction("create()", () =>
            {
                function createErrorTest<T>(testName: string, action: () => T, expected: Error): void
                {
                    runner.test(testName, (test: Test) =>
                    {
                        test.assertThrows(() => SyncResult.create(action), expected);
                    });
                }

                createErrorTest("with undefined", undefined!, new PreConditionError(
                    "Expression: action",
                    "Expected: not undefined and not null",
                    "Actual: undefined",
                ));
                createErrorTest("with null", null!, new PreConditionError(
                    "Expression: action",
                    "Expected: not undefined and not null",
                    "Actual: null",
                ));

                runner.test("with action", (test: Test) =>
                {
                    const result: SyncResult<number> = SyncResult.create(() => 5);
                    test.assertNotUndefinedAndNotNull(result);

                    const value: number = result.await();
                    test.assertEqual(5, value);
                });

                runner.test("with action with side-effects", (test: Test) =>
                {
                    let counter = 0;
                    const result: SyncResult<number> = SyncResult.create(() => { return ++counter; });
                    test.assertEqual(counter, 1);

                    for (let i = 0; i < 3; i++)
                    {
                        test.assertEqual(1, result.await());
                        test.assertEqual(1, counter);
                    }
                });
            });

            runner.testFunction("value()", () =>
            {
                function valueTest<T>(value: T): void
                {
                    runner.test(`with ${runner.toString(value)}`, (test: Test) =>
                    {
                        const result: SyncResult<T> = SyncResult.value(value);
                        test.assertNotUndefinedAndNotNull(result);

                        const awaitResult: T = result.await();
                        test.assertSame(awaitResult, value);
                    });
                }

                valueTest(undefined);
                valueTest(null);
                valueTest(50);
                valueTest({});
            });

            runner.testFunction("error()", () =>
            {
                function errorTest<T>(error: Error): void
                {
                    runner.test(`with ${runner.toString(error)}`, (test: Test) =>
                    {
                        const result: SyncResult<T> = SyncResult.error(error);
                        test.assertNotUndefinedAndNotNull(result);

                        test.assertThrows(result, error);
                    });
                }

                errorTest(new Error("oops"));
                errorTest(new NotFoundError("not here"));
            });

            runner.testGroup("async/await", () =>
            {
                runner.test("with value", async (test: Test) =>
                {
                    const result: SyncResult<number> = SyncResult.value(5);
                    test.assertEqual(await result, 5);
                });

                runner.test("with error", async (test: Test) =>
                {
                    const result: SyncResult<number> = SyncResult.error(new NotFoundError("abc"));
                    await test.assertThrowsAsync(result, new NotFoundError("abc"));
                });
            });

            runner.testFunction("then()", () =>
            {
                runner.testGroup("with non-PromiseLike return type", () =>
                {
                    runner.test("with error parent", (test: Test) =>
                    {
                        const parentResult: SyncResult<number> = SyncResult.error(new Error("abc"));
                        const thenResult: SyncResult<string> = parentResult.then(() => "hello");
                        test.assertThrows(() => thenResult.await(), new Error("abc"));
                    });

                    runner.test("with error parent and thenFunction with side-effects", (test: Test) =>
                    {
                        const parentResult: SyncResult<number> = SyncResult.error(new Error("abc"));
                        let counter: number = 0;
                        const thenResult: SyncResult<string> = parentResult.then(() => { counter++; return "hello"; });
                        test.assertSame(0, counter);
                        test.assertThrows(() => thenResult.await(), new Error("abc"));
                        test.assertSame(0, counter);
                    });

                    runner.test("with successful parent and successful thenFunction that ignores parentResult value", (test: Test) =>
                    {
                        const parentResult: SyncResult<number> = SyncResult.value(1);
                        const thenResult: SyncResult<string> = parentResult.then(() => "hello");
                        test.assertSame("hello", thenResult.await());
                    });

                    runner.test("with successful parent and successful thenFunction that uses parentResult value", (test: Test) =>
                    {
                        const parentResult: SyncResult<number> = SyncResult.value(1);
                        const thenResult: SyncResult<string> = parentResult.then((argument: number) => (argument + 1).toString());
                        test.assertSame("2", thenResult.await());
                    });

                    runner.test("with successful parent and successful thenFunction that uses parentResult value with side-effects", (test: Test) =>
                    {
                        const parentResult: SyncResult<number> = SyncResult.value(1);
                        let counter: number = 0;
                        const thenResult: SyncResult<string> = parentResult.then((argument: number) => { counter++; return (argument + 1).toString(); });
                        test.assertSame(1, counter);
                        for (let i = 0; i < 3; i++)
                        {
                            test.assertSame("2", thenResult.await());
                            test.assertSame(1, counter);
                        }
                    });

                    runner.test("with successful parent and thenFunction that throws", async (test: Test) =>
                    {
                        const parentResult: SyncResult<number> = SyncResult.value(10);
                        let counter: number = 0;
                        const thenResult: SyncResult<string> = parentResult.then((argument: number) =>
                        {
                            counter++;
                            throw new Error(`arg: ${argument}`);
                        });
                        test.assertSame(counter, 1);

                        for (let i = 0; i < 3; i++)
                        {
                            test.assertThrows(thenResult, new Error("arg: 10"));
                            test.assertSame(counter, 1);

                            await test.assertThrowsAsync(thenResult, new Error("arg: 10"));
                            test.assertSame(counter, 1);
                        }
                    });
                });
            });

            runner.testFunction("onValue()", () =>
            {
                runner.test("with error parent", async (test: Test) =>
                {
                    const parentResult: SyncResult<number> = SyncResult.error(new Error("abc"));
                    let counter: number = 0;
                    const onValueResult: SyncResult<number> = parentResult.onValue(() => counter++);
                    test.assertSame(counter, 0);
                    for (let i = 0; i < 3; i++)
                    {
                        await test.assertThrowsAsync(onValueResult, new Error("abc"));
                        test.assertSame(counter, 0);
                    }
                });

                runner.test("with successful parent and successful thenFunction that ignores parentResult value", async (test: Test) =>
                {
                    const parentResult: SyncResult<number> = SyncResult.value(10);
                    let counter: number = 0;
                    const onValueResult: SyncResult<number> = parentResult.onValue(() => counter++);
                    test.assertSame(counter, 1);
                    for (let i = 0; i < 3; i++)
                    {
                        test.assertSame(10, onValueResult.await());
                        test.assertSame(counter, 1);

                        test.assertSame(10, await onValueResult);
                        test.assertSame(counter, 1);
                    }
                });

                runner.test("with successful parent and successful thenFunction that uses parentResult value", async (test: Test) =>
                {
                    const parentResult: SyncResult<number> = SyncResult.value(2);
                    let counter: number = 0;
                    const onValueResult: SyncResult<number> = parentResult.onValue((argument: number) => counter += argument);
                    test.assertSame(counter, 2);
                    for (let i = 0; i < 3; i++)
                    {
                        test.assertSame(onValueResult.await(), 2);
                        test.assertSame(counter, 2);

                        test.assertSame(await onValueResult, 2);
                        test.assertSame(counter, 2);
                    }
                });

                runner.test("with successful parent and onValueFunction that throws", async (test: Test) =>
                {
                    const parentResult: SyncResult<number> = SyncResult.value(2);
                    let counter: number = 0;
                    const onValueResult: SyncResult<number> = parentResult.onValue((argument: number) =>
                    {
                        counter += argument;
                        throw new Error(`argument: ${argument}`);
                    });
                    test.assertSame(counter, 2);
                    for (let i = 0; i < 3; i++)
                    {
                        test.assertThrows(onValueResult, new Error("argument: 2"));
                        test.assertSame(counter, 2);

                        await test.assertThrowsAsync(onValueResult, new Error("argument: 2"));
                        test.assertSame(counter, 2);
                    }
                });
            });

            runner.testFunction("catch()", () =>
            {
                runner.test("with undefined errorType", (test: Test) =>
                {
                    const parentResult: SyncResult<number> = SyncResult.value(5);
                    test.assertThrows(() => parentResult.catch(undefined!, () => 6),
                        new PreConditionError(
                            "Expression: errorType",
                            "Expected: not undefined and not null",
                            "Actual: undefined"));
                });

                runner.test("with null errorType", (test: Test) =>
                {
                    const parentResult: SyncResult<number> = SyncResult.value(5);
                    test.assertThrows(() => parentResult.catch(null!, () => 6),
                        new PreConditionError(
                            "Expression: errorType",
                            "Expected: not undefined and not null",
                            "Actual: null"));
                });

                runner.testGroup("sync", () =>
                {
                    runner.test("with error parent", (test: Test) =>
                    {
                        const parentResult: SyncResult<number> = SyncResult.error(new Error("abc"));
                        const catchResult: SyncResult<number> = parentResult.catch(Error, () => 20);
                        test.assertSame(catchResult.await(), 20);
                    });

                    runner.test("with error parent, no errorType, and no error parameter", (test: Test) =>
                    {
                        const parentResult: SyncResult<number> = SyncResult.error(new Error("abc"));
                        let counter: number = 0;
                        const catchResult: SyncResult<number> = parentResult.catch(() => { counter++; return 21; });
                        test.assertSame(1, counter);
                        for (let i = 0; i < 3; i++)
                        {
                            test.assertSame(catchResult.await(), 21);
                            test.assertSame(1, counter);
                        }
                    });

                    runner.test("with error parent, no errorType, and unknown error parameter", (test: Test) =>
                    {
                        const parentResult: SyncResult<number> = SyncResult.error(new Error("abc"));
                        let counter: number = 0;
                        const catchResult: SyncResult<number> = parentResult.catch((error: unknown) =>
                        {
                            if (error instanceof Error)
                            {
                                counter += error.message.length;
                            }
                            else
                            {
                                counter -= 1;
                            }
                            return 21;
                        });
                        test.assertSame(3, counter);
                        for (let i = 0; i < 3; i++)
                        {
                            test.assertSame(catchResult.await(), 21);
                            test.assertSame(3, counter);
                        }
                    });

                    runner.test("with error parent and catchFunction with side-effects", (test: Test) =>
                    {
                        const parentResult: SyncResult<number> = SyncResult.error(new Error("abc"));
                        let counter: number = 0;
                        const catchResult: SyncResult<number> = parentResult.catch(Error, () => { counter++; return 21; });
                        test.assertSame(1, counter);
                        for (let i = 0; i < 3; i++)
                        {
                            test.assertSame(catchResult.await(), 21);
                            test.assertSame(1, counter);
                        }
                    });

                    runner.test("with errorType that is a super-type of the actual error without error parameter", (test: Test) =>
                    {
                        const parentResult: SyncResult<number> = SyncResult.error(new PreConditionError("abc"));
                        const catchResult: SyncResult<number> = parentResult.catch(Error, () => 5);
                        test.assertSame(catchResult.await(), 5);
                    });

                    runner.test("with errorType that is a super-type of the actual error with error parameter", (test: Test) =>
                    {
                        const parentResult: SyncResult<number> = SyncResult.error(new PreConditionError("abc"));
                        const catchResult: SyncResult<number> = parentResult.catch(Error, (error: Error) => error.message.length);
                        test.assertSame(catchResult.await(), 3);
                    });

                    runner.test("with errorType that is a sub-type of the actual error", (test: Test) =>
                    {
                        const parentResult: SyncResult<number> = SyncResult.error(new Error("abc"));
                        const catchResult: SyncResult<number> = parentResult.catch(PreConditionError, () => 20);
                        test.assertThrows(catchResult, new Error("abc"));
                    });

                    runner.test("with errorType that is unrelated to the actual error", (test: Test) =>
                    {
                        const parentResult: SyncResult<number> = SyncResult.error(new PreConditionError("def"));
                        const catchResult: SyncResult<number> = parentResult.catch(RangeError, () => 20);
                        test.assertThrows(catchResult, new PreConditionError("def"));
                    });

                    runner.test("with catchFunction that throws", (test: Test) =>
                    {
                        const parentResult: SyncResult<number> = SyncResult.error(new PreConditionError("def"));
                        const catchResult: SyncResult<number> = parentResult.catch(Error, () => { throw new TypeError("abc"); });
                        test.assertThrows(catchResult, new TypeError("abc"));
                    });

                    runner.test("with successful parent", (test: Test) =>
                    {
                        const parentResult: SyncResult<number> = SyncResult.value(1);
                        const catchResult: SyncResult<number> = parentResult.catch(Error, () => 2);
                        test.assertSame(catchResult.await(), 1);
                    });
                });

                runner.testGroup("async", () =>
                {
                    runner.test("with error parent", async (test: Test) =>
                    {
                        const parentResult: SyncResult<number> = SyncResult.error(new Error("abc"));
                        const catchResult: SyncResult<number> = parentResult.catch(Error, () => 20);
                        test.assertSame(await catchResult, 20);
                    });

                    runner.test("with error parent, no errorType, and no error parameter", async (test: Test) =>
                    {
                        const parentResult: SyncResult<number> = SyncResult.error(new Error("abc"));
                        let counter: number = 0;
                        const catchResult: SyncResult<number> = parentResult.catch(() => { counter++; return 21; });
                        test.assertSame(1, counter);
                        for (let i = 0; i < 3; i++)
                        {
                            test.assertSame(await catchResult, 21);
                            test.assertSame(1, counter);
                        }
                    });

                    runner.test("with error parent, no errorType, and unknown error parameter", async (test: Test) =>
                    {
                        const parentResult: SyncResult<number> = SyncResult.error(new Error("abc"));
                        let counter: number = 0;
                        const catchResult: SyncResult<number> = parentResult.catch((error: unknown) =>
                        {
                            if (error instanceof Error)
                            {
                                counter += error.message.length;
                            }
                            else
                            {
                                counter -= 1;
                            }
                            return 21;
                        });
                        test.assertSame(3, counter);
                        for (let i = 0; i < 3; i++)
                        {
                            test.assertSame(await catchResult, 21);
                            test.assertSame(3, counter);
                        }
                    });

                    runner.test("with error parent and catchFunction with side-effects", async (test: Test) =>
                    {
                        const parentResult: SyncResult<number> = SyncResult.error(new Error("abc"));
                        let counter: number = 0;
                        const catchResult: SyncResult<number> = parentResult.catch(Error, () => { counter++; return 21; });
                        test.assertSame(1, counter);
                        for (let i = 0; i < 3; i++)
                        {
                            test.assertSame(await catchResult, 21);
                            test.assertSame(1, counter);
                        }
                    });

                    runner.test("with errorType that is a super-type of the actual error without error parameter", async (test: Test) =>
                    {
                        const parentResult: SyncResult<number> = SyncResult.error(new PreConditionError("abc"));
                        const catchResult: SyncResult<number> = parentResult.catch(Error, () => 5);
                        test.assertSame(await catchResult, 5);
                    });

                    runner.test("with errorType that is a super-type of the actual error with error parameter", async (test: Test) =>
                    {
                        const parentResult: SyncResult<number> = SyncResult.error(new PreConditionError("abc"));
                        const catchResult: SyncResult<number> = parentResult.catch(Error, (error: Error) => error.message.length);
                        test.assertSame(await catchResult, 3);
                    });

                    runner.test("with errorType that is a sub-type of the actual error", async (test: Test) =>
                    {
                        const parentResult: SyncResult<number> = SyncResult.error(new Error("abc"));
                        const catchResult: SyncResult<number> = parentResult.catch(PreConditionError, () => 20);
                        await test.assertThrowsAsync(catchResult, new Error("abc"));
                    });

                    runner.test("with errorType that is unrelated to the actual error", async (test: Test) =>
                    {
                        const parentResult: SyncResult<number> = SyncResult.error(new PreConditionError("def"));
                        const catchResult: SyncResult<number> = parentResult.catch(RangeError, () => 20);
                        await test.assertThrowsAsync(catchResult, new PreConditionError("def"));
                    });

                    runner.test("with catchFunction that throws", async (test: Test) =>
                    {
                        const parentResult: SyncResult<number> = SyncResult.error(new PreConditionError("def"));
                        const catchResult: SyncResult<number> = parentResult.catch(Error, () => { throw new TypeError("abc"); });
                        await test.assertThrowsAsync(catchResult, new TypeError("abc"));
                    });

                    runner.test("with successful parent", async (test: Test) =>
                    {
                        const parentResult: SyncResult<number> = SyncResult.value(1);
                        const catchResult: SyncResult<number> = parentResult.catch(Error, () => 2);
                        test.assertSame(await catchResult, 1);
                    });
                });
            });

            runner.testFunction("onError()", () =>
            {
                runner.test("with undefined errorType", (test: Test) =>
                {
                    const parentResult: SyncResult<number> = SyncResult.value(5);
                    test.assertThrows(() => parentResult.onError(undefined!, () => { }),
                        new PreConditionError(
                            "Expression: errorType",
                            "Expected: not undefined and not null",
                            "Actual: undefined"));
                });

                runner.test("with null errorType", (test: Test) =>
                {
                    const parentResult: SyncResult<number> = SyncResult.value(5);
                    test.assertThrows(() => parentResult.onError(null!, () => { }),
                        new PreConditionError(
                            "Expression: errorType",
                            "Expected: not undefined and not null",
                            "Actual: null"));
                });

                runner.testGroup("sync", () =>
                {
                    runner.test("with error parent, no errorType, and no error parameter", (test: Test) =>
                    {
                        const parentResult: SyncResult<number> = SyncResult.error(new Error("abc"));
                        let counter: number = 0;
                        const catchResult: SyncResult<number> = parentResult.onError(() => { counter++; });
                        test.assertSame(1, counter);
                        for (let i = 0; i < 3; i++)
                        {
                            test.assertThrows(catchResult, new Error("abc"));
                            test.assertSame(1, counter);
                        }
                    });

                    runner.test("with error parent, no errorType, and unknown error parameter", (test: Test) =>
                    {
                        const parentResult: SyncResult<number> = SyncResult.error(new Error("abc"));
                        let counter: number = 0;
                        const catchResult: SyncResult<number> = parentResult.onError((error: unknown) =>
                        {
                            if (error instanceof Error)
                            {
                                counter += error.message.length;
                            }
                            else
                            {
                                counter -= 1;
                            }
                        });
                        test.assertSame(3, counter);
                        for (let i = 0; i < 3; i++)
                        {
                            test.assertThrows(catchResult, new Error("abc"));
                            test.assertSame(3, counter);
                        }
                    });

                    runner.test("with errorType that is a super-type of the actual error without error parameter", (test: Test) =>
                    {
                        const parentResult: SyncResult<number> = SyncResult.error(new PreConditionError("abc"));
                        let counter: number = 0;
                        const catchResult: SyncResult<number> = parentResult.onError(Error, () => { counter++; });
                        test.assertSame(counter, 1);
                        for (let i = 0; i < 3; i++)
                        {
                            test.assertThrows(catchResult, new PreConditionError("abc"));
                            test.assertSame(counter, 1);
                        }
                    });

                    runner.test("with errorType that is a super-type of the actual error with error parameter", (test: Test) =>
                    {
                        const parentResult: SyncResult<number> = SyncResult.error(new PreConditionError("abc"));
                        let counter: number = 0;
                        const catchResult: SyncResult<number> = parentResult.onError(Error, (error: Error) => { counter += error.message.length; });
                        test.assertSame(counter, 3);
                        for (let i = 0; i < 3; i++)
                        {
                            test.assertThrows(catchResult, new PreConditionError("abc"));
                            test.assertSame(counter, 3);
                        }
                    });

                    runner.test("with errorType that is a sub-type of the actual error", (test: Test) =>
                    {
                        const parentResult: SyncResult<number> = SyncResult.error(new Error("abc"));
                        let counter: number = 0;
                        const catchResult: SyncResult<number> = parentResult.onError(PreConditionError, () => { counter++; });
                        test.assertSame(counter, 0);
                        for (let i = 0; i < 3; i++)
                        {
                            test.assertThrows(catchResult, new Error("abc"));
                            test.assertSame(counter, 0);
                        }
                    });

                    runner.test("with errorType that is unrelated to the actual error", (test: Test) =>
                    {
                        const parentResult: SyncResult<number> = SyncResult.error(new PreConditionError("def"));
                        let counter: number = 0;
                        const catchResult: SyncResult<number> = parentResult.onError(RangeError, () => { counter++; });
                        test.assertSame(counter, 0);
                        for (let i = 0; i < 3; i++)
                        {
                            test.assertThrows(catchResult, new PreConditionError("def"));
                            test.assertSame(counter, 0);
                        }
                    });

                    runner.test("with onErrorFunction that throws", (test: Test) =>
                    {
                        const parentResult: SyncResult<number> = SyncResult.error(new PreConditionError("def"));
                        let counter: number = 0;
                        const catchResult: SyncResult<number> = parentResult.onError(Error, () => { counter++; throw new Error("abc"); });
                        test.assertSame(counter, 1);
                        for (let i = 0; i < 3; i++)
                        {
                            test.assertThrows(catchResult, new Error("abc"));
                            test.assertSame(counter, 1);
                        }
                    });

                    runner.test("with successful parent", (test: Test) =>
                    {
                        const parentResult: SyncResult<number> = SyncResult.value(1);
                        let counter: number = 0;
                        const catchResult: SyncResult<number> = parentResult.onError(Error, () => { counter++; });
                        test.assertSame(counter, 0);
                        for (let i = 0; i < 3; i++)
                        {
                            test.assertSame(catchResult.await(), 1);
                            test.assertSame(counter, 0);
                        }
                    });
                });

                runner.testGroup("async", () =>
                {
                    runner.test("with error parent, no errorType, and no error parameter", async (test: Test) =>
                    {
                        const parentResult: SyncResult<number> = SyncResult.error(new Error("abc"));
                        let counter: number = 0;
                        const catchResult: SyncResult<number> = parentResult.onError(() => { counter++; });
                        test.assertSame(1, counter);
                        for (let i = 0; i < 3; i++)
                        {
                            await test.assertThrowsAsync(catchResult, new Error("abc"));
                            test.assertSame(1, counter);
                        }
                    });

                    runner.test("with error parent, no errorType, and unknown error parameter", async (test: Test) =>
                    {
                        const parentResult: SyncResult<number> = SyncResult.error(new Error("abc"));
                        let counter: number = 0;
                        const catchResult: SyncResult<number> = parentResult.onError((error: unknown) =>
                        {
                            if (error instanceof Error)
                            {
                                counter += error.message.length;
                            }
                            else
                            {
                                counter -= 1;
                            }
                        });
                        test.assertSame(3, counter);
                        for (let i = 0; i < 3; i++)
                        {
                            await test.assertThrowsAsync(catchResult, new Error("abc"));
                            test.assertSame(3, counter);
                        }
                    });

                    runner.test("with errorType that is a super-type of the actual error without error parameter", async (test: Test) =>
                    {
                        const parentResult: SyncResult<number> = SyncResult.error(new PreConditionError("abc"));
                        let counter: number = 0;
                        const catchResult: SyncResult<number> = parentResult.onError(Error, () => { counter++; });
                        test.assertSame(counter, 1);
                        for (let i = 0; i < 3; i++)
                        {
                            await test.assertThrowsAsync(catchResult, new PreConditionError("abc"));
                            test.assertSame(counter, 1);
                        }
                    });

                    runner.test("with errorType that is a super-type of the actual error with error parameter", async (test: Test) =>
                    {
                        const parentResult: SyncResult<number> = SyncResult.error(new PreConditionError("abc"));
                        let counter: number = 0;
                        const catchResult: SyncResult<number> = parentResult.onError(Error, (error: Error) => { counter += error.message.length; });
                        test.assertSame(counter, 3);
                        for (let i = 0; i < 3; i++)
                        {
                            await test.assertThrowsAsync(catchResult, new PreConditionError("abc"));
                            test.assertSame(counter, 3);
                        }
                    });

                    runner.test("with errorType that is a sub-type of the actual error", async (test: Test) =>
                    {
                        const parentResult: SyncResult<number> = SyncResult.error(new Error("abc"));
                        let counter: number = 0;
                        const catchResult: SyncResult<number> = parentResult.onError(PreConditionError, () => { counter++; });
                        test.assertSame(counter, 0);
                        for (let i = 0; i < 3; i++)
                        {
                            await test.assertThrowsAsync(catchResult, new Error("abc"));
                            test.assertSame(counter, 0);
                        }
                    });

                    runner.test("with errorType that is unrelated to the actual error", async (test: Test) =>
                    {
                        const parentResult: SyncResult<number> = SyncResult.error(new PreConditionError("def"));
                        let counter: number = 0;
                        const catchResult: SyncResult<number> = parentResult.onError(RangeError, () => { counter++; });
                        test.assertSame(counter, 0);
                        for (let i = 0; i < 3; i++)
                        {
                            await test.assertThrowsAsync(catchResult, new PreConditionError("def"));
                            test.assertSame(counter, 0);
                        }
                    });

                    runner.test("with onErrorFunction that throws", async (test: Test) =>
                    {
                        const parentResult: SyncResult<number> = SyncResult.error(new PreConditionError("def"));
                        let counter: number = 0;
                        const catchResult: SyncResult<number> = parentResult.onError(Error, () => { counter++; throw new Error("abc"); });
                        test.assertSame(counter, 1);
                        for (let i = 0; i < 3; i++)
                        {
                            await test.assertThrowsAsync(catchResult, new Error("abc"));
                            test.assertSame(counter, 1);
                        }
                    });

                    runner.test("with successful parent", async (test: Test) =>
                    {
                        const parentResult: SyncResult<number> = SyncResult.value(1);
                        let counter: number = 0;
                        const catchResult: SyncResult<number> = parentResult.onError(Error, () => { counter++; });
                        test.assertSame(counter, 0);
                        for (let i = 0; i < 3; i++)
                        {
                            test.assertSame(await catchResult, 1);
                            test.assertSame(counter, 0);
                        }
                    });
                });
            });

            runner.testFunction("convertError()", () =>
            {
                runner.testGroup("async", () =>
                {
                    runner.test("with undefined convertErrorFunction", (test: Test) =>
                    {
                        const parentResult: SyncResult<number> = SyncResult.value(5);
                        test.assertThrows(() => parentResult.convertError(undefined!),
                            new PreConditionError(
                                "Expression: convertErrorFunction",
                                "Expected: not undefined and not null",
                                "Actual: undefined"));
                    });

                    runner.test("with null convertErrorFunction", (test: Test) =>
                    {
                        const parentResult: SyncResult<number> = SyncResult.value(5);
                        test.assertThrows(() => parentResult.convertError(null!),
                            new PreConditionError(
                                "Expression: convertErrorFunction",
                                "Expected: not undefined and not null",
                                "Actual: null"));
                    });

                    runner.test("with successful parent", async (test: Test) =>
                    {
                        const parentResult: SyncResult<number> = SyncResult.value(5);
                        let counter: number = 0;
                        const convertErrorResult: SyncResult<number> = parentResult.convertError((error: unknown) =>
                        {
                            counter++;
                            return new Error(`${error} - def`);
                        });
                        test.assertSame(counter, 0);
                        for (let i = 0; i < 3; i++)
                        {
                            test.assertSame(await convertErrorResult, 5);
                            test.assertSame(counter, 0);
                        }
                    });

                    runner.test("with error parent and non-throwing convertErrorFunction", async (test: Test) =>
                    {
                        const parentResult: SyncResult<number> = SyncResult.error(new Error("abc"));
                        let counter: number = 0;
                        const convertErrorResult: SyncResult<number> = parentResult.convertError((error: unknown) =>
                        {
                            counter++;
                            return new Error(`${(error as Error).message} - def`);
                        });
                        test.assertSame(counter, 1);
                        for (let i = 0; i < 3; i++)
                        {
                            await test.assertThrowsAsync(convertErrorResult, new Error("abc - def"));
                            test.assertSame(counter, 1);
                        }
                    });

                    runner.test("with error parent and throwing convertErrorFunction", async (test: Test) =>
                    {
                        const parentResult: SyncResult<number> = SyncResult.error(new Error("abc"));
                        let counter: number = 0;
                        const convertErrorResult: SyncResult<number> = parentResult.convertError((error: unknown) =>
                        {
                            counter++;
                            throw new Error(`${(error as Error).message} - def`);
                        });
                        test.assertSame(counter, 1);
                        for (let i = 0; i < 3; i++)
                        {
                            await test.assertThrowsAsync(convertErrorResult, new Error("abc - def"));
                            test.assertSame(counter, 1);
                        }
                    });

                    runner.test("with successful parent", async (test: Test) =>
                    {
                        const parentResult: SyncResult<number> = SyncResult.value(5);
                        let counter: number = 0;
                        const convertErrorResult: SyncResult<number> = parentResult.convertError(Error, (error: Error) =>
                        {
                            counter++;
                            return new Error(`${error.message} - def`);
                        });
                        test.assertSame(counter, 0);
                        for (let i = 0; i < 3; i++)
                        {
                            test.assertSame(await convertErrorResult, 5);
                            test.assertSame(counter, 0);
                        }
                    });

                    runner.test("with error parent, exact error match, and non-throwing convertErrorFunction", async (test: Test) =>
                    {
                        const parentResult: SyncResult<number> = SyncResult.error(new Error("abc"));
                        let counter: number = 0;
                        const convertErrorResult: SyncResult<number> = parentResult.convertError(Error, (error: Error) =>
                        {
                            counter++;
                            return new Error(`${error.message} - def`);
                        });
                        test.assertSame(counter, 1);
                        for (let i = 0; i < 3; i++)
                        {
                            await test.assertThrowsAsync(convertErrorResult, new Error("abc - def"));
                            test.assertSame(counter, 1);
                        }
                    });

                    runner.test("with error parent, super error match, and non-throwing convertErrorFunction", async (test: Test) =>
                    {
                        const parentResult: SyncResult<number> = SyncResult.error(new PreConditionError("abc"));
                        let counter: number = 0;
                        const convertErrorResult: SyncResult<number> = parentResult.convertError(Error, (error: Error) =>
                        {
                            counter++;
                            return new Error(`${error.message} - def`);
                        });
                        test.assertSame(counter, 1);
                        for (let i = 0; i < 3; i++)
                        {
                            await test.assertThrowsAsync(convertErrorResult, new Error(`abc - def`));
                            test.assertSame(counter, 1);
                        }
                    });

                    runner.test("with error parent, no error match, and non-throwing convertErrorFunction", async (test: Test) =>
                    {
                        const parentResult: SyncResult<number> = SyncResult.error(new PreConditionError("abc"));
                        let counter: number = 0;
                        const convertErrorResult: SyncResult<number> = parentResult.convertError(TypeError, (error: TypeError) =>
                        {
                            counter++;
                            return new Error(`${error} - def`);
                        });
                        test.assertSame(counter, 0);
                        for (let i = 0; i < 3; i++)
                        {
                            await test.assertThrowsAsync(convertErrorResult, new PreConditionError("abc"));
                            test.assertSame(counter, 0);
                        }
                    });

                    runner.test("with error parent, exact error match, and throwing convertErrorFunction", async (test: Test) =>
                    {
                        const parentResult: SyncResult<number> = SyncResult.error(new Error("abc"));
                        let counter: number = 0;
                        const convertErrorResult: SyncResult<number> = parentResult.convertError(Error, (error: Error) =>
                        {
                            counter++;
                            throw new Error(`${error.message} - def`);
                        });
                        test.assertSame(counter, 1);
                        for (let i = 0; i < 3; i++)
                        {
                            await test.assertThrowsAsync(convertErrorResult, new Error("abc - def"));
                            test.assertSame(counter, 1);
                        }
                    });

                    runner.test("with error parent, super error match, and throwing convertErrorFunction", async (test: Test) =>
                    {
                        const parentResult: SyncResult<number> = SyncResult.error(new TypeError("abc"));
                        let counter: number = 0;
                        const convertErrorResult: SyncResult<number> = parentResult.convertError(Error, (error: Error) =>
                        {
                            counter++;
                            throw new Error(`${error.message} - def`);
                        });
                        test.assertSame(counter, 1);
                        for (let i = 0; i < 3; i++)
                        {
                            await test.assertThrowsAsync(convertErrorResult, new Error("abc - def"));
                            test.assertSame(counter, 1);
                        }
                    });

                    runner.test("with error parent, no error match, and throwing convertErrorFunction", async (test: Test) =>
                    {
                        const parentResult: SyncResult<number> = SyncResult.error(new TypeError("abc"));
                        let counter: number = 0;
                        const convertErrorResult: SyncResult<number> = parentResult.convertError(PreConditionError, () =>
                        {
                            counter++;
                            throw new Error("def");
                        });
                        test.assertSame(counter, 0);
                        for (let i = 0; i < 3; i++)
                        {
                            await test.assertThrowsAsync(convertErrorResult, new TypeError("abc"));
                            test.assertSame(counter, 0);
                        }
                    });
                });

                runner.testGroup("sync", () =>
                {
                    runner.test("with undefined convertErrorFunction", (test: Test) =>
                    {
                        const parentResult: SyncResult<number> = SyncResult.value(5);
                        test.assertThrows(() => parentResult.convertError(undefined!),
                            new PreConditionError(
                                "Expression: convertErrorFunction",
                                "Expected: not undefined and not null",
                                "Actual: undefined"));
                    });

                    runner.test("with null convertErrorFunction", (test: Test) =>
                    {
                        const parentResult: SyncResult<number> = SyncResult.value(5);
                        test.assertThrows(() => parentResult.convertError(null!),
                            new PreConditionError(
                                "Expression: convertErrorFunction",
                                "Expected: not undefined and not null",
                                "Actual: null"));
                    });

                    runner.test("with successful parent", (test: Test) =>
                    {
                        const parentResult: SyncResult<number> = SyncResult.value(5);
                        let counter: number = 0;
                        const convertErrorResult: SyncResult<number> = parentResult.convertError((error: unknown) =>
                        {
                            counter++;
                            return new Error(`${error} - def`);
                        });
                        test.assertSame(counter, 0);
                        for (let i = 0; i < 3; i++)
                        {
                            test.assertSame(convertErrorResult.await(), 5);
                            test.assertSame(counter, 0);
                        }
                    });

                    runner.test("with error parent and non-throwing convertErrorFunction", (test: Test) =>
                    {
                        const parentResult: SyncResult<number> = SyncResult.error(new Error("abc"));
                        let counter: number = 0;
                        const convertErrorResult: SyncResult<number> = parentResult.convertError((error: unknown) =>
                        {
                            counter++;
                            return new Error(`${(error as Error).message} - def`);
                        });
                        test.assertSame(counter, 1);
                        for (let i = 0; i < 3; i++)
                        {
                            test.assertThrows(convertErrorResult, new Error("abc - def"));
                            test.assertSame(counter, 1);
                        }
                    });

                    runner.test("with error parent and throwing convertErrorFunction", (test: Test) =>
                    {
                        const parentResult: SyncResult<number> = SyncResult.error(new Error("abc"));
                        let counter: number = 0;
                        const convertErrorResult: SyncResult<number> = parentResult.convertError((error: unknown) =>
                        {
                            counter++;
                            throw new Error(`${(error as Error).message} - def`);
                        });
                        test.assertSame(counter, 1);
                        for (let i = 0; i < 3; i++)
                        {
                            test.assertThrows(convertErrorResult, new Error("abc - def"));
                            test.assertSame(counter, 1);
                        }
                    });

                    runner.test("with successful parent", (test: Test) =>
                    {
                        const parentResult: SyncResult<number> = SyncResult.value(5);
                        let counter: number = 0;
                        const convertErrorResult: SyncResult<number> = parentResult.convertError(Error, (error: Error) =>
                        {
                            counter++;
                            return new Error(`${error.message} - def`);
                        });
                        test.assertSame(counter, 0);
                        for (let i = 0; i < 3; i++)
                        {
                            test.assertSame(convertErrorResult.await(), 5);
                            test.assertSame(counter, 0);
                        }
                    });

                    runner.test("with error parent, exact error match, and non-throwing convertErrorFunction", (test: Test) =>
                    {
                        const parentResult: SyncResult<number> = SyncResult.error(new Error("abc"));
                        let counter: number = 0;
                        const convertErrorResult: SyncResult<number> = parentResult.convertError(Error, (error: Error) =>
                        {
                            counter++;
                            return new Error(`${error.message} - def`);
                        });
                        test.assertSame(counter, 1);
                        for (let i = 0; i < 3; i++)
                        {
                            test.assertThrows(convertErrorResult, new Error("abc - def"));
                            test.assertSame(counter, 1);
                        }
                    });

                    runner.test("with error parent, super error match, and non-throwing convertErrorFunction", (test: Test) =>
                    {
                        const parentResult: SyncResult<number> = SyncResult.error(new PreConditionError("abc"));
                        let counter: number = 0;
                        const convertErrorResult: SyncResult<number> = parentResult.convertError(Error, (error: Error) =>
                        {
                            counter++;
                            return new Error(`${error.message} - def`);
                        });
                        test.assertSame(counter, 1);
                        for (let i = 0; i < 3; i++)
                        {
                            test.assertThrows(convertErrorResult, new Error(`abc - def`));
                            test.assertSame(counter, 1);
                        }
                    });

                    runner.test("with error parent, no error match, and non-throwing convertErrorFunction", (test: Test) =>
                    {
                        const parentResult: SyncResult<number> = SyncResult.error(new PreConditionError("abc"));
                        let counter: number = 0;
                        const convertErrorResult: SyncResult<number> = parentResult.convertError(TypeError, (error: TypeError) =>
                        {
                            counter++;
                            return new Error(`${error} - def`);
                        });
                        test.assertSame(counter, 0);
                        for (let i = 0; i < 3; i++)
                        {
                            test.assertThrows(convertErrorResult, new PreConditionError("abc"));
                            test.assertSame(counter, 0);
                        }
                    });

                    runner.test("with error parent, exact error match, and throwing convertErrorFunction", (test: Test) =>
                    {
                        const parentResult: SyncResult<number> = SyncResult.error(new Error("abc"));
                        let counter: number = 0;
                        const convertErrorResult: SyncResult<number> = parentResult.convertError(Error, (error: Error) =>
                        {
                            counter++;
                            throw new Error(`${error.message} - def`);
                        });
                        test.assertSame(counter, 1);
                        for (let i = 0; i < 3; i++)
                        {
                            test.assertThrows(convertErrorResult, new Error("abc - def"));
                            test.assertSame(counter, 1);
                        }
                    });

                    runner.test("with error parent, super error match, and throwing convertErrorFunction", (test: Test) =>
                    {
                        const parentResult: SyncResult<number> = SyncResult.error(new TypeError("abc"));
                        let counter: number = 0;
                        const convertErrorResult: SyncResult<number> = parentResult.convertError(Error, (error: Error) =>
                        {
                            counter++;
                            throw new Error(`${error.message} - def`);
                        });
                        test.assertSame(counter, 1);
                        for (let i = 0; i < 3; i++)
                        {
                            test.assertThrows(convertErrorResult, new Error("abc - def"));
                            test.assertSame(counter, 1);
                        }
                    });

                    runner.test("with error parent, no error match, and throwing convertErrorFunction", (test: Test) =>
                    {
                        const parentResult: SyncResult<number> = SyncResult.error(new TypeError("abc"));
                        let counter: number = 0;
                        const convertErrorResult: SyncResult<number> = parentResult.convertError(PreConditionError, () =>
                        {
                            counter++;
                            throw new Error("def");
                        });
                        test.assertSame(counter, 0);
                        for (let i = 0; i < 3; i++)
                        {
                            test.assertThrows(convertErrorResult, new TypeError("abc"));
                            test.assertSame(counter, 0);
                        }
                    });
                });
            });

            runner.testFunction("finally()", () =>
            {
                runner.testGroup("async", () =>
                {
                    runner.test("with successful parent and non-throwing onfinally function", async (test: Test) =>
                    {
                        const parentResult: SyncResult<number> = SyncResult.value(5);
                        let counter: number = 0;
                        const finallyResult: SyncResult<number> = parentResult.finally(() => { counter++; });
                        test.assertSame(counter, 1);
                        for (let i = 0; i < 3; i++)
                        {
                            test.assertSame(await finallyResult, 5);
                            test.assertSame(counter, 1);
                        }
                    });

                    runner.test("with successful parent and throwing onfinally function", async (test: Test) =>
                    {
                        const parentResult: SyncResult<number> = SyncResult.value(5);
                        let counter: number = 0;
                        const finallyResult: SyncResult<number> = parentResult.finally(() =>
                        {
                            counter++;
                            throw new RangeError("oops!");
                        });
                        test.assertSame(counter, 1);
                        for (let i = 0; i < 3; i++)
                        {
                            await test.assertThrowsAsync(finallyResult, new RangeError("oops!"));
                            test.assertSame(counter, 1);
                        }
                    });

                    runner.test("with error parent and non-throwing onfinally function", async (test: Test) =>
                    {
                        const parentResult: SyncResult<number> = SyncResult.error(new Error("abc"));
                        let counter: number = 0;
                        const finallyResult: SyncResult<number> = parentResult.finally(() => { counter++; });
                        test.assertSame(counter, 1);
                        for (let i = 0; i < 3; i++)
                        {
                            await test.assertThrowsAsync(finallyResult, new Error("abc"));
                            test.assertSame(counter, 1);
                        }
                    });

                    runner.test("with error parent and throwing onfinally function", async (test: Test) =>
                    {
                        const parentResult: SyncResult<number> = SyncResult.error(new Error("abc"));
                        let counter: number = 0;
                        const convertErrorResult: SyncResult<number> = parentResult.finally(() =>
                        {
                            counter++;
                            throw new RangeError("def");
                        });
                        test.assertSame(counter, 1);
                        for (let i = 0; i < 3; i++)
                        {
                            await test.assertThrowsAsync(convertErrorResult, new RangeError("def"));
                            test.assertSame(counter, 1);
                        }
                    });
                });

                runner.testGroup("sync", () =>
                {
                    runner.test("with successful parent and non-throwing onfinally function", (test: Test) =>
                    {
                        const parentResult: SyncResult<number> = SyncResult.value(5);
                        let counter: number = 0;
                        const finallyResult: SyncResult<number> = parentResult.finally(() => { counter++; });
                        test.assertSame(counter, 1);
                        for (let i = 0; i < 3; i++)
                        {
                            test.assertSame(finallyResult.await(), 5);
                            test.assertSame(counter, 1);
                        }
                    });

                    runner.test("with successful parent and throwing onfinally function", (test: Test) =>
                    {
                        const parentResult: SyncResult<number> = SyncResult.value(5);
                        let counter: number = 0;
                        const finallyResult: SyncResult<number> = parentResult.finally(() =>
                        {
                            counter++;
                            throw new RangeError("oops!");
                        });
                        test.assertSame(counter, 1);
                        for (let i = 0; i < 3; i++)
                        {
                            test.assertThrows(finallyResult, new RangeError("oops!"));
                            test.assertSame(counter, 1);
                        }
                    });

                    runner.test("with error parent and non-throwing onfinally function", (test: Test) =>
                    {
                        const parentResult: SyncResult<number> = SyncResult.error(new Error("abc"));
                        let counter: number = 0;
                        const finallyResult: SyncResult<number> = parentResult.finally(() => { counter++; });
                        test.assertSame(counter, 1);
                        for (let i = 0; i < 3; i++)
                        {
                            test.assertThrows(finallyResult, new Error("abc"));
                            test.assertSame(counter, 1);
                        }
                    });

                    runner.test("with error parent and throwing onfinally function", (test: Test) =>
                    {
                        const parentResult: SyncResult<number> = SyncResult.error(new Error("abc"));
                        let counter: number = 0;
                        const convertErrorResult: SyncResult<number> = parentResult.finally(() =>
                        {
                            counter++;
                            throw new RangeError("def");
                        });
                        test.assertSame(counter, 1);
                        for (let i = 0; i < 3; i++)
                        {
                            test.assertThrows(convertErrorResult, new RangeError("def"));
                            test.assertSame(counter, 1);
                        }
                    });
                });
            });
        });
    });
}