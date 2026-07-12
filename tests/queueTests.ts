import { EmptyError } from "../sources/emptyError.js";
import { ListQueue } from "../sources/listQueue.js";
import { Queue } from "../sources/queue.js";
import { Test } from "./test.js";
import { TestRunner } from "./testRunner.js";

export function test(runner: TestRunner): void
{
    runner.testFile("queue.ts", () =>
    {
        runner.testType("Queue<T>", () =>
        {
            runner.testFunction("create()", (test: Test) =>
            {
                const queue: ListQueue<number> = Queue.create();
                test.assertNotUndefinedAndNotNull(queue);
                test.assertFalse(queue.any().await());
                test.assertThrows(() => queue.remove().await(), new EmptyError());
            });

            runner.testFunction("add()", (test: Test) =>
            {
                const queue: ListQueue<number> = Queue.create();
                queue.add(20).await();
                test.assertEqual(20, queue.remove().await());
            });
        });
    });
}