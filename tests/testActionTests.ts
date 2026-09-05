import { PreConditionError } from "../sources/preConditionError.js";
import { join } from "../sources/strings.js";
import { Test } from "./test.js";
import { TestAction } from "./testAction.js";
import { TestRunner } from "./testRunner.js";

export function test(runner: TestRunner): void
{
    runner.testFile("testAction.ts", () =>
    {
        runner.testType("TestAction", () =>
        {
            runner.testFunction("create()", () =>
            {
                function createErrorTest(parent: TestAction | undefined, name: string, action: () => (void | Promise<void>), expected: Error): void
                {
                    runner.test(`with ${!parent ? runner.toString(parent) : "defined parent"}, ${runner.toString(name)}, and ${!action ? runner.toString(action) : "defined action"}`, (test: Test) =>
                    {
                        test.assertThrows(() => TestAction.create(parent, name, "test", undefined, action), expected);
                    });
                }

                createErrorTest(
                    undefined,
                    undefined!,
                    () => {},
                    new PreConditionError(join("\n", [
                        "Expression: name",
                        "Expected:   not undefined and not null",
                        "Actual:     undefined",
                    ])),
                );
                createErrorTest(
                    undefined,
                    null!,
                    () => {},
                    new PreConditionError(join("\n", [
                        "Expression: name",
                        "Expected:   not undefined and not null",
                        "Actual:     null",
                    ])),
                );
                createErrorTest(
                    undefined,
                    "a",
                    undefined!,
                    new PreConditionError(join("\n", [
                        "Expression: action",
                        "Expected:   not undefined and not null",
                        "Actual:     undefined",
                    ])),
                );
                createErrorTest(
                    undefined,
                    "a",
                    null!,
                    new PreConditionError(join("\n", [
                        "Expression: action",
                        "Expected:   not undefined and not null",
                        "Actual:     null",
                    ])),
                );

                function createTest(parent: TestAction | undefined, name: string, action: () => (void | Promise<void>)): void
                {
                    runner.test(`with ${!parent ? runner.toString(parent) : "defined parent"}, ${runner.toString(name)}, and ${!action ? runner.toString(action) : "defined action"}`, (test: Test) =>
                    {
                        const testAction: TestAction = TestAction.create(parent, name, "file", undefined, action);
                        test.assertNotUndefinedAndNotNull(testAction);
                        test.assertSame(parent, testAction.getParent());
                        test.assertSame(name, testAction.getName());
                        test.assertSame(action, testAction.getAction());
                    });
                }

                createTest(undefined, "b", () => {});
            });

            runner.testFunction("run()", (test: Test) =>
            {
                let counter: number = 0;
                const action: TestAction = TestAction.create(undefined, "c", "test", undefined, () => { counter++; });
                test.assertEqual(0, counter);

                for (let i = 1; i <= 3; i++)
                {
                    action.runAsync();
                    test.assertEqual(i, counter);
                }
            });
        });
    });
}