import { FakeHttpClient, HttpIncomingResponse, HttpMethod, HttpOutgoingRequest, Iterable, PreConditionError } from "../sources/index.js";
import { Test } from "./test.js";
import { TestRunner } from "./testRunner.js";

export function test(runner: TestRunner): void
{
    runner.testFile("FakeHttpClient.ts", () =>
    {
        runner.testType("FakeHttpClient", () =>
        {
            runner.testFunction("create()", (test: Test) =>
            {
                const httpClient: FakeHttpClient = FakeHttpClient.create();
                test.assertNotUndefinedAndNotNull(httpClient);
                test.assertEqual(Iterable.create(), httpClient.getRequests());
            });

            runner.testFunction("sendRequest()", () =>
            {
                function sendRequestErrorTest(request: HttpOutgoingRequest, expected: Error): void
                {
                    runner.test(`with ${runner.toString(request)}`, (test: Test) =>
                    {
                        const httpClient: FakeHttpClient = FakeHttpClient.create();

                        test.assertThrows(() => httpClient.sendRequest(request).await(), expected);

                        test.assertEqual(Iterable.create(), httpClient.getRequests());
                    });
                }

                sendRequestErrorTest(undefined!, new PreConditionError(
                    "Expression: request",
                    "Expected: not undefined and not null",
                    "Actual: undefined",
                ));
                sendRequestErrorTest(null!, new PreConditionError(
                    "Expression: request",
                    "Expected: not undefined and not null",
                    "Actual: null",
                ));

                runner.test("with simple request", async (test: Test) =>
                {
                    const httpClient: FakeHttpClient = FakeHttpClient.create();
                    const request: HttpOutgoingRequest = HttpOutgoingRequest.create(HttpMethod.GET, "fake-url");

                    const response: HttpIncomingResponse = httpClient.sendRequest(request).await();

                    test.assertNotUndefinedAndNotNull(response);
                    test.assertEqual(200, response.getStatusCode());
                    test.assertEqual("{}", await response.getBodyString());

                    test.assertEqual(Iterable.create([request]), httpClient.getRequests());
                    test.assertNotSame(request, httpClient.getRequests().first().await());
                });
            });
        });
    });
}