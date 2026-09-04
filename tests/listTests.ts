import { JavascriptIterable } from "../sources/javascript.js";
import { List } from "../sources/list.js";
import { PreConditionError } from "../sources/preConditionError.js";
import { isIterable } from "../sources/types.js";
import { mutableIndexableTests } from "./MutableIndexableTests.js";
import { Test } from "./test.js";
import { TestRunner } from "./testRunner.js";

export function test(runner: TestRunner): void
{
    runner.testFile("list.ts", () =>
    {
        runner.testType("List<T>", () =>
        {
            mutableIndexableTests(runner, List.create);

            runner.testFunction("create()", () =>
            {
                runner.test("with no arguments", (test: Test) =>
                {
                    const list: List<number> = List.create();
                    test.assertNotUndefinedAndNotNull(list);
                    test.assertEqual(list.toArray().await(), []);
                    test.assertEqual(list.toString(), "[]");
                    test.assertEqual(list.getCount().await(), 0);
                });

                runner.test("with undefined", (test: Test) =>
                {
                    const list: List<number> = List.create(undefined);
                    test.assertNotUndefinedAndNotNull(list);
                    test.assertEqual(list.toArray().await(), []);
                    test.assertEqual(list.toString(), "[]");
                    test.assertEqual(list.getCount().await(), 0);
                });

                runner.test("with empty array", (test: Test) =>
                {
                    const list: List<number> = List.create<number>([]);
                    test.assertNotUndefinedAndNotNull(list);
                    test.assertEqual(list.toArray().await(), []);
                    test.assertSame(list.toString(), "[]");
                    test.assertSame(list.getCount().await(), 0);
                });

                runner.test("with non-empty array", (test: Test) =>
                {
                    const list: List<number> = List.create([1, 2, 3]);
                    test.assertNotUndefinedAndNotNull(list);
                    test.assertEqual(list.toArray().await(), [1, 2, 3]);
                    test.assertSame(list.toString(), "[1,2,3]");
                    test.assertSame(list.getCount().await(), 3);
                });

                runner.test("with empty Iterable<T>", (test: Test) =>
                {
                    const list: List<number> = List.create(List.create());
                    test.assertNotUndefinedAndNotNull(list);
                    test.assertEqual(list.toArray().await(), []);
                    test.assertSame(list.toString(), "[]");
                    test.assertSame(list.getCount().await(), 0);
                });

                runner.test("with non-empty Iterable<T>", (test: Test) =>
                {
                    const list: List<number> = List.create(List.create([1, 2, 3]));
                    test.assertNotUndefinedAndNotNull(list);
                    test.assertEqual(list.toArray().await(), [1, 2, 3]);
                    test.assertTrue(isIterable(list));
                    test.assertSame(list.toString(), "[1,2,3]");
                    test.assertSame(list.getCount().await(), 3);
                });
            });

            runner.testFunction("set(number,T)", () =>
            {
                function setErrorTest(list: List<number>, index: number, value: number, expectedError: Error): void
                {
                    runner.test(`with ${runner.andList([list, index, value])}`, (test: Test) =>
                    {
                        const backupList: List<number> = List.create(list);
                        test.assertThrows(() => list.set(index, value), expectedError);
                        test.assertEqual(list, backupList);
                    });
                }

                setErrorTest(List.create(), -1, 5, new PreConditionError(
                    "Expression: count",
                    "Expected:   greater than or equal to 1",
                    "Actual:     0",
                ));
                setErrorTest(List.create(), 0, 5, new PreConditionError(
                    "Expression: count",
                    "Expected:   greater than or equal to 1",
                    "Actual:     0",
                ));
                setErrorTest(List.create(), 1, 5, new PreConditionError(
                    "Expression: count",
                    "Expected:   greater than or equal to 1",
                    "Actual:     0"
                ));
                setErrorTest(List.create([1]), -1, 5, new PreConditionError(
                    "Expression: index",
                    "Expected:   0",
                    "Actual:     -1"
                ));
                setErrorTest(List.create([1]), 1, 5, new PreConditionError(
                    "Expression: index",
                    "Expected:   0",
                    "Actual:     1"
                ));

                function setTest(list: List<number>, index: number, value: number, expected: number[]): void
                {
                    runner.test(`with ${runner.andList([list, index, value])}`, (test: Test) =>
                    {
                        const setResult: List<number> = list.set(index, value);
                        test.assertSame(list, setResult);
                        test.assertEqual(list.toArray().await(), expected);
                    });
                }

                setTest(List.create([1]), 0, 5, [5]);
                setTest(List.create([1, 2]), 0, 5, [5, 2]);
                setTest(List.create([1, 2]), 1, 5, [1, 5]);
            });

            runner.testFunction("get(number)", () =>
            {
                function getErrorTest(list: List<number>, index: number, expectedError: Error): void
                {
                    runner.test(`with ${runner.andList([list, index])}`, (test: Test) =>
                    {
                        const backupList: List<number> = List.create(list);
                        test.assertThrows(() => list.get(index), expectedError);
                        test.assertEqual(list, backupList);
                    });
                }

                getErrorTest(List.create(), -1, new PreConditionError(
                    "Expression: count",
                    "Expected:   greater than or equal to 1",
                    "Actual:     0"
                ));
                getErrorTest(List.create(), 0, new PreConditionError(
                    "Expression: count",
                    "Expected:   greater than or equal to 1",
                    "Actual:     0"
                ));
                getErrorTest(List.create(), 1, new PreConditionError(
                    "Expression: count",
                    "Expected:   greater than or equal to 1",
                    "Actual:     0"
                ));
                getErrorTest(List.create([1]), -1, new PreConditionError(
                    "Expression: index",
                    "Expected:   0",
                    "Actual:     -1"
                ));
                getErrorTest(List.create([1]), 1, new PreConditionError(
                    "Expression: index",
                    "Expected:   0",
                    "Actual:     1"
                ));

                function getTest(list: List<number>, index: number, expected: number): void
                {
                    runner.test(`with ${runner.andList([list, index])}`, (test: Test) =>
                    {
                        test.assertSame(list.get(index).await(), expected);
                    });
                }

                getTest(List.create([1]), 0, 1);
                getTest(List.create([1, 2]), 0, 1);
                getTest(List.create([1, 2]), 1, 2);
            });

            runner.testFunction("add(T)", () =>
            {
                function addTest(list: List<number>, value: number, expected: number[]): void
                {
                    runner.test(`with ${runner.andList([list, value])}`, (test: Test) =>
                    {
                        const addResult: List<number> = list.add(value);
                        test.assertSame(addResult, list);
                        test.assertEqual(list.toArray().await(), expected);
                    });
                }

                addTest(List.create(), 1, [1]);
                addTest(List.create([1]), 2, [1, 2]);
                addTest(List.create([1, 2]), 3, [1, 2, 3]);
            });

            runner.testFunction("addAll(T)", () =>
            {
                function addAllTest(list: List<number>, values: JavascriptIterable<number>, expected: number[]): void
                {
                    runner.test(`with ${runner.andList([list, values])}`, (test: Test) =>
                    {
                        const addResult: List<number> = list.addAll(values);
                        test.assertSame(addResult, list);
                        test.assertEqual(list.toArray().await(), expected);
                    });
                }

                addAllTest(List.create(), [1], [1]);
                addAllTest(List.create([1]), [2], [1, 2]);
                addAllTest(List.create([1, 2]), [3], [1, 2, 3]);
                addAllTest(List.create(), [1, 2], [1, 2]);
                addAllTest(List.create([1]), [2, 3], [1, 2, 3]);
                addAllTest(List.create([1, 2]), [3, 4], [1, 2, 3, 4]);

                addAllTest(List.create(), List.create([1]), [1]);
                addAllTest(List.create([1]), List.create([2]), [1, 2]);
                addAllTest(List.create([1, 2]), List.create([3]), [1, 2, 3]);
                addAllTest(List.create(), List.create([1, 2]), [1, 2]);
                addAllTest(List.create([1]), List.create([2, 3]), [1, 2, 3]);
                addAllTest(List.create([1, 2]), List.create([3, 4]), [1, 2, 3, 4]);
            });

            runner.testFunction("insert(number,T)", () =>
            {
                function insertErrorTest(list: List<number>, index: number, value: number, expected: Error): void
                {
                    runner.test(`with ${runner.andList([list, index, value])}`, (test: Test) =>
                    {
                        const backupList: List<number> = List.create(list);
                        test.assertThrows(() => list.insert(index, value), expected);
                        test.assertEqual(list, backupList);
                    });
                }

                insertErrorTest(List.create(), -1, 1, new PreConditionError(
                    "Expression: index",
                    "Expected:   0",
                    "Actual:     -1"
                ));
                insertErrorTest(List.create(), 1, 1, new PreConditionError(
                    "Expression: index",
                    "Expected:   0",
                    "Actual:     1"
                ));
                insertErrorTest(List.create([1]), -1, 1, new PreConditionError(
                    "Expression: index",
                    "Expected:   between 0 and 1",
                    "Actual:     -1"
                ));
                insertErrorTest(List.create([1]), 2, 1, new PreConditionError(
                    "Expression: index",
                    "Expected:   between 0 and 1",
                    "Actual:     2"
                ));

                function insertTest(list: List<number>, index: number, value: number, expected: number[]): void
                {
                    runner.test(`with ${runner.andList([list, index, value])}`, (test: Test) =>
                    {
                        const insertResult: List<number> = list.insert(index, value);
                        test.assertSame(insertResult, list);
                        test.assertEqual(list.toArray().await(), expected);
                    });
                }

                insertTest(List.create(), 0, 1, [1]);
                insertTest(List.create([2]), 0, 1, [1, 2]);
                insertTest(List.create([1]), 1, 2, [1, 2]);
                insertTest(List.create([2, 3]), 0, 1, [1, 2, 3]);
                insertTest(List.create([1, 3]), 1, 2, [1, 2, 3]);
                insertTest(List.create([1, 2]), 2, 3, [1, 2, 3]);
            });

            runner.testFunction("insertAll(number,T)", () =>
            {
                function insertAllErrorTest(list: List<number>, index: number, values: number[] | Iterable<number>, expected: Error): void
                {
                    runner.test(`with ${runner.andList([list, index, values])}`, (test: Test) =>
                    {
                        const backupList: List<number> = List.create(list);
                        test.assertThrows(() => list.insertAll(index, values), expected);
                        test.assertEqual(list, backupList);
                    });
                }

                insertAllErrorTest(List.create(), -1, [1], new PreConditionError(
                    "Expression: index",
                    "Expected:   0",
                    "Actual:     -1"
                ));
                insertAllErrorTest(List.create(), 1, [1], new PreConditionError(
                    "Expression: index",
                    "Expected:   0",
                    "Actual:     1"
                ));
                insertAllErrorTest(List.create([1]), -1, [1], new PreConditionError(
                    "Expression: index",
                    "Expected:   between 0 and 1",
                    "Actual:     -1"
                ));
                insertAllErrorTest(List.create([1]), 2, [1], new PreConditionError(
                    "Expression: index",
                    "Expected:   between 0 and 1",
                    "Actual:     2",
                ));

                function insertAllTest(list: List<number>, index: number, values: JavascriptIterable<number>, expected: number[]): void
                {
                    runner.test(`with ${runner.andList([list, index, values])}`, (test: Test) =>
                    {
                        const insertResult: List<number> = list.insertAll(index, values);
                        test.assertSame(insertResult, list);
                        test.assertEqual(list.toArray().await(), expected);
                    });
                }

                insertAllTest(List.create(), 0, [], []);
                insertAllTest(List.create(), 0, [1], [1]);
                insertAllTest(List.create([2]), 0, [1], [1, 2]);
                insertAllTest(List.create([1]), 1, [2], [1, 2]);
                insertAllTest(List.create([2, 3]), 0, [1], [1, 2, 3]);
                insertAllTest(List.create([1, 3]), 1, [2], [1, 2, 3]);
                insertAllTest(List.create([1, 2]), 2, [3], [1, 2, 3]);
                insertAllTest(List.create([3]), 0, [1, 2], [1, 2, 3]);
                insertAllTest(List.create([1]), 1, [2, 3], [1, 2, 3]);
                insertAllTest(List.create([1, 4]), 1, [2, 3], [1, 2, 3, 4]);

                insertAllTest(List.create(), 0, List.create(), []);
                insertAllTest(List.create(), 0, List.create([1]), [1]);
                insertAllTest(List.create([2]), 0, List.create([1]), [1, 2]);
                insertAllTest(List.create([1]), 1, List.create([2]), [1, 2]);
                insertAllTest(List.create([2, 3]), 0, List.create([1]), [1, 2, 3]);
                insertAllTest(List.create([1, 3]), 1, List.create([2]), [1, 2, 3]);
                insertAllTest(List.create([1, 2]), 2, List.create([3]), [1, 2, 3]);
                insertAllTest(List.create([3]), 0, List.create([1, 2]), [1, 2, 3]);
                insertAllTest(List.create([1]), 1, List.create([2, 3]), [1, 2, 3]);
                insertAllTest(List.create([1, 4]), 1, List.create([2, 3]), [1, 2, 3, 4]);
            });
        });
    });
}
