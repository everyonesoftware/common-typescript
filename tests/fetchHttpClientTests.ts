import { as, FetchHttpClient, FetchHttpIncomingResponse, HttpHeaders, HttpIncomingRequest, HttpIncomingResponse, HttpOutgoingResponse, isJSONObjectData, JSONObjectData, NodeJSHttpServer } from "../sources/index.js";
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

                runner.test("with custom headers", async (test: Test) =>
                {
                    const client: FetchHttpClient = FetchHttpClient.create();

                    const server: NodeJSHttpServer = NodeJSHttpServer.create();
                    server.setDefaultRequestHandler(async (request: HttpIncomingRequest, response: HttpOutgoingResponse) =>
                    {
                        response.setStatusCode(200);
                        response.setBodyJSON({
                            method: request.getMethod().toString(),
                            host: await request.getHost(),
                            path: request.getPath(),
                            queryParameters: request.getQueryParameters().toString(),
                            headers: (await request.getHeaders()).toJSON(),
                        });
                    });
                    await server.start();
                    try
                    {
                        const response: HttpIncomingResponse = await client.sendGetRequest(
                            `http://localhost:${server.getPortNumber()}/hello`,
                            HttpHeaders.create().set("apples", "bananas"),
                        );
                        test.assertNotUndefinedAndNotNull(response);
                        test.assertEqual(response.getStatusCode(), 200);

                        const bodyJSON: JSONObjectData | undefined = as<JSONObjectData>(await response.getBodyJSON(), isJSONObjectData);
                        test.assertNotUndefinedAndNotNull(bodyJSON);

                        test.assertEqual(bodyJSON.method, "GET");
                        test.assertEqual(bodyJSON.host, "localhost");
                        test.assertEqual(bodyJSON.path, "/hello");
                        test.assertEqual(bodyJSON.queryParameters, "{}");

                        const headersJSON: JSONObjectData | undefined = as<JSONObjectData>(bodyJSON.headers, isJSONObjectData);
                        test.assertNotUndefinedAndNotNull(headersJSON);
                        test.assertEqual(headersJSON["accept"], "*/*");
                        test.assertEqual(headersJSON["accept-language"], "*");
                        test.assertEqual(headersJSON["user-agent"], "node");
                        test.assertEqual(headersJSON["host"], `localhost:${server.getPortNumber()}`);
                        test.assertEqual(headersJSON["apples"], "bananas");
                    }
                    finally
                    {
                        await server.dispose();
                    }
                });
            });
        });
    });
}