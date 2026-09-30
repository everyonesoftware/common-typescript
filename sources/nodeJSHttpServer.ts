import * as http from "http";

import { HttpServer } from "./httpServer.js";
import { HttpIncomingRequest } from "./httpIncomingRequest.js";
import { HttpOutgoingResponse } from "./httpOutgoingResponse.js";
import { PreCondition } from "./preCondition.js";
import { AsyncResult } from "./asyncResult.js";
import { NodeJSHttpOutgoingResponse } from "./NodeJSHttpOutgoingResponse.js";
import { HttpIncomingRequestHandler } from "./HttpIncomingRequestHandler.js";
import { AddressInfo } from "net";
import { isString, isUndefinedOrNull } from "./types.js";
import { NotFoundError } from "./notFoundError.js";
import { ParseError } from "./ParseError.js";
import { escapeAndQuote } from "./strings.js";
import { NodeJSHttpIncomingRequest } from "./nodeJSHttpIncomingRequest.js";

/**
 * A {@link HttpServer} implementation that uses the Node.js HTTP module.
 */
export class NodeJSHttpServer extends HttpServer
{
    private httpServer: http.Server | undefined;
    private disposed: boolean;
    private defaultRequestHandler?: HttpIncomingRequestHandler;

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
                this.httpServer.once("close", (error?: Error) =>
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

                this.httpServer.close();
            }
        }));
    }

    public isDisposed(): boolean
    {
        return this.disposed;
    }

    public isListening(): boolean
    {
        return this.httpServer?.listening === true;
    }

    public getPortNumber(): number
    {
        PreCondition.assertTrue(this.isListening(), "this.isListening()");

        const addressInfoOrString: string | AddressInfo | null = this.httpServer!.address();
        if (isUndefinedOrNull(addressInfoOrString))
        {
            throw new NotFoundError("Couldn't get AddressInfo from NodeJSHttpServer.");
        }
        else if (isString(addressInfoOrString))
        {
            throw new ParseError(`Expected AddressInfo, but got string: ${escapeAndQuote(addressInfoOrString)}`);
        }

        return addressInfoOrString.port;
    }

    public addRequestHandler(_requestPath: string, _handler: (request: HttpIncomingRequest, response: HttpOutgoingResponse) => Promise<void>): void
    {
        throw new Error("Method not implemented.");
    }

    public setDefaultRequestHandler(handler: (request: HttpIncomingRequest, response: HttpOutgoingResponse) => Promise<void>): void
    {
        PreCondition.assertNotUndefinedAndNotNull(handler, "handler");

        this.defaultRequestHandler = handler;
    }

    /**
     * Start listening for incoming connections on the provided port number. The returned
     * {@link AsyncResult} will complete when the server is listening.
     * @param portNumber The port number to start listening on. If this is undefined then a random
     * port will be chosen instead.
     */
    public start(portNumber?: number): AsyncResult<void>
    {
        PreCondition.assertTrue(isUndefinedOrNull(portNumber) || portNumber >= 1, "isUndefinedOrNull(portNumber) || portNumber >= 1");
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

                this.httpServer.on("listening", () =>
                {
                    resolve();
                });

                this.httpServer.on("request", async (rawRequest: http.IncomingMessage, rawResponse: http.ServerResponse<http.IncomingMessage> & { req: http.IncomingMessage }) =>
                {
                    const httpRequest: NodeJSHttpIncomingRequest = NodeJSHttpIncomingRequest.create(rawRequest);
                    const httpResponse: NodeJSHttpOutgoingResponse = NodeJSHttpOutgoingResponse.create(rawResponse);

                    if (!isUndefinedOrNull(this.defaultRequestHandler))
                    {
                        await this.defaultRequestHandler(httpRequest, httpResponse);
                    }
                    else
                    {
                        httpResponse.setStatusCode(404).setBodyString("Unrecognized request");
                    }

                    await httpResponse.end();
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