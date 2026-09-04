import { EmptyError } from "../sources/emptyError.js";
import { Iterator } from "../sources/iterator.js";
import
{
    JavascriptIterable, JavascriptIterator, JavascriptIteratorResult
} from "../sources/javascript.js";
import { NotFoundError } from "../sources/notFoundError.js";
import { PreConditionError } from "../sources/preConditionError.js";
import { Test } from "./test.js";
import { TestRunner } from "./testRunner.js";

export function test(runner: TestRunner): void
{
    runner.testFile("iterator.ts", () =>
    {
        runner.testType("Iterator<T>", () =>
        {
            runner.testFunction("create(T[])", () =>
            {
                function createErrorTest<T>(values: T[], expected: Error): void
                {
                    runner.test(`with ${runner.toString(values)}`, (test: Test) =>
                    {
                        test.assertThrows(() => Iterator.create(values), expected);
                    });
                }

                createErrorTest(undefined!, new PreConditionError(
                    "Expression: values",
                    "Expected:   not undefined and not null",
                    "Actual:     undefined",
                ));
                createErrorTest(null!, new PreConditionError(
                    "Expression: values",
                    "Expected:   not undefined and not null",
                    "Actual:     null",
                ));

                function createTest<T>(values: T[]): void
                {
                    runner.test(`with ${runner.toString(values)}`, (test: Test) =>
                    {
                        const iterator: Iterator<T> = Iterator.create(values);
                        test.assertEqual(iterator.toArray().await(), values);
                    });
                }

                createTest([]);
                createTest([1, 2, 3]);
                createTest([false, true]);
            });

            runner.testFunction("next()", () =>
            {
                runner.testGroup("not empty", () =>
                {
                    runner.test("not started", (test: Test) =>
                    {
                        const values: number[] = [1, 2, 3];
                        const iterator: Iterator<number> = Iterator.create(values);
                        test.assertFalse(iterator.hasStarted());
                        test.assertFalse(iterator.hasCurrent());

                        for (const value of values)
                        {
                            test.assertTrue(iterator.next().await());
                            test.assertTrue(iterator.hasCurrent());
                            test.assertTrue(iterator.hasStarted());
                            test.assertEqual(value, iterator.getCurrent());
                        }

                        for (let i = 0; i < 2; i++)
                        {
                            test.assertFalse(iterator.next().await());
                            test.assertFalse(iterator.hasCurrent());
                            test.assertTrue(iterator.hasStarted());
                            test.assertThrows(
                                () => iterator.getCurrent(),
                                new PreConditionError(
                                    "Expression: this.hasCurrent()",
                                    "Expected:   true",
                                    "Actual:     false",
                                ),
                            );
                        }
                    });

                    runner.test("started", (test: Test) =>
                    {
                        const values: number[] = [1, 2, 3];
                        const iterator: Iterator<number> = Iterator.create(values).start().await();
                        test.assertTrue(iterator.hasStarted());
                        test.assertTrue(iterator.hasCurrent());
                        test.assertEqual(1, iterator.getCurrent());

                        for (const value of values.slice(1))
                        {
                            test.assertTrue(iterator.next().await());
                            test.assertTrue(iterator.hasCurrent());
                            test.assertTrue(iterator.hasStarted());
                            test.assertEqual(value, iterator.getCurrent());
                        }

                        for (let i = 0; i < 2; i++)
                        {
                            test.assertFalse(iterator.next().await());
                            test.assertFalse(iterator.hasCurrent());
                            test.assertTrue(iterator.hasStarted());
                            test.assertThrows(
                                () => iterator.getCurrent(),
                                new PreConditionError(
                                    "Expression: this.hasCurrent()",
                                    "Expected:   true",
                                    "Actual:     false",
                                ),
                            );
                        }
                    });
                });
            });

            runner.testFunction("start()", (test: Test) =>
            {
                const iterator: Iterator<number> = Iterator.create([1, 2, 3]);
                for (let i: number = 0; i < 2; i++)
                {
                    const startResult: Iterator<number> = iterator.start().await();
                    test.assertSame(startResult, iterator);
                    test.assertTrue(iterator.hasStarted());
                    test.assertTrue(iterator.hasCurrent());
                    test.assertEqual(1, iterator.getCurrent());
                }
            });

            runner.testFunction("takeCurrent()", () =>
            {
                runner.testGroup("with non-empty", () =>
                {
                    runner.test("not started", (test: Test) =>
                    {
                        const iterator: Iterator<number> = Iterator.create([1, 2, 3]);
                        test.assertFalse(iterator.hasStarted());
                        test.assertFalse(iterator.hasCurrent());

                        for (let i = 0; i < 2; i++)
                        {
                            test.assertThrows(() => iterator.takeCurrent(),
                                new PreConditionError(
                                    "Expression: iterator.hasCurrent()",
                                    "Expected:   true",
                                    "Actual:     false",
                                ));
                            test.assertFalse(iterator.hasStarted());
                            test.assertFalse(iterator.hasCurrent());
                        }
                    });

                    runner.test("started", (test: Test) =>
                    {
                        const values: number[] = [1, 2, 3];
                        const iterator: Iterator<number> = Iterator.create(values).start().await();
                        test.assertTrue(iterator.hasStarted());
                        test.assertTrue(iterator.hasCurrent());
                        test.assertEqual(1, iterator.getCurrent());

                        for (let i = 0; i < values.length - 1; i++)
                        {
                            test.assertEqual(values[i], iterator.takeCurrent().await());
                            test.assertTrue(iterator.hasStarted());
                            test.assertTrue(iterator.hasCurrent());
                            test.assertEqual(values[i + 1], iterator.getCurrent());
                        }

                        test.assertEqual(values[values.length - 1], iterator.takeCurrent().await());
                        test.assertTrue(iterator.hasStarted());
                        test.assertFalse(iterator.hasCurrent());
                    });
                });
            });

            runner.testFunction("any()", () =>
            {
                runner.testGroup("with non-empty", () =>
                {
                    runner.test("not started", (test: Test) =>
                    {
                        const values: number[] = [1, 2, 3];
                        const iterator: Iterator<number> = Iterator.create(values);
                        test.assertFalse(iterator.hasStarted());
                        test.assertFalse(iterator.hasCurrent());

                        for (let i = 0; i < 2; i++)
                        {
                            test.assertTrue(iterator.any().await());
                            test.assertTrue(iterator.hasStarted());
                            test.assertTrue(iterator.hasCurrent());
                            test.assertEqual(values[0], iterator.getCurrent());
                        }
                    });

                    runner.test("started", (test: Test) =>
                    {
                        const values: number[] = [1, 2, 3];
                        const iterator: Iterator<number> = Iterator.create(values).start().await();
                        test.assertTrue(iterator.hasStarted());
                        test.assertTrue(iterator.hasCurrent());
                        test.assertEqual(values[0], iterator.getCurrent());

                        for (let i = 0; i < 2; i++)
                        {
                            test.assertTrue(iterator.any().await());
                            test.assertTrue(iterator.hasStarted());
                            test.assertTrue(iterator.hasCurrent());
                            test.assertEqual(values[0], iterator.getCurrent());
                        }
                    });
                });
            });

            runner.testFunction("getCount()", () =>
            {
                runner.testGroup("with non-empty", () =>
                {
                    runner.test("not started", (test: Test) =>
                    {
                        const values: number[] = [1, 2, 3];
                        const iterator: Iterator<number> = Iterator.create(values);
                        test.assertFalse(iterator.hasStarted());
                        test.assertFalse(iterator.hasCurrent());

                        test.assertEqual(values.length, iterator.getCount().await());
                        test.assertTrue(iterator.hasStarted());
                        test.assertFalse(iterator.hasCurrent());

                        for (let i = 0; i < 2; i++)
                        {
                            test.assertEqual(iterator.getCount().await(), 0);
                            test.assertTrue(iterator.hasStarted());
                            test.assertFalse(iterator.hasCurrent());
                        }
                    });

                    runner.test("started", (test: Test) =>
                    {
                        const values: number[] = [1, 2, 3];
                        const iterator: Iterator<number> = Iterator.create(values).start().await();
                        test.assertTrue(iterator.hasStarted());
                        test.assertTrue(iterator.hasCurrent());
                        test.assertEqual(values[0], iterator.getCurrent());

                        test.assertEqual(values.length, iterator.getCount().await());
                        test.assertTrue(iterator.hasStarted());
                        test.assertFalse(iterator.hasCurrent());

                        for (let i = 0; i < 2; i++)
                        {
                            test.assertEqual(iterator.getCount().await(), 0);
                            test.assertTrue(iterator.hasStarted());
                            test.assertFalse(iterator.hasCurrent());
                        }
                    });
                });
            });

            runner.testFunction("toArray()", () =>
            {
                runner.testGroup("not empty", () =>
                {
                    runner.test("not started", (test: Test) =>
                    {
                        const values: number[] = [1, 2, 3];
                        const iterator: Iterator<number> = Iterator.create(values);

                        test.assertEqual(values, iterator.toArray().await());
                        test.assertTrue(iterator.hasStarted());
                        test.assertFalse(iterator.hasCurrent());

                        test.assertEqual([], iterator.toArray().await());
                        test.assertTrue(iterator.hasStarted());
                        test.assertFalse(iterator.hasCurrent());
                    });

                    runner.test("started", (test: Test) =>
                    {
                        const values: number[] = [1, 2, 3];
                        const iterator: Iterator<number> = Iterator.create(values).start().await();

                        test.assertEqual(values, iterator.toArray().await());
                        test.assertTrue(iterator.hasStarted());
                        test.assertFalse(iterator.hasCurrent());

                        test.assertEqual([], iterator.toArray().await());
                        test.assertTrue(iterator.hasStarted());
                        test.assertFalse(iterator.hasCurrent());
                    });
                });
            });

            runner.testGroup("concatenate()", () =>
            {
                runner.testGroup("with non-started", () =>
                {
                    runner.testGroup("empty and", () =>
                    {
                        runner.test("empty", (test: Test) =>
                        {
                            const iterator: Iterator<number> = Iterator.create([]);
                            const concatenateIterator: Iterator<number> = iterator.concatenate([]);
                            test.assertEqual(concatenateIterator.toArray().await(), []);
                        });

                        runner.test("non-empty", (test: Test) =>
                        {
                            const iterator: Iterator<number> = Iterator.create([]);
                            const concatenateIterator: Iterator<number> = iterator.concatenate([5]);
                            test.assertEqual(concatenateIterator.toArray().await(), [5]);
                        });

                        runner.test("two non-emptys", (test: Test) =>
                        {
                            const iterator: Iterator<number> = Iterator.create([]);
                            const concatenateIterator: Iterator<number> = iterator.concatenate([5], [6, 7]);
                            test.assertEqual(concatenateIterator.toArray().await(), [5, 6, 7]);
                        });
                    });

                    runner.testGroup("non-empty and", () =>
                    {
                        runner.test("empty", (test: Test) =>
                        {
                            const iterator: Iterator<number> = Iterator.create([1, 2]);
                            const concatenateIterator: Iterator<number> = iterator.concatenate([]);
                            test.assertEqual(concatenateIterator.toArray().await(), [1, 2]);
                        });

                        runner.test("non-empty", (test: Test) =>
                        {
                            const iterator: Iterator<number> = Iterator.create([3]);
                            const concatenateIterator: Iterator<number> = iterator.concatenate([4, 5, 6]);
                            test.assertEqual(concatenateIterator.toArray().await(), [3, 4, 5, 6]);
                        });

                        runner.test("two non-emptys", (test: Test) =>
                        {
                            const iterator: Iterator<number> = Iterator.create([7, 8, 9]);
                            const concatenateIterator: Iterator<number> = iterator.concatenate([10, 11, 12], [13]);
                            test.assertEqual(concatenateIterator.toArray().await(), [7, 8, 9, 10, 11, 12, 13]);
                        });
                    });
                });

                runner.testGroup("with started", () =>
                {
                    runner.testGroup("empty and", () =>
                    {
                        runner.test("empty", (test: Test) =>
                        {
                            const iterator: Iterator<number> = Iterator.create([]).start().await();
                            const concatenateIterator: Iterator<number> = iterator.concatenate([]);
                            test.assertEqual(concatenateIterator.toArray().await(), []);
                        });

                        runner.test("non-empty", (test: Test) =>
                        {
                            const iterator: Iterator<number> = Iterator.create([]).start().await();
                            const concatenateIterator: Iterator<number> = iterator.concatenate([5]);
                            test.assertEqual(concatenateIterator.toArray().await(), [5]);
                        });

                        runner.test("two non-emptys", (test: Test) =>
                        {
                            const iterator: Iterator<number> = Iterator.create([]).start().await();
                            const concatenateIterator: Iterator<number> = iterator.concatenate([5], [6, 7]);
                            test.assertEqual(concatenateIterator.toArray().await(), [5, 6, 7]);
                        });
                    });

                    runner.testGroup("non-empty and", () =>
                    {
                        runner.test("empty", (test: Test) =>
                        {
                            const iterator: Iterator<number> = Iterator.create([1, 2]).start().await();
                            const concatenateIterator: Iterator<number> = iterator.concatenate([]);
                            test.assertEqual(concatenateIterator.toArray().await(), [1, 2]);
                        });

                        runner.test("non-empty", (test: Test) =>
                        {
                            const iterator: Iterator<number> = Iterator.create([3]).start().await();
                            const concatenateIterator: Iterator<number> = iterator.concatenate([4, 5, 6]);
                            test.assertEqual(concatenateIterator.toArray().await(), [3, 4, 5, 6]);
                        });

                        runner.test("two non-emptys", (test: Test) =>
                        {
                            const iterator: Iterator<number> = Iterator.create([7, 8, 9]).start().await();
                            const concatenateIterator: Iterator<number> = iterator.concatenate([10, 11, 12], [13]);
                            test.assertEqual(concatenateIterator.toArray().await(), [7, 8, 9, 10, 11, 12, 13]);
                        });
                    });
                });
            });

            runner.testFunction("where()", () =>
            {
                runner.testGroup("with non-empty", () =>
                {
                    runner.test("not started", (test: Test) =>
                    {
                        const values: number[] = [1, 2, 3, 4, 5];
                        const iterator: Iterator<number> = Iterator.create(values);
                        const result: Iterator<number> = iterator.where(x => x % 2 === 1);
                        test.assertNotUndefinedAndNotNull(result);
                        test.assertNotSame(result, iterator);
                        test.assertFalse(iterator.hasStarted());
                        test.assertFalse(iterator.hasCurrent());
                        test.assertFalse(result.hasStarted());
                        test.assertFalse(result.hasCurrent());

                        for (const expectedValue of [1, 3, 5])
                        {
                            test.assertTrue(result.next().await());
                            test.assertTrue(result.hasStarted());
                            test.assertTrue(result.hasCurrent());
                            test.assertEqual(expectedValue, result.getCurrent());
                            test.assertTrue(iterator.hasStarted());
                            test.assertTrue(iterator.hasCurrent());
                            test.assertEqual(expectedValue, iterator.getCurrent());
                        }

                        for (let i = 0; i < 2; i++)
                        {
                            test.assertFalse(result.next().await());
                            test.assertTrue(result.hasStarted());
                            test.assertFalse(result.hasCurrent());
                            test.assertTrue(iterator.hasStarted());
                            test.assertFalse(iterator.hasCurrent());
                        }
                    });

                    runner.test("started", (test: Test) =>
                    {
                        const values: number[] = [1, 2, 3, 4, 5];
                        const iterator: Iterator<number> = Iterator.create(values).start().await();
                        const result: Iterator<number> = iterator.where(x => x % 2 === 1);
                        test.assertNotUndefinedAndNotNull(result);
                        test.assertNotSame(result, iterator);
                        test.assertTrue(iterator.hasStarted());
                        test.assertTrue(iterator.hasCurrent());
                        test.assertEqual(values[0], iterator.getCurrent())
                        test.assertFalse(result.hasStarted());
                        test.assertFalse(result.hasCurrent());

                        for (const expectedValue of [1, 3, 5])
                        {
                            test.assertTrue(result.next().await());
                            test.assertTrue(result.hasStarted());
                            test.assertTrue(result.hasCurrent());
                            test.assertEqual(expectedValue, result.getCurrent());
                            test.assertTrue(iterator.hasStarted());
                            test.assertTrue(iterator.hasCurrent());
                            test.assertEqual(expectedValue, iterator.getCurrent());
                        }

                        for (let i = 0; i < 2; i++)
                        {
                            test.assertFalse(result.next().await());
                            test.assertTrue(result.hasStarted());
                            test.assertFalse(result.hasCurrent());
                            test.assertTrue(iterator.hasStarted());
                            test.assertFalse(iterator.hasCurrent());
                        }
                    });
                });
            });

            runner.testFunction("map()", () =>
            {
                runner.testGroup("with non-empty", () =>
                {
                    runner.test("not started", (test: Test) =>
                    {
                        const values: number[] = [1, 2, 3];
                        const iterator: Iterator<number> = Iterator.create(values);
                        const result: Iterator<number> = iterator.map(x => x + 10);
                        test.assertFalse(iterator.hasStarted());
                        test.assertFalse(iterator.hasCurrent());
                        test.assertFalse(result.hasStarted());
                        test.assertFalse(result.hasCurrent());

                        for (const value of values)
                        {
                            test.assertTrue(result.next().await());
                            test.assertTrue(result.hasStarted());
                            test.assertTrue(result.hasCurrent());
                            test.assertEqual(value + 10, result.getCurrent());
                            test.assertTrue(iterator.hasStarted());
                            test.assertTrue(iterator.hasCurrent());
                            test.assertEqual(value, iterator.getCurrent());
                        }

                        for (let i = 0; i < 2; i++)
                        {
                            test.assertFalse(result.next().await());
                            test.assertTrue(result.hasStarted());
                            test.assertFalse(result.hasCurrent());
                            test.assertTrue(iterator.hasStarted());
                            test.assertFalse(iterator.hasCurrent());
                        }
                    });

                    runner.test("started", (test: Test) =>
                    {
                        const values: number[] = [1, 2, 3];
                        const iterator: Iterator<number> = Iterator.create(values).start().await();
                        const result: Iterator<number> = iterator.map(x => x + 10);
                        test.assertTrue(iterator.hasStarted());
                        test.assertTrue(iterator.hasCurrent());
                        test.assertEqual(values[0], iterator.getCurrent());
                        test.assertFalse(result.hasStarted());
                        test.assertFalse(result.hasCurrent());

                        for (const value of values)
                        {
                            test.assertTrue(result.next().await());
                            test.assertTrue(result.hasStarted());
                            test.assertTrue(result.hasCurrent());
                            test.assertEqual(value + 10, result.getCurrent());
                            test.assertTrue(iterator.hasStarted());
                            test.assertTrue(iterator.hasCurrent());
                            test.assertEqual(value, iterator.getCurrent());
                        }

                        for (let i = 0; i < 2; i++)
                        {
                            test.assertFalse(result.next().await());
                            test.assertTrue(result.hasStarted());
                            test.assertFalse(result.hasCurrent());
                            test.assertTrue(iterator.hasStarted());
                            test.assertFalse(iterator.hasCurrent());
                        }
                    });
                });
            });

            runner.testFunction("flatMap()", () =>
            {
                runner.test("with empty non-started iterator", (test: Test) =>
                {
                    const iterator: Iterator<number> = Iterator.create([]);
                    const flatMapIterator: Iterator<string> = iterator.flatMap((value: number) =>
                    {
                        const result: string[] = [];
                        for (let i = 0; i < value; i++)
                        {
                            result.push(value.toString());
                        }
                        return result;
                    });
                    test.assertEqual(flatMapIterator.toArray().await(), []);
                });

                runner.test("with empty started iterator", (test: Test) =>
                {
                    const iterator: Iterator<number> = Iterator.create([]).start().await();
                    const flatMapIterator: Iterator<string> = iterator.flatMap((value: number) =>
                    {
                        const result: string[] = [];
                        for (let i = 0; i < value; i++)
                        {
                            result.push(value.toString());
                        }
                        return result;
                    });
                    test.assertEqual(flatMapIterator.toArray().await(), []);
                });

                runner.test("with non-empty non-started iterator", (test: Test) =>
                {
                    const iterator: Iterator<number> = Iterator.create([1, 2, 3]);
                    const flatMapIterator: Iterator<string> = iterator.flatMap((value: number) =>
                    {
                        const result: string[] = [];
                        for (let i = 0; i < value; i++)
                        {
                            result.push(value.toString());
                        }
                        return result;
                    });
                    test.assertEqual(flatMapIterator.toArray().await(), ["1", "2", "2", "3", "3", "3"]);
                });

                runner.test("with non-empty started iterator", (test: Test) =>
                {
                    const iterator: Iterator<number> = Iterator.create([1, 2, 3]).start().await();
                    const flatMapIterator: Iterator<string> = iterator.flatMap((value: number) =>
                    {
                        const result: string[] = [];
                        for (let i = 0; i < value; i++)
                        {
                            result.push(value.toString());
                        }
                        return result;
                    });
                    test.assertEqual(flatMapIterator.toArray().await(), ["1", "2", "2", "3", "3", "3"]);
                });

                runner.test("with mapping that sometimes returns an empty iterable", (test: Test) =>
                {
                    const iterator: Iterator<number> = Iterator.create([1, 2, 3, 4]).start().await();
                    const flatMapIterator: Iterator<string> = iterator.flatMap((value: number) =>
                    {
                        const result: string[] = [];
                        if (value % 2 === 1)
                        {
                            for (let i = 0; i < value; i++)
                            {
                                result.push(value.toString());
                            }
                        }
                        return result;
                    });
                    test.assertEqual(flatMapIterator.toArray().await(), ["1", "3", "3", "3"]);
                });
            });

            runner.testFunction("first()", () =>
            {
                runner.testGroup("with no condition", () =>
                {
                    function firstErrorTest(iterable: JavascriptIterable<string>, expected: Error): void
                    {
                        runner.test(`with ${runner.toString(iterable)}`, (test: Test) =>
                        {
                            const iterator: Iterator<string> = Iterator.create(iterable);
                            for (let i = 0; i < 3; i++)
                            {
                                test.assertThrows(() => { iterator.first().await(); }, expected);
                            }
                        });
                    }

                    firstErrorTest(
                        [],
                        new EmptyError(),
                    );

                    function firstTest<T>(iterable: JavascriptIterable<T>, expected: T): void
                    {
                        runner.test(`with ${runner.toString(iterable)}`, (test: Test) =>
                        {
                            const iterator: Iterator<T> = Iterator.create(iterable);
                            for (let i = 0; i < 3; i++)
                            {
                                test.assertEqual(iterator.first().await(), expected);
                            }
                        });
                    }

                    firstTest([1], 1);
                    firstTest([2, 3], 2);
                    firstTest([4, 5, 6, 7, 8], 4);
                });

                runner.testGroup("with condition argument", () =>
                {
                    function firstErrorTest<T>(iterable: JavascriptIterable<T>, condition: (value: T) => boolean, expected: Error): void
                    {
                        runner.test(`with ${runner.toString(iterable)} and ${condition?.name} condition`, (test: Test) =>
                        {
                            const iterator: Iterator<T> = Iterator.create(iterable);
                            for (let i = 0; i < 3; i++)
                            {
                                test.assertThrows(() =>
                                {
                                    iterator.first(condition).await();
                                }, expected);
                            }
                        });
                    }

                    function isOdd(value: number): boolean
                    {
                        return value % 2 === 1;
                    }

                    function isEven(value: number): boolean
                    {
                        return value % 2 === 0;
                    }

                    firstErrorTest(
                        [],
                        undefined!,
                        new EmptyError(),
                    );
                    firstErrorTest(
                        [],
                        null!,
                        new EmptyError(),
                    );
                    firstErrorTest(
                        [1],
                        isEven,
                        new NotFoundError("No value was found in the Iterator that matched the provided condition."),
                    );
                    firstErrorTest(
                        [2, 4],
                        isOdd,
                        new NotFoundError("No value was found in the Iterator that matched the provided condition."),
                    );

                    function firstTest<T>(iterable: JavascriptIterable<T>, condition: (value: T) => boolean, expected: T): void
                    {
                        runner.test(`with ${runner.toString(iterable)} and ${condition?.name} condition`, (test: Test) =>
                        {
                            const iterator: Iterator<T> = Iterator.create(iterable);
                            for (let i = 0; i < 3; i++)
                            {
                                test.assertEqual(iterator.first(condition).await(), expected);
                            }
                        });
                    }

                    firstTest([1], isOdd, 1);
                    firstTest([2, 3], isEven, 2);
                    firstTest([2, 3], isOdd, 3);
                    firstTest([4, 6, 7, 8], isEven, 4);
                    firstTest([4, 6, 7, 8], isOdd, 7);
                });
            });

            runner.testFunction("skip(number)", () =>
            {
                function skipErrorTest(iterable: JavascriptIterable<string>, maximumToSkip: number, expected: Error): void
                {
                    runner.test(`with ${runner.andList([iterable, maximumToSkip])}`, (test: Test) =>
                    {
                        const iterator: Iterator<string> = Iterator.create(iterable);
                        test.assertThrows(() => iterator.skip(maximumToSkip), expected);
                    });
                }

                skipErrorTest([], undefined!, new PreConditionError(
                    "Expression: maximumToSkip",
                    "Expected:   not undefined and not null",
                    "Actual:     undefined",
                ));
                skipErrorTest([], null!, new PreConditionError(
                    "Expression: maximumToSkip",
                    "Expected:   not undefined and not null",
                    "Actual:     null",
                ));
                skipErrorTest([], 0.5, new PreConditionError(
                    "Expression: maximumToSkip",
                    "Expected:   integer",
                    "Actual:     0.5",
                ));
                skipErrorTest([], -1, new PreConditionError(
                    "Expression: maximumToSkip",
                    "Expected:   greater than or equal to 0",
                    "Actual:     -1",
                ));

                function skipTest(iterable: JavascriptIterable<string>, maximumToSkip: number, expected: JavascriptIterable<string>): void
                {
                    runner.test(`with ${runner.andList([iterable, maximumToSkip])}`, (test: Test) =>
                    {
                        const iterator: Iterator<string> = Iterator.create(iterable);
                        const skipIterator: Iterator<string> = iterator.skip(maximumToSkip);
                        test.assertEqual(expected, skipIterator.toArray().await());
                    });
                }

                skipTest([], 0, []);
                skipTest([], 1, []);
                skipTest([], 2, []);
                skipTest(["a", "b", "c"], 0, ["a", "b", "c"]);
                skipTest(["a", "b", "c"], 1, ["b", "c"]);
                skipTest(["a", "b", "c"], 2, ["c"]);
                skipTest(["a", "b", "c"], 3, []);
                skipTest(["a", "b", "c"], 4, []);
            });
        });
    });
}

