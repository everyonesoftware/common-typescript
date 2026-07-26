import { ConsoleTestRunnerUI, FlatConsoleTestRunnerUI, TreeConsoleTestRunnerUI } from "./ConsoleTestRunnerUI.js";
import { Test } from "./test.js";
import { TestRunner } from "./testRunner.js";

export function consoleTestRunnerUITests(runner: TestRunner, _: () => ConsoleTestRunnerUI): void
{
    runner.testType("ConsoleTestRunnerUI", () =>
    {
    });
}

export function test(runner: TestRunner): void
{
    runner.testFile("ConsoleTestRunnerUI.ts", () =>
    {
        runner.testType("ConsoleTestRunnerUI", () =>
        {
            runner.testFunction("flat()", (test: Test) =>
            {
                const ui: FlatConsoleTestRunnerUI = ConsoleTestRunnerUI.flat();
                test.assertNotUndefinedAndNotNull(ui);
            });

            runner.testFunction("tree()", (test: Test) =>
            {
                const ui: TreeConsoleTestRunnerUI = ConsoleTestRunnerUI.tree();
                test.assertNotUndefinedAndNotNull(ui);
            });
        });

        runner.testType("FlatConsoleTestRunnerUI", () =>
        {
            consoleTestRunnerUITests(runner, FlatConsoleTestRunnerUI.create);
        });

        runner.testType("TreeConsoleTestRunnerUI", () =>
        {
            consoleTestRunnerUITests(runner, TreeConsoleTestRunnerUI.create);
        });
    });
}