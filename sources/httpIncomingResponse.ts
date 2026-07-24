import { HttpHeader } from "./httpHeader.js";
import { HttpHeaders } from "./httpHeaders.js";
import { AsyncResult } from "./asyncResult.js";
import { SyncResult } from "./syncResult.js";
import { PreCondition } from "./preCondition.js";

/**
 * The response from a {@link HttpClient}'s sendRequest() method.
 */
export abstract class HttpIncomingResponse
{
    public abstract getStatusCode(): number;

    public isStatusCodeOk(): boolean
    {
        return HttpIncomingResponse.isStatusCodeOk(this);
    }

    public static isStatusCodeOk(response: HttpIncomingResponse): boolean
    {
        PreCondition.assertNotUndefinedAndNotNull(response, "response");

        const statusCode: number = response.getStatusCode();
        return 200 <= statusCode && statusCode < 300;
    }

    /**
     * Get the {@link HttpHeaders} of this {@link HttpIncomingResponse}.
     */
    public abstract getHeaders(): HttpHeaders;

    /**
     * Get the {@link HttpHeader} with the provided name in this {@link HttpIncomingResponse}. If no
     * header exists with the provided name, then a {@link NotFoundError} will be returned.
     * @param headerName The name of the header to get.
     */
    public abstract getHeader(headerName: string): SyncResult<HttpHeader>;

    /**
     * Get the value of the {@link HttpHeader} with the provided name in this
     * {@link HttpIncomingResponse}. If no header exists with the provided name, then a
     * {@link NotFoundError} will be returned.
     * @param headerName The name of the header value to get.
     */
    public abstract getHeaderValue(headerName: string): SyncResult<string>;

    /**
     * Get the raw string of the body.
     */
    public abstract getBodyString(): AsyncResult<string>;

    /**
     * Get the body parsed as a JSON object.
     */
    public abstract getBodyJSON(): AsyncResult<unknown>;
}