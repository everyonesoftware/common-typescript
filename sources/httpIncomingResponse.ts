import { HttpHeader } from "./httpHeader";
import { HttpHeaders } from "./httpHeaders";
import { AsyncResult } from "./asyncResult";

/**
 * The response from a {@link HttpClient}'s sendRequest() method.
 */
export abstract class HttpIncomingResponse
{
    public abstract getStatusCode(): number;

    public abstract getHeaders(): AsyncResult<HttpHeaders>;

    public abstract getHeader(headerName: string): AsyncResult<HttpHeader>;

    public abstract getHeaderValue(headerName: string): AsyncResult<string>;

    public abstract getBody(): AsyncResult<string>;
}