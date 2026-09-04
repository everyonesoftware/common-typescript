import { AsyncResult } from "../sources/index.js";
import { FetchHttpClient } from "../sources/fetchHttpClient.js";
import { FetchHttpIncomingResponse } from "../sources/FetchHttpIncomingResponse.js";
import { NodeJSHttpServer } from "../sources/nodeJSHttpServer.js";
import { PreConditionError } from "../sources/preConditionError.js";
import { Test } from "./test.js";
import { TestRunner } from "./testRunner.js";

export function test(runner: TestRunner): void
{
    runner.testFile("nodeJSHttpServer.ts", runner.skip(), () =>
    {
        runner.testType("NodeJSHttpServer", () =>
        {
            runner.testFunction("create()", (test: Test) =>
            {
                const httpServer: NodeJSHttpServer = NodeJSHttpServer.create();
                test.assertNotUndefinedAndNotNull(httpServer);
                test.assertFalse(httpServer.isDisposed());
                test.assertFalse(httpServer.isStarted());
            });

            runner.testFunction("dispose()", async (test: Test) =>
            {
                const httpServer: NodeJSHttpServer = NodeJSHttpServer.create();

                test.assertTrue(await httpServer.dispose());
                test.assertTrue(httpServer.isDisposed());
                test.assertFalse(httpServer.isStarted());

                for (let i = 0; i < 3; i++)
                {
                    test.assertFalse(await httpServer.dispose());
                    test.assertTrue(httpServer.isDisposed());
                    test.assertFalse(httpServer.isStarted());
                }
            });

            runner.testFunction("start()", () =>
            {
                runner.test("when disposed", async (test: Test) =>
                {
                    const httpServer: NodeJSHttpServer = NodeJSHttpServer.create();
                    test.assertTrue(await httpServer.dispose());

                    test.assertThrowsAsync(() => httpServer.start(3000), new PreConditionError(
                        "Expression: this.isDisposed()",
                        "Expected: false",
                        "Actual: true",
                    ));
                    test.assertTrue(httpServer.isDisposed());
                    test.assertFalse(httpServer.isStarted());
                });

                runner.test("simple scenario", async (test: Test) =>
                {
                    const httpServer: NodeJSHttpServer = NodeJSHttpServer.create();

                    const startResult: AsyncResult<void> = httpServer.start(3000);
                    try
                    {
                        const httpClient: FetchHttpClient = FetchHttpClient.create();
                        const response: FetchHttpIncomingResponse = await httpClient.sendGetRequest("http://localhost:3000");

                        test.assertNotUndefinedAndNotNull(response);
                        test.assertEqual(200, response.getStatusCode());
                    }
                    finally
                    {
                        await httpServer.dispose();
                        await startResult;
                    }
                });
            });
        });
    });
}