import { HttpIncomingRequestHandler } from "./HttpIncomingRequestHandler.js";

export abstract class HttpServer
{
    /**
     * Add the provided request handler so it will be invoked when a request is received for the
     * provided path.
     * @param requestPath The path that will cause the provided handler to be invoked.
     * @param handler The function that will be invoked when the 
     */
    public abstract addRequestHandler(requestPath: string, handler: HttpIncomingRequestHandler): void;

    /**
     * Set the default request handler that will be invoked when no other request handlers match an
     * {@link HttpIncomingRequest}.
     * @param handler The handler that will be invoked when no other request handlers match an
     * {@link HttpIncomingRequest}.
     */
    public abstract setDefaultRequestHandler(handler: HttpIncomingRequestHandler): void;
}