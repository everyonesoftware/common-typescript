import { PostConditionError } from "../sources/postConditionError.js";
import { Test } from "./test.js";
import { TestRunner } from "./testRunner.js";

export function test(runner: TestRunner): void
{
    runner.testFile("postConditionError.ts", () =>
    {
        runner.testType(PostConditionError.name, () =>
        {
            runner.testFunction("constructor(string|undefined)", () =>
            {
                runner.test("with no arguments", (test: Test) =>
                {
                    const error: PostConditionError = new PostConditionError();
                    test.assertNotUndefinedAndNotNull(error);
                    test.assertEqual(error.name, "Error");
                    test.assertEqual(error.message, "");
                    test.assertNotUndefinedAndNotNull(error.stack);
                });
            });
        });
    });
}
