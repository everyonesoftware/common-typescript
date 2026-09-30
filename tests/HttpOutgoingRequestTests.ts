import { HttpHeaders, HttpMethod, HttpOutgoingRequest, isUndefinedOrNull, JSONData, PreConditionError } from "../sources/index.js";
import { Test } from "./test.js";
import { TestRunner } from "./testRunner.js";

export function test(runner: TestRunner): void
{
    runner.testFile("HttpOutgoingRequest.ts", () =>
    {
        runner.testType("HttpOutgoingRequest", () =>
        {
            runner.testFunction("create()", () =>
            {
                runner.test("with headers", (test: Test) =>
                {
                    const request: HttpOutgoingRequest = HttpOutgoingRequest.create(
                        HttpMethod.GET,
                        "http://localhost/hello",
                        HttpHeaders.create().set("hey", "there"),
                    );
                    test.assertNotUndefinedAndNotNull(request);
                    test.assertEqual(request.getMethod(), HttpMethod.GET);
                    test.assertEqual(request.getURL(), "http://localhost/hello");
                    test.assertEqual(request.getHeaderValue("hey").await(), "there");
                });
            });

            runner.testFunction("setBodyString()", () =>
            {
                function setBodyStringErrorTest(body: string, expected: Error): void
                {
                    runner.test(`with ${runner.toString(body)}`, (test: Test) =>
                    {
                        const request: HttpOutgoingRequest = HttpOutgoingRequest.create(HttpMethod.GET, "https://fake.url/");
                        test.assertThrows(() => request.setBodyString(body), expected);
                        test.assertEqual("", request.getBodyString());
                    });
                }

                setBodyStringErrorTest(undefined!, new PreConditionError({
                    expression: "body",
                    expected: "not undefined and not null",
                    actual: "undefined",
                }));
                setBodyStringErrorTest(null!, new PreConditionError({
                    expression: "body",
                    expected: "not undefined and not null",
                    actual: "null",
                }));
            });

            runner.testFunction("setBodyJSON()", () =>
            {
                function setBodyJSONErrorTest(body: JSONData, expected: Error): void
                {
                    runner.test(`with ${runner.toString(body)}`, (test: Test) =>
                    {
                        const request: HttpOutgoingRequest = HttpOutgoingRequest.create(HttpMethod.GET, "https://fake.url/");
                        test.assertThrows(() => request.setBodyJSON(body), expected);
                        test.assertEqual("", request.getBodyString());
                    });
                }

                setBodyJSONErrorTest(undefined!, new PreConditionError({
                    expression: "body",
                    expected: "not undefined",
                    actual: "undefined",
                }));

                function setBodyJSONTest(body: JSONData, expectedBody?: string): void
                {
                    runner.test(`with ${runner.toString(body)}`, (test: Test) =>
                    {
                        if (isUndefinedOrNull(expectedBody))
                        {
                            expectedBody = JSON.stringify(body);
                        }

                        const request: HttpOutgoingRequest = HttpOutgoingRequest.create(HttpMethod.GET, "https://fake.url/");
                        const setBodyJSONResult: HttpOutgoingRequest = request.setBodyJSON(body);
                        test.assertSame(request, setBodyJSONResult);
                        test.assertEqual(expectedBody, request.getBodyString());
                        test.assertEqual(body, request.getBodyJSON().await());
                    });
                }

                setBodyJSONTest(null, "null");
                setBodyJSONTest(123, "123");
                setBodyJSONTest(false, "false");
                setBodyJSONTest(true, "true");
                setBodyJSONTest({}, `{}`);
                setBodyJSONTest({ a: false }, `{"a":false}`);
            });
        });
    });
}