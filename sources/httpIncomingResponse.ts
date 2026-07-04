import { HttpHeader } from "./httpHeader";
import { HttpHeaders } from "./httpHeaders";
import { AsyncResult } from "./asyncResult";

/**
 * The response from a {@link HttpClient}'s sendRequest() method.
 */
export abstract class HttpIncomingResponse
{
    public abstract getStatusCode(): number;

    /**
     * Get the {@link HttpHeaders} of this {@link HttpIncomingResponse}.
     */
    public abstract getHeaders(): AsyncResult<HttpHeaders>;

    /**
     * Get the {@link HttpHeader} with the provided name in this {@link HttpIncomingResponse}. If no
     * header exists with the provided name, then a {@link NotFoundError} will be returned.
     * @param headerName The name of the header to get.
     */
    public abstract getHeader(headerName: string): AsyncResult<HttpHeader>;

    /**
     * Get the value of the {@link HttpHeader} with the provided name in this
     * {@link HttpIncomingResponse}. If no header exists with the provided name, then a
     * {@link NotFoundError} will be returned.
     * @param headerName The name of the header value to get.
     */
    public abstract getHeaderValue(headerName: string): AsyncResult<string>;

    public abstract getBody(): AsyncResult<string>;
}