import { Clock, DateTime } from "../sources";
import { Test } from "./test";
import { TestRunner } from "./testRunner";

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
        runner.testFunction("now()", (test: Test) =>
        {
            const clock: Clock = creator();
            test.assertNotUndefinedAndNotNull(clock);

            const now: DateTime = clock.now();
            test.assertNotUndefinedAndNotNull(now);
        });
    });
}