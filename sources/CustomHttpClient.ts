import { AsyncResult } from "./asyncResult.js";
import { HttpClient } from "./httpClient.js";
import { HttpIncomingResponse } from "./httpIncomingResponse.js";
import { HttpOutgoingRequest } from "./httpOutgoingRequest.js";
import { Logger } from "./Logger.js";
import { LoggingHttpClientOptions, LoggingHttpClient } from "./LoggingHttpClient.js";
import { PreCondition } from "./preCondition.js";

/**
 * A {@link HttpClient} that will invoke a provided function when it attempts to send a
 * {@link HttpOutgoingRequest}.
 */
export class CustomHttpClient implements HttpClient
{
    private readonly sendRequestFunction: (request: HttpOutgoingRequest) => Promise<HttpIncomingResponse>;
    
    private constructor(sendRequestFunction: (request: HttpOutgoingRequest) => Promise<HttpIncomingResponse>)
    {
        PreCondition.assertNotUndefinedAndNotNull(sendRequestFunction, "sendRequestFunction");

        this.sendRequestFunction = sendRequestFunction;
    }

    /**
     * Create a {@link CustomHttpClient} that will invoke the provided function to send a
     * {@link HttpOutgoingRequest}.
     * @param sendRequestFunction The function that will be invoked to send a
     * {@link HttpOutgoingRequest}.
     */
    public static create(sendRequestFunction: (request: HttpOutgoingRequest) => Promise<HttpIncomingResponse>): CustomHttpClient
    {
        return new CustomHttpClient(sendRequestFunction);
    }

    public logging(logger: Logger | undefined, options?: LoggingHttpClientOptions): LoggingHttpClient
    {
        return HttpClient.logging(this, logger, options);
    }

    public wrap(sendRequestFunction: (httpClient: HttpClient, request: HttpOutgoingRequest) => Promise<HttpIncomingResponse>): HttpClient
    {
        return HttpClient.wrap(this, sendRequestFunction);
    }

    public sendRequest(request: HttpOutgoingRequest): AsyncResult<HttpIncomingResponse>
    {
        return AsyncResult.create(this.sendRequestFunction(request));
    }

    public sendGetRequest(url: string): AsyncResult<HttpIncomingResponse>
    {
        return AsyncResult.create(HttpClient.sendGetRequest(this, url));
    }
}