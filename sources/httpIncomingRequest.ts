import { HttpHeader } from "./httpHeader.js";
import { HttpHeaders } from "./httpHeaders.js";
import { HttpMethod } from "./httpMethod.js";
import { AsyncResult } from "./asyncResult.js";
import { NotFoundError } from "./notFoundError.js";

/**
 * A HTTP request that is received by a {@link HttpServer}.
 */
export abstract class HttpIncomingRequest
{
    /**
     * Get the {@link HttpMethod} of the request.
     */
    public abstract getMethod(): HttpMethod;

    public abstract getHost(): AsyncResult<string>;

    /**
     * Get the path component of the requested URL.
     */
    public abstract getURLPath(): string;

    /**
     * Get the {@link HttpHeaders} of this {@link HttpIncomingRequest}.
     */
    public abstract getHeaders(): AsyncResult<HttpHeaders>;

    /**
     * Get the {@link HttpHeader} with the provided name in this {@link HttpIncomingRequest}. If no
     * header exists with the provided name, then a {@link NotFoundError} will be returned.
     * @param headerName The name of the header to get.
     */
    public abstract getHeader(headerName: string): AsyncResult<HttpHeader>;

    /**
     * Get the value of the {@link HttpHeader} with the provided name in this
     * {@link HttpIncomingRequest}. If no header exists with the provided name, then a
     * {@link NotFoundError} will be returned.
     * @param headerName The name of the header value to get.
     */
    public abstract getHeaderValue(headerName: string): AsyncResult<string>;

    /**
     * Get the body of this {@link HttpIncomingRequest}.
     */
    public abstract getBody(): AsyncResult<string>;
}