import * as http from "http";

import { HttpServer } from "./httpServer";
import { HttpIncomingRequest } from "./httpIncomingRequest";
import { HttpOutgoingResponse } from "./httpOutgoingResponse";
import { PreCondition } from "./preCondition";
import { HttpHeaders } from "./httpHeaders";
import { PromiseAsyncResult } from "./promiseAsyncResult";
import { Result } from "./result";

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

    public dispose(): PromiseAsyncResult<boolean>
    {
        return PromiseAsyncResult.create(new Promise<boolean>((resolve, reject) =>
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

    public addRequestHandler(requestPath: string, handler: (request: HttpIncomingRequest, response: HttpOutgoingResponse) => Result<void>): void
    {
        throw new Error("Method not implemented.");
    }

    public setDefaultRequestHandler(handler: (request: HttpIncomingRequest, response: HttpOutgoingResponse) => Result<void>): void
    {
        throw new Error("Method not implemented.");
    }

    public start(portNumber: number): PromiseAsyncResult<void>
    {
        PreCondition.assertGreaterThanOrEqualTo(portNumber, 1, "portNumber");
        PreCondition.assertFalse(this.isDisposed(), "this.isDisposed()");
        PreCondition.assertUndefined(this.httpServer, "this.httpServer");

        return PromiseAsyncResult.create(new Promise<void>((resolve, reject) =>
        {
            if (this.httpServer)
            {
                reject(new Error("Can't run a HttpServer multiple times."));
            }
            else
            {
                this.httpServer = http.createServer();

                this.httpServer.on("request", (request: http.IncomingMessage, response: http.ServerResponse<http.IncomingMessage> & { req: http.IncomingMessage }) =>
                {
                    // const httpRequest: HttpIncomingRequest = NodeJSHttpIncomingRequest.create(request);
                    const httpResponse: HttpOutgoingResponse = HttpOutgoingResponse.create()
                        .setStatusCode(200)
                        .setHeader("Content-Type", "text/plain")
                        .setBody("Hello world!");

                    const statusCode: number = httpResponse.getStatusCode();
                    const headers: HttpHeaders = httpResponse.getHeaders();

                    const responseHeaders: http.OutgoingHttpHeaders = {};
                    for (const header of headers)
                    {
                        responseHeaders[header.getName()] = header.getValue();
                    }

                    response.writeHead(statusCode, responseHeaders);
                    response.end(httpResponse.getBody());
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