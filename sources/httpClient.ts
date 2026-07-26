import { FetchHttpClient } from "./fetchHttpClient.js";
import { HttpOutgoingRequest } from "./httpOutgoingRequest.js";
import { HttpIncomingResponse } from "./httpIncomingResponse.js";
import { HttpMethod } from "./httpMethod.js";
import { AsyncResult } from "./asyncResult.js";
import { HttpHeaders } from "./httpHeaders.js";
import { CustomHttpClient } from "./CustomHttpClient.js";
import { isUndefinedOrNull } from "./types.js";
import { LoggingHttpClient, LoggingHttpClientOptions } from "./LoggingHttpClient.js";
import { Logger } from "./Logger.js";

/**
 * An object that can make HTTP network requests.
 */
export abstract class HttpClient
{
    /**
     * Create the default HttpClient.
     */
    public static create(): HttpClient
    {
        return FetchHttpClient.create();
    }

    /**
     * Wrap this {@link HttpClient} in a {@link LoggingHttpClient}.
     * @param logger The {@link Logger} that logs will be sent to.
     * @param options The {@link LoggingHttpClientOptions} that define which logs should be emitted.
     */
    public logging(logger: Logger | undefined, options?: LoggingHttpClientOptions): LoggingHttpClient
    {
        return HttpClient.logging(this, logger, options);
    }

    /**
     * Wrap the provided {@link HttpClient} in a {@link LoggingHttpClient}.
     * @param logger The {@link Logger} that logs will be sent to.
     * @param options The {@link LoggingHttpClientOptions} that define which logs should be emitted.
     */
    public static logging(httpClient: HttpClient, logger: Logger | undefined, options?: LoggingHttpClientOptions): LoggingHttpClient
    {
        return LoggingHttpClient.create(httpClient, logger, options);
    }

    /**
     * Wrap this {@link HttpClient} in a {@link CustomHttpClient} that will invoke the provided
     * function when attempting to send a {@link HttpOutgoingRequest}.
     * @param sendRequestFunction The function to invoke when attempting to send a
     * {@link HttpOutgoingRequest}.
     */
    public wrap(sendRequestFunction: (httpClient: HttpClient, request: HttpOutgoingRequest) => Promise<HttpIncomingResponse>): HttpClient
    {
        return HttpClient.wrap(this, sendRequestFunction);
    }

    public static wrap(httpClient: HttpClient, sendRequestFunction: (httpClient: HttpClient, request: HttpOutgoingRequest) => Promise<HttpIncomingResponse>): HttpClient
    {
        return CustomHttpClient.create((request: HttpOutgoingRequest) =>
        {
            return sendRequestFunction(httpClient, request);
        });
    }

    /**
     * Send the provided {@link HttpOutgoingRequest}.
     * @param request The {@link HttpOutgoingRequest} to send.
     */
    public abstract sendRequest(request: HttpOutgoingRequest): AsyncResult<HttpIncomingResponse>;

    /**
     * Send a GET {@link HttpOutgoingRequest} to the provided URL.
     * @param url The URL to send the GET {@link HttpOutgoingRequest} to.
     */
    public sendGetRequest(url: string, headers?: HttpHeaders): AsyncResult<HttpIncomingResponse>
    {
        return HttpClient.sendGetRequest(this, url, headers);
    }

    public static sendGetRequest(httpClient: HttpClient, url: string, headers?: HttpHeaders): AsyncResult<HttpIncomingResponse>
    {
        const request: HttpOutgoingRequest = HttpOutgoingRequest.create(HttpMethod.GET, url);
        if (!isUndefinedOrNull(headers))
        {
            request.setHeaders(headers);
        }
        return httpClient.sendRequest(request);
    }
}