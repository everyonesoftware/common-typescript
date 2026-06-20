import { Test, TestRunner } from ".";
import { Iterable } from "../sources/iterable";
import { MutableIndexable } from "../sources/MutableIndexable";
import { indexableTests } from "./IndexableTests";

export function mutableIndexableTests<T>(runner: TestRunner, creator: () => MutableIndexable<T>): void
{
    runner.testType("MutableIndexable<T>", () =>
    {
        indexableTests(runner, creator);
    });
}

export function test(runner: TestRunner): void
{
    runner.testFile("MutableIndexable.ts", () =>
    {
        runner.testType("MutableIndexable<T>", () =>
        {
            runner.testFunction("create()", () =>
            {
                runner.test("with no arguments", (test: Test) =>
                {
                    const indexable: MutableIndexable<number> = MutableIndexable.create();
                    test.assertNotUndefinedAndNotNull(indexable);
                    test.assertEqual(0, indexable.getCount().await());
                });

                runner.test("with empty array", (test: Test) =>
                {
                    const indexable: MutableIndexable<number> = MutableIndexable.create([]);
                    test.assertNotUndefinedAndNotNull(indexable);
                    test.assertEqual(0, indexable.getCount().await());
                });

                runner.test("with non-empty array", (test: Test) =>
                {
                    const indexable: MutableIndexable<number> = MutableIndexable.create([1, 2, 3]);
                    test.assertNotUndefinedAndNotNull(indexable);
                    test.assertEqual(3, indexable.getCount().await());
                    test.assertEqual(indexable, Iterable.create([1, 2, 3]));
                });
            });
        });
    });
}