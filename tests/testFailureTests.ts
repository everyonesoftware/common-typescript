import { TestRunner } from "./testRunner.js";

export function test(runner: TestRunner): void
{
    runner.testFile("testFailure.ts", () =>
    {
        runner.testType("TestFailure", () =>
        {
            
        });
    });
}