import { HttpHeader } from "./httpHeader.js";
import { HttpHeaders } from "./httpHeaders.js";
import { HttpMethod } from "./httpMethod.js";
import { AsyncResult } from "./asyncResult.js";
import { Map } from "./map.js";
import { JSONData } from "./JSON.js";
import { PreCondition } from "./preCondition.js";
import { SyncResult } from "./syncResult.js";

/**
 * A HTTP request that is received by a {@link HttpServer}.
 */
export abstract class HttpIncomingRequest
{
    /**
     * Get the {@link HttpMethod} of the request.
     */
    public abstract getMethod(): HttpMethod;

    /**
     * Get the requested URL's host.
     */
    public abstract getHost(): AsyncResult<string>;

    /**
     * Get the requested URL's path.
     */
    public abstract getPath(): string;

    /**
     * Get the requested URL's query parameters.
     */
    public abstract getQueryParameters(): Map<string,string>;

    /**
     * Get the {@link HttpHeaders} of this {@link HttpIncomingRequest}.
     */
    public abstract getHeaders(): HttpHeaders;

    /**
     * Get the {@link HttpHeader} with the provided name in this {@link HttpIncomingRequest}. If no
     * header exists with the provided name, then a {@link NotFoundError} will be returned.
     * @param headerName The name of the header to get.
     */
    public getHeader(headerName: string): SyncResult<HttpHeader>
    {
        return HttpIncomingRequest.getHeader(this, headerName);
    }

    public static getHeader(request: HttpIncomingRequest, headerName: string): SyncResult<HttpHeader>
    {
        PreCondition.assertNotUndefinedAndNotNull(request, "request");

        return request.getHeaders().get(headerName);
    }

    /**
     * Get the value of the {@link HttpHeader} with the provided name in this
     * {@link HttpIncomingRequest}. If no header exists with the provided name, then a
     * {@link NotFoundError} will be returned.
     * @param headerName The name of the header value to get.
     */
    public getHeaderValue(headerName: string): SyncResult<string>
    {
        return HttpIncomingRequest.getHeaderValue(this, headerName);
    }

    public static getHeaderValue(request: HttpIncomingRequest, headerName: string): SyncResult<string>
    {
        PreCondition.assertNotUndefinedAndNotNull(request, "request");

        return request.getHeaders().getValue(headerName);
    }

    /**
     * Get the body of this {@link HttpIncomingRequest} as a string.
     */
    public abstract getBodyString(): AsyncResult<string>;

    /**
     * Get the body of this {@link HttpIncomingRequest} as a JSON value.
     */
    public abstract getBodyJSON(): AsyncResult<JSONData>;
}