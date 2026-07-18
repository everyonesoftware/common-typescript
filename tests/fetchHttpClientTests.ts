import { FetchHttpClient } from "../sources/fetchHttpClient.js";
import { FetchHttpIncomingResponse } from "../sources/FetchHttpIncomingResponse.js";
import { HttpOutgoingRequest } from "../sources/httpOutgoingRequest.js";
import { Test } from "./test.js";
import { TestRunner } from "./testRunner.js";
import { hasNetworkAccess } from "./tests.js";

export function test(runner: TestRunner): void
{
    runner.testFile("fetchHttpClient.ts", () =>
    {
        runner.testType("FetchHttpClient", () =>
        {
            runner.test("create()", (test: Test) =>
            {
                const client: FetchHttpClient = FetchHttpClient.create();
                test.assertNotUndefinedAndNotNull(client);
            });

            runner.testFunction("sendRequest()", () =>
            {
                runner.test("to URL that exists", runner.skip(!hasNetworkAccess), async (test: Test) =>
                {
                    const client: FetchHttpClient = FetchHttpClient.create();

                    const response: FetchHttpIncomingResponse = await client.sendGetRequest("https://www.example.com");
                    test.assertNotUndefinedAndNotNull(response);
                    test.assertEqual(200, response.getStatusCode());
                });
            });
        });
    });
}