export function iteratorTests<T>(runner: TestRunner, creator: () => Iterator<T>): void
{
    runner.testType("Iterator<T>", () =>
    {
        runner.testFunction("creator()", (test: Test) =>
        {
            const iterator: Iterator<T> = creator();
            test.assertNotUndefinedAndNotNull(iterator);
            test.assertFalse(iterator.hasStarted());
            test.assertFalse(iterator.hasCurrent());
            test.assertThrows(() => iterator.getCurrent(), new PreConditionError(
                "Expression: this.hasCurrent()",
                "Expected:   true",
                "Actual:     false",
            ));
        });

        runner.testFunction("start()", (test: Test) =>
        {
            const iterator: Iterator<T> = creator();
            for (let i: number = 0; i < 2; i++)
            {
                const startResult: Iterator<T> = iterator.start().await();
                test.assertSame(startResult, iterator);
                test.assertTrue(iterator.hasStarted());
                test.assertFalse(iterator.hasCurrent());
            }
        });

        runner.testFunction("takeCurrent()", () =>
        {
            runner.testGroup("with empty", () =>
            {
                runner.test("not started", (test: Test) =>
                {
                    const iterator: Iterator<T> = creator();
                    for (let i = 0; i < 2; i++)
                    {
                        test.assertThrows(() => iterator.takeCurrent(),
                            new PreConditionError(
                                "Expression: iterator.hasCurrent()",
                                "Expected:   true",
                                "Actual:     false",
                            ));
                        test.assertFalse(iterator.hasStarted());
                        test.assertFalse(iterator.hasCurrent());
                    }
                });

                runner.test("started", (test: Test) =>
                {
                    const iterator: Iterator<T> = creator().start().await();
                    test.assertTrue(iterator.hasStarted());
                    test.assertFalse(iterator.hasCurrent());

                    for (let i = 0; i < 2; i++)
                    {
                        test.assertThrows(() => iterator.takeCurrent(),
                            new PreConditionError(
                                "Expression: iterator.hasCurrent()",
                                "Expected:   true",
                                "Actual:     false",
                            ));
                        test.assertTrue(iterator.hasStarted());
                        test.assertFalse(iterator.hasCurrent());
                    }
                });
            });
        });

        runner.testFunction("next()", () =>
        {
            runner.testGroup("with empty", () =>
            {
                runner.test("not started", (test: Test) =>
                {
                    const iterator: Iterator<T> = creator();
                    test.assertFalse(iterator.hasStarted());
                    test.assertFalse(iterator.hasCurrent());

                    for (let i = 0; i < 2; i++)
                    {
                        test.assertFalse(iterator.next().await());
                        test.assertTrue(iterator.hasStarted());
                        test.assertFalse(iterator.hasCurrent());
                    }
                });

                runner.test("started", (test: Test) =>
                {
                    const iterator: Iterator<T> = creator().start().await();
                    test.assertTrue(iterator.hasStarted());
                    test.assertFalse(iterator.hasCurrent());

                    for (let i = 0; i < 2; i++)
                    {
                        test.assertFalse(iterator.next().await());
                        test.assertTrue(iterator.hasStarted());
                        test.assertFalse(iterator.hasCurrent());
                    }
                });
            });

        });

        runner.testFunction("[Symbol.iterator]()", (test: Test) =>
        {
            const iterator: Iterator<T> = creator();
            test.assertFalse(iterator.hasStarted());
            test.assertFalse(iterator.hasCurrent());

            const jsIterator: JavascriptIterator<T> = iterator[Symbol.iterator]();
            test.assertFalse(iterator.hasStarted());
            test.assertFalse(iterator.hasCurrent());

            for (let i = 0; i < 2; i++)
            {
                const result: JavascriptIteratorResult<T> = jsIterator.next();
                test.assertEqual(result.done, true);
                test.assertUndefined(result.value);
                test.assertTrue(iterator.hasStarted());
                test.assertFalse(iterator.hasCurrent());
            }
        });

        runner.testFunction("any()", (test: Test) =>
        {
            const iterator: Iterator<T> = creator();
            test.assertFalse(iterator.hasStarted());
            test.assertFalse(iterator.hasCurrent());

            test.assertFalse(iterator.any().await());

            test.assertTrue(iterator.hasStarted());
            test.assertFalse(iterator.hasCurrent());
        });

        runner.testFunction("getCount()", (test: Test) =>
        {
            const iterator: Iterator<T> = creator();
            test.assertFalse(iterator.hasStarted());
            test.assertFalse(iterator.hasCurrent());

            for (let i = 0; i < 2; i++)
            {
                test.assertEqual(iterator.getCount().await(), 0);
                test.assertTrue(iterator.hasStarted());
                test.assertFalse(iterator.hasCurrent());
            }
        });

        runner.testFunction("toArray()", (test: Test) =>
        {
            const iterator: Iterator<T> = creator();
            test.assertFalse(iterator.hasStarted());
            test.assertFalse(iterator.hasCurrent());

            for (let i = 0; i < 2; i++)
            {
                const array: T[] = iterator.toArray().await();
                test.assertEqual(array, []);
                test.assertTrue(iterator.hasStarted());
                test.assertFalse(iterator.hasCurrent());
            }
        });

        runner.testFunction("where()", () =>
        {
            runner.test("with undefined condition", (test: Test) =>
            {
                const iterator: Iterator<T> = creator();
                test.assertThrows(() => iterator.where(undefined!), new PreConditionError(
                    "Expression: condition",
                    "Expected:   not undefined and not null",
                    "Actual:     undefined",
                ));
                test.assertFalse(iterator.hasStarted());
                test.assertFalse(iterator.hasCurrent());
            });

            runner.test("with null condition", (test: Test) =>
            {
                const iterator: Iterator<T> = creator();
                test.assertThrows(() => iterator.where(null!), new PreConditionError(
                    "Expression: condition",
                    "Expected:   not undefined and not null",
                    "Actual:     null",
                ));
                test.assertFalse(iterator.hasStarted());
                test.assertFalse(iterator.hasCurrent());
            });

            runner.testGroup("with empty", () =>
            {
                runner.test("not started", (test: Test) =>
                {
                    const iterator: Iterator<T> = creator();

                    const result: Iterator<T> = iterator.where((value: T) => value !== undefined);
                    test.assertNotUndefinedAndNotNull(result);
                    test.assertNotSame(result, iterator);
                    test.assertFalse(result.hasStarted());
                    test.assertFalse(result.hasCurrent());
                    test.assertFalse(iterator.hasStarted());
                    test.assertFalse(iterator.hasCurrent());

                    test.assertFalse(result.next().await());
                    test.assertTrue(result.hasStarted());
                    test.assertFalse(result.hasCurrent());
                    test.assertTrue(iterator.hasStarted());
                    test.assertFalse(iterator.hasCurrent());
                });

                runner.test("started", (test: Test) =>
                {
                    const iterator: Iterator<T> = creator().start().await();
                    test.assertTrue(iterator.hasStarted());
                    test.assertFalse(iterator.hasCurrent());

                    const result: Iterator<T> = iterator.where((value: T) => value !== undefined);
                    test.assertNotUndefinedAndNotNull(result);
                    test.assertNotSame(result, iterator);
                    test.assertFalse(result.hasStarted());
                    test.assertFalse(result.hasCurrent());
                    test.assertTrue(iterator.hasStarted());
                    test.assertFalse(iterator.hasCurrent());

                    test.assertFalse(result.next().await());
                    test.assertTrue(result.hasStarted());
                    test.assertFalse(result.hasCurrent());
                    test.assertTrue(iterator.hasStarted());
                    test.assertFalse(iterator.hasCurrent());
                });
            });
        });

        runner.testFunction("map()", () =>
        {
            runner.test("with undefined", (test: Test) =>
            {
                const iterator: Iterator<T> = creator();
                test.assertThrows(() => iterator.map(undefined!), new PreConditionError(
                    "Expression: mapping",
                    "Expected:   not undefined and not null",
                    "Actual:     undefined",
                ));
                test.assertFalse(iterator.hasStarted());
                test.assertFalse(iterator.hasCurrent());
            });

            runner.test("with null", (test: Test) =>
            {
                const iterator: Iterator<T> = creator();
                test.assertThrows(() => iterator.map(null!), new PreConditionError(
                    "Expression: mapping",
                    "Expected:   not undefined and not null",
                    "Actual:     null",
                ));
                test.assertFalse(iterator.hasStarted());
                test.assertFalse(iterator.hasCurrent());
            });

            runner.testGroup("with empty", () =>
            {
                runner.test("not started", (test: Test) =>
                {
                    const iterator: Iterator<T> = creator();
                    test.assertFalse(iterator.hasStarted());
                    test.assertFalse(iterator.hasCurrent());

                    const mapIterator: Iterator<number> = iterator.map(_value => 5);
                    test.assertFalse(mapIterator.hasStarted());
                    test.assertFalse(mapIterator.hasCurrent());
                    test.assertFalse(iterator.hasStarted());
                    test.assertFalse(iterator.hasCurrent());
                });

                runner.test("started", (test: Test) =>
                {
                    const iterator: Iterator<T> = creator().start().await();
                    test.assertTrue(iterator.hasStarted());
                    test.assertFalse(iterator.hasCurrent());

                    const mapIterator: Iterator<number> = iterator.map(_value => 5);
                    test.assertFalse(mapIterator.hasStarted());
                    test.assertFalse(mapIterator.hasCurrent());
                    test.assertTrue(iterator.hasStarted());
                    test.assertFalse(iterator.hasCurrent());

                    test.assertFalse(mapIterator.next().await());
                    test.assertTrue(mapIterator.hasStarted());
                    test.assertFalse(mapIterator.hasCurrent());
                    test.assertTrue(iterator.hasStarted());
                    test.assertFalse(iterator.hasCurrent());
                });
            });
        });
    });
}