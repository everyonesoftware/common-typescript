import { FetchHttpClient } from "../sources/fetchHttpClient";
import { FetchHttpIncomingResponse } from "../sources/fetchHttpResponse";
import { HttpOutgoingRequest } from "../sources/httpOutgoingRequest";
import { Test } from "./test";
import { TestRunner } from "./testRunner";
import { hasNetworkAccess } from "./tests";

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