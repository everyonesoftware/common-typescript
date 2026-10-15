import { NodeJSPath } from "../sources/index.js";
import { pathTests } from "./PathTests.js";
import { TestRunner } from "./testRunner.js";

export function test(runner: TestRunner): void
{
    runner.testFile("NodeJSPath.ts", () =>
    {
        runner.testType("NodeJSPath", () =>
        {
            pathTests(runner, NodeJSPath.parse);
        });
    });
}