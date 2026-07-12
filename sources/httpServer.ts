import { Disposable } from "./disposable.js";
import { HttpIncomingRequest } from "./httpIncomingRequest.js";
import { HttpOutgoingResponse } from "./httpOutgoingResponse.js";
import { AsyncResult } from "./asyncResult.js";

export abstract class HttpServer implements Disposable
{
    public abstract dispose(): AsyncResult<boolean>;

    public abstract isDisposed(): boolean;

    /**
     * Add the provided request handler so it will be invoked when a request is received for the
     * provided path.
     * @param requestPath The path that will cause the provided handler to be invoked.
     * @param handler The function that will be invoked when the 
     */
    public abstract addRequestHandler(requestPath: string, handler: (request: HttpIncomingRequest, response: HttpOutgoingResponse) => AsyncResult<void>): void;

    /**
     * Set the default request handler that will be invoked when no other request handlers match an
     * {@link HttpIncomingRequest}.
     * @param handler The handler that will be invoked when no other request handlers match an
     * {@link HttpIncomingRequest}.
     */
    public abstract setDefaultRequestHandler(handler: (request: HttpIncomingRequest, response: HttpOutgoingResponse) => AsyncResult<void>): void;

    /**
     * Start listening for incoming connections on the provided port number. The returned
     * {@link AsyncResult} will complete when the server is disposed.
     * @param portNumber The port number to start listening on.
     */
    public abstract start(portNumber: number): AsyncResult<void>;
}