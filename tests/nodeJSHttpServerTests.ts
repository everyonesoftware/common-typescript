import { HttpClient, HttpIncomingResponse, NodeJSHttpServer, PreConditionError } from "../sources/index.js";
import { Test } from "./test.js";
import { TestRunner } from "./testRunner.js";

export function test(runner: TestRunner): void
{
    runner.testFile("nodeJSHttpServer.ts", () =>
    {
        runner.testType("NodeJSHttpServer", () =>
        {
            runner.testFunction("create()", (test: Test) =>
            {
                const httpServer: NodeJSHttpServer = NodeJSHttpServer.create();
                test.assertNotUndefinedAndNotNull(httpServer);
                test.assertFalse(httpServer.isDisposed());
                test.assertFalse(httpServer.isListening());
            });

            runner.testFunction("dispose()", async (test: Test) =>
            {
                const httpServer: NodeJSHttpServer = NodeJSHttpServer.create();

                test.assertTrue(await httpServer.dispose());
                test.assertTrue(httpServer.isDisposed());
                test.assertFalse(httpServer.isListening());

                for (let i = 0; i < 3; i++)
                {
                    test.assertFalse(await httpServer.dispose());
                    test.assertTrue(httpServer.isDisposed());
                    test.assertFalse(httpServer.isListening());
                }
            });

            runner.testFunction("start()", () =>
            {
                runner.test("when disposed", async (test: Test) =>
                {
                    const httpServer: NodeJSHttpServer = NodeJSHttpServer.create();
                    test.assertTrue(await httpServer.dispose());

                    await test.assertThrowsAsync(async () => await httpServer.start(3000), new PreConditionError({
                        expression: "this.isDisposed()",
                        expected: "false",
                        actual: "true",
                    }));
                    test.assertTrue(httpServer.isDisposed());
                    test.assertFalse(httpServer.isListening());
                });

                runner.test("simple scenario", async (test: Test) =>
                {
                    const httpServer: NodeJSHttpServer = NodeJSHttpServer.create();

                    await httpServer.start();
                    try
                    {
                        const httpClient: HttpClient = HttpClient.create();
                        const response: HttpIncomingResponse = await httpClient.sendGetRequest(`http://localhost:${httpServer.getPortNumber()}`);

                        test.assertNotUndefinedAndNotNull(response);
                        test.assertEqual(response.getStatusCode(), 404);
                        test.assertEqual(await response.getBodyString(), "Unrecognized request");
                    }
                    finally
                    {
                        await httpServer.dispose();
                    }
                });
            });
        });
    });
}