import { AsyncResult } from "./asyncResult";
import { HttpHeader } from "./httpHeader";
import { HttpHeaders } from "./httpHeaders";
import { SyncResult } from "./syncResult";

/**
 * A HTTP response sent by a HTTP server.
 */
export abstract class HttpOutgoingResponse
{
    /**
     * Set the status code of this {@link HttpOutgoingResponse}.
     * @param statusCode The status code to set.
     */
    public abstract setStatusCode(statusCode: number): this;

    /**
     * Get whether this {@link HttpOutgoingResponse} has a status code yet.
     */
    public abstract hasStatusCode(): boolean;

    /**
     * Get the status code.
     */
    public abstract getStatusCode(): number;

    /**
     * Get the {@link HttpHeaders} of this {@link HttpOutgoingResponse}.
     */
    public abstract getHeaders(): HttpHeaders;

    /**
     * Get the {@link HttpHeader} with the provided name in this {@link HttpOutgoingResponse}. If no
     * header exists with the provided name, then a {@link NotFoundError} will be returned.
     * @param headerName The name of the header to get.
     */
    public abstract getHeader(headerName: string): SyncResult<HttpHeader>;

    /**
     * Get the value of the {@link HttpHeader} with the provided name in this
     * {@link HttpOutgoingResponse}. If no header exists with the provided name, then a
     * {@link NotFoundError} will be returned.
     * @param headerName The name of the header value to get.
     */
    public abstract getHeaderValue(headerName: string): SyncResult<string>;

    public abstract setHeader(headerName: string, headerValue: string): this;

    /**
     * Set the body of this {@link HttpOutgoingResponse} to be the provided string value.
     * @param body The string body to set.
     */
    public abstract setBodyString(body: string): this;

    /**
     * Set the body of this {@link HttpOutgoingResponse} to be the provided JSON value.
     * @param body The JSON body to set.
     */
    public abstract setBodyJSON(body: unknown): this;
}