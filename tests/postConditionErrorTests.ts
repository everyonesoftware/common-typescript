import { join, PostConditionError } from "../sources/index.js";
import { Test } from "./test.js";
import { TestRunner } from "./testRunner.js";

export function test(runner: TestRunner): void
{
    runner.testFile("postConditionError.ts", () =>
    {
        runner.testType(PostConditionError.name, () =>
        {
            runner.testFunction("constructor()", () =>
            {
                runner.test("with expected and actual", (test: Test) =>
                {
                    const error: PostConditionError = new PostConditionError({
                        expectedString: "xyz",
                        actualString: "lmo",
                    });
                    test.assertNotUndefinedAndNotNull(error);
                    test.assertEqual(error.name, "Error");
                    test.assertEqual(error.message, join("\n", [
                        "Expected: xyz",
                        "Actual:   lmo",
                    ]));
                    test.assertNotUndefinedAndNotNull(error.stack);
                });
            });
        });
    });
}
