import { TestRunner } from "./testRunner.js";
import { Set } from "../sources/set.js";
import { Test } from "./test.js";
import { JavascriptSetSet } from "../sources/javascriptSetSet.js";
import { NotFoundError } from "../sources/notFoundError.js";
import { SyncResult } from "../sources/syncResult.js";
import { JavascriptIterable } from "../sources/javascript.js";
import { PreConditionError } from "../sources/preConditionError.js";

export function test(runner: TestRunner): void
{
    runner.testFile("set.ts", () =>
    {
        runner.testType("Set<T>", () =>
        {
            runner.testFunction("create()", (test: Test) =>
            {
                const set: JavascriptSetSet<number> = Set.create();
                test.assertNotUndefinedAndNotNull(set);
                test.assertEqual(0, set.getCount().await());
                test.assertEqual([], set.toArray().await());
            });

            runner.testFunction("add()", (test: Test) =>
            {
                const set: Set<number> = Set.create();
                for (let i = 0; i < 3; i++)
                {
                    const addResult: Set<number> = set.add(20);
                    test.assertSame(set, addResult);
                    test.assertTrue(set.contains(20).await());
                    test.assertEqual(set.getCount().await(), 1);
                    test.assertEqual([20], set.toArray().await());
                }
            });

            runner.testFunction("addAll()", (test: Test) =>
            {
                const set: Set<number> = Set.create();
                for (let i = 0; i < 3; i++)
                {
                    const addResult: Set<number> = set.addAll([20, 20, 25, 26]);
                    test.assertSame(set, addResult);
                    test.assertTrue(set.contains(20).await());
                    test.assertTrue(set.contains(25).await());
                    test.assertTrue(set.contains(26).await());
                    test.assertEqual(set.getCount().await(), 3);
                    test.assertEqual([20, 25, 26], set.toArray().await());
                }
            });

            runner.testFunction("remove()", (test: Test) =>
            {
                const set: Set<number> = Set.create();

                test.assertThrows(set.remove(15), new NotFoundError("Could not find 15."));

                set.add(16);
                const removeResult: SyncResult<void> = set.remove(16);
                test.assertNotUndefinedAndNotNull(removeResult);
                test.assertFalse(set.contains(16).await());
                test.assertUndefined(removeResult.await());

                test.assertThrows(set.remove(16), new NotFoundError("Could not find 16."));
            });

            runner.testFunction("toString()", () =>
            {
                function toStringTest<T>(set: Set<T>, expected: string): void
                {
                    runner.test(`with ${runner.toString(set)}`, (test: Test) =>
                    {
                        test.assertEqual(set.toString(), expected);
                    });
                }

                toStringTest(Set.create(), "{}");
                toStringTest(Set.create().addAll([1]), "{1}");
                toStringTest(Set.create().addAll([1, 2]), "{1,2}");
                toStringTest(Set.create().addAll([3, 1, 2]), "{3,1,2}");
            });

            runner.testFunction("equals()", () =>
            {
                function equalsTest<T>(set: Set<T>, right: JavascriptIterable<T>, expected: boolean): void
                {
                    runner.test(`with ${runner.andList([set, right])}`, (test: Test) =>
                    {
                        test.assertEqual(set.equals(right).await(), expected);
                    });
                }

                equalsTest(Set.create(), [], true);
                equalsTest(Set.create(), [1], false);
                equalsTest(Set.create<number>().addAll([1]), [], false);
                equalsTest(Set.create<number>().addAll([1]), [1], true);
                equalsTest(Set.create<number>().addAll([1]), [1, 1], false);
                equalsTest(Set.create<number>().addAll([1, 2]), [1, 2], true);
                equalsTest(Set.create<number>().addAll([1, 2]), [2, 1], false);
                equalsTest(Set.create<number>().addAll([1, 2]), Set.create<number>().addAll([2, 1]), true);
            });

            runner.testFunction("union()", () =>
            {
                function unionErrorTest<T>(set: Set<T>, values: JavascriptIterable<T>, expected: Error): void
                {
                    runner.test(`with ${runner.andList([set, values])}`, (test: Test) =>
                    {
                        test.assertThrows(() => set.union(values), expected);
                    });
                }

                unionErrorTest(Set.create<number>(), undefined!, new PreConditionError(
                    "Expression: values",
                    "Expected: not undefined and not null",
                    "Actual: undefined",
                ));
                unionErrorTest(Set.create<number>(), null!, new PreConditionError(
                    "Expression: values",
                    "Expected: not undefined and not null",
                    "Actual: null",
                ));

                function unionTest<T>(set: Set<T>, values: JavascriptIterable<T>, expected: JavascriptIterable<T>): void
                {
                    runner.test(`with ${runner.andList([set, values])}`, (test: Test) =>
                    {
                        test.assertEqual(set.union(values).toArray().await(), expected);
                    });
                }

                unionTest(Set.create(), [], []);
                unionTest(Set.create(), [1, 2], [1, 2]);
                unionTest(Set.create([1]), [2], [1, 2]);
                unionTest(Set.create([1, 2]), [1], [1, 2]);
            });
        });
    });
}