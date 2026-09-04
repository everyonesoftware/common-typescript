import { AssertionError } from "assert";
import { AssertTest } from "./assertTest.js";
import { Test } from "./test.js";
import { TestRunner } from "./testRunner.js";

export function test(runner: TestRunner): void
{
    runner.testFile("assertTest.ts", () =>
    {
        runner.testType("AssertTest", () =>
        {
            runner.testFunction("assertThrows()", () =>
            {
                runner.test("with throwing action", (_: Test) =>
                {
                    const at: AssertTest = AssertTest.create();
                    at.assertThrows(() => { throw new Error("abc"); }, new Error("abc"));
                });

                runner.test("with non-throwing action", (test: Test) =>
                {
                    const at: AssertTest = AssertTest.create();
                    test.assertThrows(
                        () => at.assertThrows(() => {}, new Error("oops")),
                        new AssertionError({
                            message: "Missing expected exception (Error).",
                            operator: "throws",
                            expected: new Error("oops"),
                        }),
                    );
                });
            });

            runner.testFunction("assertThrowsAsync()", () =>
            {
                runner.test("with throwing sync action", async (_test: Test) =>
                {
                    const at: AssertTest = AssertTest.create();
                    await at.assertThrowsAsync(() => { throw new Error("abc"); }, new Error("abc"));
                });

                runner.test("with throwing async action", async (_: Test) =>
                {
                    const at: AssertTest = AssertTest.create();
                    await at.assertThrowsAsync(async () => { throw new Error("abc"); }, new Error("abc"));
                });

                runner.test("with rejected Promise", async (_: Test) =>
                {
                    const at: AssertTest = AssertTest.create();
                    await at.assertThrowsAsync(Promise.reject(new Error("abc")), new Error("abc"));
                });

                runner.test("with throwing action that returns a rejected Promise", async (_: Test) =>
                {
                    const at: AssertTest = AssertTest.create();
                    await at.assertThrowsAsync(() => Promise.reject(new Error("abc")), new Error("abc"));
                });

                runner.test("with non-throwing async action", async (test: Test) =>
                {
                    const at: AssertTest = AssertTest.create();
                    await test.assertThrowsAsync(
                        async () => await at.assertThrowsAsync(async () => {}, new Error("oops")),
                        new AssertionError({
                            message: "Missing expected rejection (Error).",
                            operator: "rejects",
                            expected: new Error("oops"),
                        }),
                    );
                });
            });
        });
    });
}