import { Clock, DateTime } from "../sources/index.js";
import { Test } from "./test.js";
import { TestRunner } from "./testRunner.js";

export function test(runner: TestRunner): void
{
    runner.testFile("Clock.ts", () =>
    {
        runner.testType("Clock", () =>
        {
            runner.testFunction("create()", (test: Test) =>
            {
                const clock: Clock = Clock.create();
                test.assertNotUndefinedAndNotNull(clock);
            });

            clockTest(runner, Clock.create);
        });
    });
}

export function clockTest(runner: TestRunner, creator: () => Clock): void
{
    runner.testType("Clock", () =>
    {
        runner.testFunction("getCurrent()", (test: Test) =>
        {
            const clock: Clock = creator();
            test.assertNotUndefinedAndNotNull(clock);

            const now: DateTime = clock.getCurrent();
            test.assertNotUndefinedAndNotNull(now);
        });
    });
}