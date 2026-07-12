import { Iterable } from "../sources/iterable.js";
import { Test } from "./test.js";
import { Iterator} from "../sources/iterator.js";
import { TestRunner } from "./testRunner.js";
import { EmptyError, JavascriptIterable } from "../sources/index.js";

export function iterableTests<T>(runner: TestRunner, creator: () => Iterable<T>): void
{
    runner.testType("Iterable<T>", () =>
    {
        runner.testFunction("iterate()", (test: Test) =>
        {
            const iterable: Iterable<T> = creator();
            
            const iterator: Iterator<T> = iterable.iterate();
            test.assertNotUndefinedAndNotNull(iterator);
            test.assertFalse(iterator.hasStarted());
            test.assertFalse(iterator.hasCurrent());
        });

        runner.testFunction("toArray()", (test: Test) =>
        {
            const iterable: Iterable<T> = creator();

            const array: Array<T> = iterable.toArray().await();
            test.assertNotUndefinedAndNotNull(array);
            test.assertEqual(array.length, iterable.getCount().await());
        });

        runner.testFunction("any()", (test: Test) =>
        {
            const iterable: Iterable<T> = creator();
            test.assertEqual(iterable.any().await(), iterable.getCount().await() > 0);
        });

        runner.testFunction("getCount()", (test: Test) =>
        {
            const iterable: Iterable<T> = creator();
            test.assertEqual(0, iterable.getCount().await());
        });

        runner.testFunction("equals()", () =>
        {
            function equalsTest(left: Iterable<T>, right: JavascriptIterable<T>, expected: boolean): void
            {
                runner.test(`with ${runner.andList([left, right])}`, (test: Test) =>
                {
                    test.assertEqual(left.equals(right).await(), expected);
                });
            }

            equalsTest(creator(), undefined!, false);
            equalsTest(creator(), null!, false);
            equalsTest(creator(), [], true);
            equalsTest(creator(), creator(), true);
        });

        runner.testFunction("toString()", (test: Test) =>
        {
            const iterable: Iterable<T> = creator();
            const stringValue: string = iterable.toString();
            test.assertNotEmpty(stringValue);
        });

        runner.testFunction("first()", () =>
        {
            runner.test("when empty", (test: Test) =>
            {
                const iterable: Iterable<T> = creator();
                test.assertThrows(() => iterable.first().await(), new EmptyError());
            });
        });

        runner.testFunction("last()", () =>
        {
            runner.test("when empty", (test: Test) =>
            {
                const iterable: Iterable<T> = creator();
                test.assertThrows(() => iterable.last().await(), new EmptyError());
            });
        });
    });
}

export function test(runner: TestRunner): void
{
    runner.testFile("iterable.ts", () =>
    {
        runner.testType("Iterable<T>", () =>
        {
            runner.testFunction("create(JavascriptIterable<T>|undefined)", () =>
            {
                runner.test("with no arguments", async (test: Test) =>
                {
                    const iterable: Iterable<number> = Iterable.create();
                    test.assertNotUndefinedAndNotNull(iterable);
                    test.assertEqual(await iterable.toArray(), []);
                    test.assertEqual(await iterable.getCount(), 0);
                });

                runner.test("with empty array", async (test: Test) =>
                {
                    const iterable: Iterable<number> = Iterable.create<number>([]);
                    test.assertNotUndefinedAndNotNull(iterable);
                    test.assertEqual(await iterable.toArray(), []);
                    test.assertEqual(await iterable.getCount(), 0);
                });

                runner.test("with non-empty array", async (test: Test) =>
                {
                    const iterable: Iterable<number> = Iterable.create([1, 2, 3]);
                    test.assertNotUndefinedAndNotNull(iterable);
                    test.assertEqual(await iterable.toArray(), [1, 2, 3]);
                    test.assertEqual(await iterable.getCount(), 3);
                });
            });

            runner.testGroup("concatenate()", () =>
            {
                runner.testGroup("empty and", () =>
                {
                    runner.test("empty", (test: Test) =>
                    {
                        const iterable: Iterable<number> = Iterable.create([]);
                        const concatenateIterable: Iterable<number> = iterable.concatenate([]);
                        test.assertEqual(concatenateIterable.toArray().await(), []);
                    });

                    runner.test("non-empty", (test: Test) =>
                    {
                        const iterable: Iterable<number> = Iterable.create([]);
                        const concatenateIterable: Iterable<number> = iterable.concatenate([5]);
                        test.assertEqual(concatenateIterable.toArray().await(), [5]);
                    });

                    runner.test("two non-emptys", (test: Test) =>
                    {
                        const iterable: Iterable<number> = Iterable.create([]);
                        const concatenateIterable: Iterable<number> = iterable.concatenate([5], [6, 7]);
                        test.assertEqual(concatenateIterable.toArray().await(), [5, 6, 7]);
                    });
                });

                runner.testGroup("non-empty and", () =>
                {
                    runner.test("empty", (test: Test) =>
                    {
                        const iterable: Iterable<number> = Iterable.create([1, 2]);
                        const concatenateIterable: Iterable<number> = iterable.concatenate([]);
                        test.assertEqual(concatenateIterable.toArray().await(), [1, 2]);
                    });

                    runner.test("non-empty", (test: Test) =>
                    {
                        const iterable: Iterable<number> = Iterable.create([3]);
                        const concatenateIterable: Iterable<number> = iterable.concatenate([4, 5, 6]);
                        test.assertEqual(concatenateIterable.toArray().await(), [3, 4, 5, 6]);
                    });

                    runner.test("two non-emptys", (test: Test) =>
                    {
                        const iterable: Iterable<number> = Iterable.create([7, 8, 9]);
                        const concatenateIterable: Iterable<number> = iterable.concatenate([10, 11, 12], [13]);
                        test.assertEqual(concatenateIterable.toArray().await(), [7, 8, 9, 10, 11, 12, 13]);
                    });
                });
            });

            runner.testFunction("flatMap()", () =>
            {
                runner.test("with empty iterable", (test: Test) =>
                {
                    const iterable: Iterable<number> = Iterable.create([]);
                    const flatMapIterable: Iterable<string> = iterable.flatMap((value: number) =>
                    {
                        const result: string[] = [];
                        for (let i = 0; i < value; i++)
                        {
                            result.push(value.toString());
                        }
                        return result;
                    });
                    test.assertEqual(flatMapIterable.toArray().await(), []);
                });

                runner.test("with non-empty iterable", (test: Test) =>
                {
                    const iterable: Iterable<number> = Iterable.create([1, 2, 3]);
                    const flatMapIterable: Iterable<string> = iterable.flatMap((value: number) =>
                    {
                        const result: string[] = [];
                        for (let i = 0; i < value; i++)
                        {
                            result.push(value.toString());
                        }
                        return result;
                    });
                    test.assertEqual(flatMapIterable.toArray().await(), ["1", "2", "2", "3", "3", "3"]);
                });

                runner.test("with mapping that sometimes returns an empty iterable", (test: Test) =>
                {
                    const iterable: Iterable<number> = Iterable.create([1, 2, 3, 4]);
                    const flatMapIterable: Iterable<string> = iterable.flatMap((value: number) =>
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
                    test.assertEqual(flatMapIterable.toArray().await(), ["1", "3", "3", "3"]);
                });
            });
        });
    });
}