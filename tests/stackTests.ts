import { EmptyError } from "../sources/emptyError.js";
import { ListStack } from "../sources/listStack.js";
import { Stack } from "../sources/stack.js";
import { Test } from "./test.js";
import { TestRunner } from "./testRunner.js";

export function test(runner: TestRunner): void
{
    runner.testFile("stack.ts", () =>
    {
        runner.testType("Stack<T>", () =>
        {
            runner.testFunction("create()", (test: Test) =>
            {
                const stack: ListStack<number> = Stack.create();
                test.assertNotUndefinedAndNotNull(stack);
                test.assertFalse(stack.any().await());
            });

            runner.testFunction("add()", (test: Test) =>
            {
                const stack: ListStack<number> = Stack.create();

                stack.add(10).await();
                test.assertTrue(stack.any().await());

                stack.add(20).await();
                test.assertTrue(stack.any().await());

                test.assertEqual(20, stack.remove().await());
                test.assertEqual(10, stack.remove().await());
                test.assertFalse(stack.any().await());
            });

            runner.testFunction("addAll()", () =>
            {
                function addAllTest(values: number[]): void
                {
                    runner.test(`with ${runner.toString(values)}`, (test: Test) =>
                    {
                        const stack: ListStack<number> = Stack.create();
                        stack.addAll(values).await();

                        for (const value of values.reverse())
                        {
                            test.assertTrue(stack.any().await());
                            test.assertEqual(value, stack.remove().await());
                        }
                        test.assertFalse(stack.any().await());
                    });
                }

                addAllTest([]);
                addAllTest([1]);
                addAllTest([1, 2]);
                addAllTest([1, 2, 3]);
            });

            runner.testFunction("remove()", (test: Test) =>
            {
                const stack: ListStack<number> = Stack.create();
                test.assertThrows(() => stack.remove().await(), new EmptyError());
            });
        });
    });
}