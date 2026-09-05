import { PromiseAsyncResult } from "../sources/promiseAsyncResult.js";
import { PreConditionError } from "../sources/preConditionError.js";
import { Test } from "./test.js";
import { TestRunner } from "./testRunner.js";

export function test(runner: TestRunner): void
{
    runner.testFile("promiseAsyncResult.ts", () =>
    {
        runner.testType("PromiseAsyncResult<T>", () =>
        {
            runner.testFunction("create()", () =>
            {
                function createErrorTest<T>(testName: string, promise: Promise<T>, expected: Error): void
                {
                    runner.test(testName, (test: Test) =>
                    {
                        test.assertThrows(() => PromiseAsyncResult.create(promise), expected);
                    });
                }

                createErrorTest("with undefined", undefined!, new PreConditionError(
                    "Expression: action or promise",
                    "Expected:   not undefined and not null",
                    "Actual:     undefined",
                ));
                createErrorTest("with null", null!, new PreConditionError(
                    "Expression: action or promise",
                    "Expected:   not undefined and not null",
                    "Actual:     null",
                ));

                runner.test("with Promise", async (test: Test) =>
                {
                    const result: PromiseAsyncResult<number> = PromiseAsyncResult.create(Promise.resolve(5));
                    test.assertNotUndefinedAndNotNull(result);

                    const value: number = await result;
                    test.assertEqual(5, value);
                });
            });

            runner.testFunction("then()", () =>
            {
                runner.test("with error parent", async (test: Test) =>
                {
                    const parentResult: PromiseAsyncResult<number> = PromiseAsyncResult.error(new Error("abc"));
                    const thenResult: PromiseAsyncResult<string> = parentResult.then(() => "hello");
                    await test.assertThrowsAsync(thenResult, new Error("abc"));
                });

                runner.test("with error parent and thenFunction with side-effects", async (test: Test) =>
                {
                    const parentResult: PromiseAsyncResult<number> = PromiseAsyncResult.error(new Error("abc"));
                    let counter: number = 0;
                    const thenResult: PromiseAsyncResult<string> = parentResult.then(() => { counter++; return "hello"; });
                    test.assertEqual(0, counter);
                    await test.assertThrowsAsync(thenResult, new Error("abc"));
                    test.assertEqual(0, counter, "counter should still be 0 because the thenFunction shouldn't be invoked.");
                });

                runner.test("with successful parent and successful thenFunction that ignores parentResult value", async (test: Test) =>
                {
                    const parentResult: PromiseAsyncResult<number> = PromiseAsyncResult.value(1);
                    const thenResult: PromiseAsyncResult<string> = parentResult.then(() => "hello");
                    test.assertEqual("hello", await thenResult);
                });

                runner.test("with successful parent and successful thenFunction that uses parentResult value", async (test: Test) =>
                {
                    const parentResult: PromiseAsyncResult<number> = PromiseAsyncResult.value(1);
                    const thenResult: PromiseAsyncResult<string> = parentResult.then((argument: number) => (argument + 1).toString());
                    test.assertEqual("2", await thenResult);
                });

                runner.test("with successful parent and successful thenFunction that uses parentResult value with side-effects", async (test: Test) =>
                {
                    const parentResult: PromiseAsyncResult<number> = PromiseAsyncResult.value(1);
                    let counter: number = 0;
                    const thenResult: PromiseAsyncResult<string> = parentResult.then((argument: number) => { counter++; return (argument + 1).toString(); });
                    test.assertEqual(0, counter);

                    await PromiseAsyncResult.yield();
                    test.assertEqual(1, counter);

                    test.assertEqual("2", await thenResult);
                    test.assertEqual(1, counter);
                });

                runner.test("with successful parent and thenFunction that throws", async (test: Test) =>
                {
                    const parentResult: PromiseAsyncResult<number> = PromiseAsyncResult.value(10);
                    let counter: number = 0;
                    const thenResult: PromiseAsyncResult<string> = parentResult.then((argument: number) =>
                    {
                        counter++;
                        throw new Error(`arg: ${argument}, ${counter}`);
                    });
                    test.assertEqual(counter, 0);

                    await PromiseAsyncResult.yield();
                    test.assertEqual(counter, 1);

                    for (let i = 0; i < 3; i++)
                    {
                        await test.assertThrowsAsync(thenResult, new Error("arg: 10, 1"));
                        test.assertEqual(counter, 1);
                    }
                });
            });

            runner.testFunction("onValue()", () =>
            {
                runner.test("with error parent", async (test: Test) =>
                {
                    const parentResult: PromiseAsyncResult<number> = PromiseAsyncResult.error(new Error("abc"));
                    let counter: number = 0;
                    const onValueResult: PromiseAsyncResult<number> = parentResult.onValue(() => { counter++; });
                    test.assertSame(counter, 0);
                    for (let i = 0; i < 3; i++)
                    {
                        await test.assertThrowsAsync(onValueResult, new Error("abc"));
                        test.assertSame(counter, 0);
                    }
                });

                runner.test("with successful parent and successful thenFunction that ignores parentResult value", async (test: Test) =>
                {
                    const parentResult: PromiseAsyncResult<number> = PromiseAsyncResult.value(10);
                    let counter: number = 0;
                    const onValueResult: PromiseAsyncResult<number> = parentResult.onValue(() => { counter++; });
                    test.assertSame(counter, 0);
                    for (let i = 0; i < 3; i++)
                    {
                        test.assertSame(10, await onValueResult);
                        test.assertSame(counter, 1);
                    }
                });

                runner.test("with successful parent and successful thenFunction that uses parentResult value", async (test: Test) =>
                {
                    const parentResult: PromiseAsyncResult<number> = PromiseAsyncResult.value(2);
                    let counter: number = 0;
                    const onValueResult: PromiseAsyncResult<number> = parentResult.onValue((argument: number) => { counter += argument; });
                    test.assertSame(counter, 0);
                    for (let i = 0; i < 3; i++)
                    {
                        test.assertSame(await onValueResult, 2);
                        test.assertSame(counter, 2);
                    }
                });

                runner.test("with successful parent and onValueFunction that throws", async (test: Test) =>
                {
                    const parentResult: PromiseAsyncResult<number> = PromiseAsyncResult.value(2);
                    let counter: number = 0;
                    const onValueResult: PromiseAsyncResult<number> = parentResult.onValue((argument: number) =>
                    {
                        counter += argument;
                        throw new Error(`argument: ${argument}`);
                    });
                    test.assertSame(counter, 0);
                    for (let i = 0; i < 3; i++)
                    {
                        await test.assertThrowsAsync(onValueResult, new Error("argument: 2"));
                        test.assertSame(counter, 2);
                    }
                });
            });

            runner.testFunction("catch()", () =>
            {
                runner.test("with undefined errorType", (test: Test) =>
                {
                    const parentResult: PromiseAsyncResult<number> = PromiseAsyncResult.value(5);
                    test.assertThrows(() => parentResult.catch(undefined!, () => 6),
                        new PreConditionError(
                            "Expression: errorType",
                            "Expected:   not undefined and not null",
                            "Actual:     undefined"));
                });

                runner.test("with null errorType", (test: Test) =>
                {
                    const parentResult: PromiseAsyncResult<number> = PromiseAsyncResult.value(5);
                    test.assertThrows(() => parentResult.catch(null!, () => 6),
                        new PreConditionError(
                            "Expression: errorType",
                            "Expected:   not undefined and not null",
                            "Actual:     null"));
                });

                runner.test("with error parent", async (test: Test) =>
                {
                    const parentResult: PromiseAsyncResult<number> = PromiseAsyncResult.error(new Error("abc"));
                    const catchResult: PromiseAsyncResult<number> = parentResult.catch(Error, () => 20);
                    test.assertSame(await catchResult, 20);
                });

                runner.test("with error parent, no errorType, and no error parameter", async (test: Test) =>
                {
                    const parentResult: PromiseAsyncResult<number> = PromiseAsyncResult.error(new Error("abc"));
                    let counter: number = 0;
                    const catchResult: PromiseAsyncResult<number> = parentResult.catch(() => { counter++; return 21; });
                    test.assertSame(0, counter);
                    for (let i = 0; i < 3; i++)
                    {
                        test.assertSame(await catchResult, 21);
                        test.assertSame(1, counter);
                    }
                });

                runner.test("with error parent, no errorType, and unknown error parameter", async (test: Test) =>
                {
                    const parentResult: PromiseAsyncResult<number> = PromiseAsyncResult.error(new Error("abc"));
                    let counter: number = 0;
                    const catchResult: PromiseAsyncResult<number> = parentResult.catch((error: unknown) =>
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
                    test.assertSame(0, counter);
                    for (let i = 0; i < 3; i++)
                    {
                        test.assertSame(await catchResult, 21);
                        test.assertSame(3, counter);
                    }
                });

                runner.test("with error parent and catchFunction with side-effects", async (test: Test) =>
                {
                    const parentResult: PromiseAsyncResult<number> = PromiseAsyncResult.error(new Error("abc"));
                    let counter: number = 0;
                    const catchResult: PromiseAsyncResult<number> = parentResult.catch(Error, () => { counter++; return 21; });
                    test.assertSame(0, counter);
                    for (let i = 0; i < 3; i++)
                    {
                        test.assertSame(await catchResult, 21);
                        test.assertSame(1, counter);
                    }
                });

                runner.test("with errorType that is a super-type of the actual error without error parameter", async (test: Test) =>
                {
                    const parentResult: PromiseAsyncResult<number> = PromiseAsyncResult.error(new PreConditionError("abc"));
                    const catchResult: PromiseAsyncResult<number> = parentResult.catch(Error, () => 5);
                    test.assertSame(await catchResult, 5);
                });

                runner.test("with errorType that is a super-type of the actual error with error parameter", async (test: Test) =>
                {
                    const parentResult: PromiseAsyncResult<number> = PromiseAsyncResult.error(new PreConditionError("abc"));
                    const catchResult: PromiseAsyncResult<number> = parentResult.catch(Error, (error: Error) => error.message.length);
                    test.assertSame(await catchResult, 3);
                });

                runner.test("with errorType that is a sub-type of the actual error", async (test: Test) =>
                {
                    const parentResult: PromiseAsyncResult<number> = PromiseAsyncResult.error(new Error("abc"));
                    const catchResult: PromiseAsyncResult<number> = parentResult.catch(PreConditionError, () => 20);
                    await test.assertThrowsAsync(catchResult, new Error("abc"));
                });

                runner.test("with errorType that is unrelated to the actual error", async (test: Test) =>
                {
                    const parentResult: PromiseAsyncResult<number> = PromiseAsyncResult.error(new PreConditionError("def"));
                    const catchResult: PromiseAsyncResult<number> = parentResult.catch(RangeError, () => 20);
                    await test.assertThrowsAsync(catchResult, new PreConditionError("def"));
                });

                runner.test("with catchFunction that throws", async (test: Test) =>
                {
                    const parentResult: PromiseAsyncResult<number> = PromiseAsyncResult.error(new PreConditionError("def"));
                    const catchResult: PromiseAsyncResult<number> = parentResult.catch(Error, () => { throw new TypeError("abc"); });
                    await test.assertThrowsAsync(catchResult, new TypeError("abc"));
                });

                runner.test("with successful parent", async (test: Test) =>
                {
                    const parentResult: PromiseAsyncResult<number> = PromiseAsyncResult.value(1);
                    const catchResult: PromiseAsyncResult<number> = parentResult.catch(Error, () => 2);
                    test.assertSame(await catchResult, 1);
                });
            });

            runner.testFunction("onError()", () =>
            {
                runner.test("with undefined errorType", (test: Test) =>
                {
                    const parentResult: PromiseAsyncResult<number> = PromiseAsyncResult.value(5);
                    test.assertThrows(() => parentResult.onError(undefined!, () => { }),
                        new PreConditionError(
                            "Expression: errorType",
                            "Expected:   not undefined and not null",
                            "Actual:     undefined"));
                });

                runner.test("with null errorType", (test: Test) =>
                {
                    const parentResult: PromiseAsyncResult<number> = PromiseAsyncResult.value(5);
                    test.assertThrows(() => parentResult.onError(null!, () => { }),
                        new PreConditionError(
                            "Expression: errorType",
                            "Expected:   not undefined and not null",
                            "Actual:     null"));
                });

                runner.test("with error parent, no errorType, and no error parameter", async (test: Test) =>
                {
                    const parentResult: PromiseAsyncResult<number> = PromiseAsyncResult.error(new Error("abc"));
                    let counter: number = 0;
                    const catchResult: PromiseAsyncResult<number> = parentResult.onError(() => { counter++; });
                    test.assertSame(0, counter);
                    for (let i = 0; i < 3; i++)
                    {
                        await test.assertThrowsAsync(catchResult, new Error("abc"));
                        test.assertSame(1, counter);
                    }
                });

                runner.test("with error parent, no errorType, and unknown error parameter", async (test: Test) =>
                {
                    const parentResult: PromiseAsyncResult<number> = PromiseAsyncResult.error(new Error("abc"));
                    let counter: number = 0;
                    const catchResult: PromiseAsyncResult<number> = parentResult.onError((error: unknown) =>
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
                    test.assertSame(0, counter);
                    for (let i = 0; i < 3; i++)
                    {
                        await test.assertThrowsAsync(catchResult, new Error("abc"));
                        test.assertSame(3, counter);
                    }
                });

                runner.test("with errorType that is a super-type of the actual error without error parameter", async (test: Test) =>
                {
                    const parentResult: PromiseAsyncResult<number> = PromiseAsyncResult.error(new PreConditionError("abc"));
                    let counter: number = 0;
                    const catchResult: PromiseAsyncResult<number> = parentResult.onError(Error, () => { counter++; });
                    test.assertSame(counter, 0);
                    for (let i = 0; i < 3; i++)
                    {
                        await test.assertThrowsAsync(catchResult, new PreConditionError("abc"));
                        test.assertSame(counter, 1);
                    }
                });

                runner.test("with errorType that is a super-type of the actual error with error parameter", async (test: Test) =>
                {
                    const parentResult: PromiseAsyncResult<number> = PromiseAsyncResult.error(new PreConditionError("abc"));
                    let counter: number = 0;
                    const catchResult: PromiseAsyncResult<number> = parentResult.onError(Error, (error: Error) => { counter += error.message.length; });
                    test.assertSame(counter, 0);
                    for (let i = 0; i < 3; i++)
                    {
                        await test.assertThrowsAsync(catchResult, new PreConditionError("abc"));
                        test.assertSame(counter, 3);
                    }
                });

                runner.test("with errorType that is a sub-type of the actual error", async (test: Test) =>
                {
                    const parentResult: PromiseAsyncResult<number> = PromiseAsyncResult.error(new Error("abc"));
                    let counter: number = 0;
                    const catchResult: PromiseAsyncResult<number> = parentResult.onError(PreConditionError, () => { counter++; });
                    test.assertSame(counter, 0);
                    for (let i = 0; i < 3; i++)
                    {
                        await test.assertThrowsAsync(catchResult, new Error("abc"));
                        test.assertSame(counter, 0);
                    }
                });

                runner.test("with errorType that is unrelated to the actual error", async (test: Test) =>
                {
                    const parentResult: PromiseAsyncResult<number> = PromiseAsyncResult.error(new PreConditionError("def"));
                    let counter: number = 0;
                    const catchResult: PromiseAsyncResult<number> = parentResult.onError(RangeError, () => { counter++; });
                    test.assertSame(counter, 0);
                    for (let i = 0; i < 3; i++)
                    {
                        await test.assertThrowsAsync(catchResult, new PreConditionError("def"));
                        test.assertSame(counter, 0);
                    }
                });

                runner.test("with onErrorFunction that throws", async (test: Test) =>
                {
                    const parentResult: PromiseAsyncResult<number> = PromiseAsyncResult.error(new PreConditionError("def"));
                    let counter: number = 0;
                    const catchResult: PromiseAsyncResult<number> = parentResult.onError(Error, () => { counter++; throw new Error("abc"); });
                    test.assertSame(counter, 0);
                    for (let i = 0; i < 3; i++)
                    {
                        await test.assertThrowsAsync(catchResult, new Error("abc"));
                        test.assertSame(counter, 1);
                    }
                });

                runner.test("with successful parent", async (test: Test) =>
                {
                    const parentResult: PromiseAsyncResult<number> = PromiseAsyncResult.value(1);
                    let counter: number = 0;
                    const catchResult: PromiseAsyncResult<number> = parentResult.onError(Error, () => { counter++; });
                    test.assertSame(counter, 0);
                    for (let i = 0; i < 3; i++)
                    {
                        test.assertSame(await catchResult, 1);
                        test.assertSame(counter, 0);
                    }
                });
            });

            runner.testFunction("convertError()", () =>
            {
                runner.test("with undefined convertErrorFunction", (test: Test) =>
                {
                    const parentResult: PromiseAsyncResult<number> = PromiseAsyncResult.value(5);
                    test.assertThrows(() => parentResult.convertError(undefined!),
                        new PreConditionError(
                            "Expression: convertErrorFunction",
                            "Expected:   not undefined and not null",
                            "Actual:     undefined"));
                });

                runner.test("with null convertErrorFunction", (test: Test) =>
                {
                    const parentResult: PromiseAsyncResult<number> = PromiseAsyncResult.value(5);
                    test.assertThrows(() => parentResult.convertError(null!),
                        new PreConditionError(
                            "Expression: convertErrorFunction",
                            "Expected:   not undefined and not null",
                            "Actual:     null"));
                });

                runner.test("with successful parent", async (test: Test) =>
                {
                    const parentResult: PromiseAsyncResult<number> = PromiseAsyncResult.value(5);
                    let counter: number = 0;
                    const convertErrorResult: PromiseAsyncResult<number> = parentResult.convertError((error: unknown) =>
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
                    const parentResult: PromiseAsyncResult<number> = PromiseAsyncResult.error(new Error("abc"));
                    let counter: number = 0;
                    const convertErrorResult: PromiseAsyncResult<number> = parentResult.convertError((error: unknown) =>
                    {
                        counter++;
                        return new Error(`${(error as Error).message} - def`);
                    });
                    test.assertSame(counter, 0);
                    for (let i = 0; i < 3; i++)
                    {
                        await test.assertThrowsAsync(convertErrorResult, new Error("abc - def"));
                        test.assertSame(counter, 1);
                    }
                });

                runner.test("with error parent and throwing convertErrorFunction", async (test: Test) =>
                {
                    const parentResult: PromiseAsyncResult<number> = PromiseAsyncResult.error(new Error("abc"));
                    let counter: number = 0;
                    const convertErrorResult: PromiseAsyncResult<number> = parentResult.convertError((error: unknown) =>
                    {
                        counter++;
                        throw new Error(`${(error as Error).message} - def`);
                    });
                    test.assertSame(counter, 0);
                    for (let i = 0; i < 3; i++)
                    {
                        await test.assertThrowsAsync(convertErrorResult, new Error("abc - def"));
                        test.assertSame(counter, 1);
                    }
                });

                runner.test("with successful parent", async (test: Test) =>
                {
                    const parentResult: PromiseAsyncResult<number> = PromiseAsyncResult.value(5);
                    let counter: number = 0;
                    const convertErrorResult: PromiseAsyncResult<number> = parentResult.convertError(Error, (error: Error) =>
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
                    const parentResult: PromiseAsyncResult<number> = PromiseAsyncResult.error(new Error("abc"));
                    let counter: number = 0;
                    const convertErrorResult: PromiseAsyncResult<number> = parentResult.convertError(Error, (error: Error) =>
                    {
                        counter++;
                        return new Error(`${error.message} - def`);
                    });
                    test.assertSame(counter, 0);
                    for (let i = 0; i < 3; i++)
                    {
                        await test.assertThrowsAsync(convertErrorResult, new Error("abc - def"));
                        test.assertSame(counter, 1);
                    }
                });

                runner.test("with error parent, super error match, and non-throwing convertErrorFunction", async (test: Test) =>
                {
                    const parentResult: PromiseAsyncResult<number> = PromiseAsyncResult.error(new PreConditionError("abc"));
                    let counter: number = 0;
                    const convertErrorResult: PromiseAsyncResult<number> = parentResult.convertError(Error, (error: Error) =>
                    {
                        counter++;
                        return new Error(`${error.message} - def`);
                    });
                    test.assertSame(counter, 0);
                    for (let i = 0; i < 3; i++)
                    {
                        await test.assertThrowsAsync(convertErrorResult, new Error(`abc - def`));
                        test.assertSame(counter, 1);
                    }
                });

                runner.test("with error parent, no error match, and non-throwing convertErrorFunction", async (test: Test) =>
                {
                    const parentResult: PromiseAsyncResult<number> = PromiseAsyncResult.error(new PreConditionError("abc"));
                    let counter: number = 0;
                    const convertErrorResult: PromiseAsyncResult<number> = parentResult.convertError(TypeError, (error: TypeError) =>
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
                    const parentResult: PromiseAsyncResult<number> = PromiseAsyncResult.error(new Error("abc"));
                    let counter: number = 0;
                    const convertErrorResult: PromiseAsyncResult<number> = parentResult.convertError(Error, (error: Error) =>
                    {
                        counter++;
                        throw new Error(`${error.message} - def`);
                    });
                    test.assertSame(counter, 0);
                    for (let i = 0; i < 3; i++)
                    {
                        await test.assertThrowsAsync(convertErrorResult, new Error("abc - def"));
                        test.assertSame(counter, 1);
                    }
                });

                runner.test("with error parent, super error match, and throwing convertErrorFunction", async (test: Test) =>
                {
                    const parentResult: PromiseAsyncResult<number> = PromiseAsyncResult.error(new TypeError("abc"));
                    let counter: number = 0;
                    const convertErrorResult: PromiseAsyncResult<number> = parentResult.convertError(Error, (error: Error) =>
                    {
                        counter++;
                        throw new Error(`${error.message} - def`);
                    });
                    test.assertSame(counter, 0);
                    for (let i = 0; i < 3; i++)
                    {
                        await test.assertThrowsAsync(convertErrorResult, new Error("abc - def"));
                        test.assertSame(counter, 1);
                    }
                });

                runner.test("with error parent, no error match, and throwing convertErrorFunction", async (test: Test) =>
                {
                    const parentResult: PromiseAsyncResult<number> = PromiseAsyncResult.error(new TypeError("abc"));
                    let counter: number = 0;
                    const convertErrorResult: PromiseAsyncResult<number> = parentResult.convertError(PreConditionError, () =>
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

            runner.testFunction("finally()", () =>
            {
                runner.test("with successful parent and non-throwing onfinally function", async (test: Test) =>
                {
                    const parentResult: PromiseAsyncResult<number> = PromiseAsyncResult.value(5);
                    let counter: number = 0;
                    const finallyResult: PromiseAsyncResult<number> = parentResult.finally(() => { counter++; });
                    test.assertSame(counter, 0);
                    for (let i = 0; i < 3; i++)
                    {
                        test.assertSame(await finallyResult, 5);
                        test.assertSame(counter, 1);
                    }
                });

                runner.test("with successful parent and throwing onfinally function", async (test: Test) =>
                {
                    const parentResult: PromiseAsyncResult<number> = PromiseAsyncResult.value(5);
                    let counter: number = 0;
                    const finallyResult: PromiseAsyncResult<number> = parentResult.finally(() =>
                    {
                        counter++;
                        throw new RangeError("oops!");
                    });
                    test.assertSame(counter, 0);
                    for (let i = 0; i < 3; i++)
                    {
                        await test.assertThrowsAsync(finallyResult, new RangeError("oops!"));
                        test.assertSame(counter, 1);
                    }
                });

                runner.test("with error parent and non-throwing onfinally function", async (test: Test) =>
                {
                    const parentResult: PromiseAsyncResult<number> = PromiseAsyncResult.error(new Error("abc"));
                    let counter: number = 0;
                    const finallyResult: PromiseAsyncResult<number> = parentResult.finally(() => { counter++; });
                    test.assertSame(counter, 0);
                    for (let i = 0; i < 3; i++)
                    {
                        await test.assertThrowsAsync(finallyResult, new Error("abc"));
                        test.assertSame(counter, 1);
                    }
                });

                runner.test("with error parent and throwing onfinally function", async (test: Test) =>
                {
                    const parentResult: PromiseAsyncResult<number> = PromiseAsyncResult.error(new Error("abc"));
                    let counter: number = 0;
                    const convertErrorResult: PromiseAsyncResult<number> = parentResult.finally(() =>
                    {
                        counter++;
                        throw new RangeError("def");
                    });
                    test.assertSame(counter, 0);
                    for (let i = 0; i < 3; i++)
                    {
                        await test.assertThrowsAsync(convertErrorResult, new RangeError("def"));
                        test.assertSame(counter, 1);
                    }
                });
            });
        });
    });
}