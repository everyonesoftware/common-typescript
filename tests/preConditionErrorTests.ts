import { join } from "../sources/index.js";
import { PreConditionError } from "../sources/preConditionError.js";
import { Test } from "./test.js";
import { TestRunner } from "./testRunner.js";

export function test(runner: TestRunner): void
{
    runner.testFile("preConditionError.ts", () =>
    {
        runner.testType("PreConditionError", () =>
        {
            runner.testFunction("constructor()", () =>
            {
                runner.test("with expected and actual", (test: Test) =>
                {
                    const error: PreConditionError = new PreConditionError({
                        expectedString: "abc",
                        actualString: "def",
                    });
                    test.assertNotUndefinedAndNotNull(error);
                    test.assertEqual(error.name, "Error");
                    test.assertEqual(error.message, join("\n", [
                        "Expected: abc",
                        "Actual:   def",
                    ]));
                    test.assertNotUndefinedAndNotNull(error.stack);
                });
            });
        });
    });
}