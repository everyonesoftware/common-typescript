import * as http from "http";

import { HttpServer } from "./httpServer.js";
import { HttpIncomingRequest } from "./httpIncomingRequest.js";
import { HttpOutgoingResponse } from "./httpOutgoingResponse.js";
import { PreCondition } from "./preCondition.js";
import { AsyncResult } from "./asyncResult.js";
import { NodeJSHttpOutgoingResponse } from "./NodeJSHttpOutgoingResponse.js";

/**
 * A {@link HttpServer} implementation that uses the Node.js HTTP module.
 */
export class NodeJSHttpServer extends HttpServer
{
    private httpServer: http.Server | undefined;
    private disposed: boolean;

    private constructor()
    {
        super();

        this.disposed = false;
    }

    public static create(): NodeJSHttpServer
    {
        return new NodeJSHttpServer();
    }

    public dispose(): AsyncResult<boolean>
    {
        return AsyncResult.create(new Promise<boolean>((resolve, reject) =>
        {
            if (this.disposed)
            {
                resolve(false);
            }
            else if (!this.httpServer)
            {
                this.disposed = true;
                resolve(true);
            }
            else
            {
                this.httpServer.close((error?: Error) =>
                {
                    if (error)
                    {
                        reject(error);
                    }
                    else
                    {
                        this.disposed = true;
                        this.httpServer = undefined;
                        resolve(true);
                    }
                });
            }
        }));
    }

    public isDisposed(): boolean
    {
        return this.disposed;
    }

    public isStarted(): boolean
    {
        return !!this.httpServer;
    }

    public addRequestHandler(_requestPath: string, _handler: (request: HttpIncomingRequest, response: HttpOutgoingResponse) => AsyncResult<void>): void
    {
        throw new Error("Method not implemented.");
    }

    public setDefaultRequestHandler(_handler: (request: HttpIncomingRequest, response: HttpOutgoingResponse) => AsyncResult<void>): void
    {
        throw new Error("Method not implemented.");
    }

    /**
     * Start listening for incoming connections on the provided port number. The returned
     * {@link AsyncResult} will complete when the server is disposed.
     * @param portNumber The port number to start listening on.
     */
    public start(portNumber: number): AsyncResult<void>
    {
        PreCondition.assertGreaterThanOrEqualTo(portNumber, 1, "portNumber");
        PreCondition.assertFalse(this.isDisposed(), "this.isDisposed()");
        PreCondition.assertUndefined(this.httpServer, "this.httpServer");

        return AsyncResult.create(new Promise<void>((resolve, reject) =>
        {
            if (this.httpServer)
            {
                reject(new Error("Can't run a HttpServer multiple times."));
            }
            else
            {
                this.httpServer = http.createServer();

                this.httpServer.on("request", async (rawRequest: http.IncomingMessage, rawResponse: http.ServerResponse<http.IncomingMessage> & { req: http.IncomingMessage }) =>
                {
                    // const httpRequest: HttpIncomingRequest = NodeJSHttpIncomingRequest.create(request);
                    const response = NodeJSHttpOutgoingResponse.create(rawResponse)
                        .setStatusCode(200)
                        .setHeader("Content-Type", "text/plain")
                        .setBodyString("Hello world!");
                    await response.end();
                });

                this.httpServer.on("close", () =>
                {
                    resolve();
                });

                this.httpServer.on("error", (error: Error) =>
                {
                    reject(error);
                });

                this.httpServer.listen(portNumber);
            }
        }));
    }
}