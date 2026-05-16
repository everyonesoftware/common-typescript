import { HttpHeader } from "./httpHeader";
import { HttpHeaders } from "./httpHeaders";
import { HttpMethod } from "./httpMethod";
import { AsyncResult } from "./asyncResult";

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

    public abstract getHeaders(): AsyncResult<HttpHeaders>;

    public abstract getHeader(headerName: string): AsyncResult<HttpHeader>;

    public abstract getHeaderValue(headerName: string): AsyncResult<string>;

    public abstract getBody(): AsyncResult<string>;
}