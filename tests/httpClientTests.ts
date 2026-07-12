import { HttpClient } from "../sources/httpClient.js";
import { Test } from "./test.js";
import { TestRunner } from "./testRunner.js";

export function test(runner: TestRunner): void
{
    runner.testFile("httpClient.ts", () =>
    {
        runner.testType("HttpClient", () =>
        {
            runner.test("create()", (test: Test) =>
            {
                const client: HttpClient = HttpClient.create();
                test.assertNotUndefinedAndNotNull(client);
            });
        });
    });
}