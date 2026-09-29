import { PreConditionError, RealProcessRunner } from "../sources/index.js";
import { Test } from "./test.js";
import { TestRunner } from "./testRunner.js";

export function test(runner: TestRunner): void
{
    runner.testFile("RealProcessRunner.ts", () =>
    {
        runner.testType("RealProcessRunner", () =>
        {
            runner.testFunction("create()", (test: Test) =>
            {
                const processRunner: RealProcessRunner = RealProcessRunner.create();
                test.assertNotUndefinedAndNotNull(processRunner);
            });

            runner.testFunction("start()", () =>
            {
                runner.test("with undefined options", (test: Test) =>
                {
                    const processRunner: RealProcessRunner = RealProcessRunner.create();
                    test.assertThrows(() => processRunner.start(undefined!), new PreConditionError({
                        expression: "shellCommand",
                        expected: "not undefined and not null",
                        actual: "undefined",
                    }));
                });

                runner.test("with null options", (test: Test) =>
                {
                    const processRunner: RealProcessRunner = RealProcessRunner.create();
                    test.assertThrows(() => processRunner.start(null!), new PreConditionError({
                        expression: "shellCommand",
                        expected: "not undefined and not null",
                        actual: "null",
                    }));
                });

                runner.test("with notepad.exe", runner.skip("Come back after FileSystem is implemented"), async (test: Test) =>
                {
                    const processRunner: RealProcessRunner = RealProcessRunner.create();
                    const exitCode: number = await processRunner.start("notepad.exe");
                    test.assertEqual(0, exitCode);
                });
            });
        });
    })
}