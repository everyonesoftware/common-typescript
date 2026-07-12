import { HttpHeader } from "./httpHeader.js";
import { HttpHeaders } from "./httpHeaders.js";
import { HttpMethod } from "./httpMethod.js";
import { MutableHttpHeaders } from "./mutableHttpHeaders.js";
import { PreCondition } from "./preCondition.js";
import { SyncResult } from "./syncResult.js";

/**
 * A HTTP request that is sent out by a {@link HttpClient}.
 */
export class HttpOutgoingRequest
{
    private method: HttpMethod;
    private url: string;
    private readonly headers: MutableHttpHeaders;
    private body: string;

    private constructor(method: HttpMethod, url: string)
    {
        PreCondition.assertNotUndefinedAndNotNull(method, "method");
        PreCondition.assertNotEmpty(url, "url");

        this.method = method;
        this.url = url;
        this.headers = HttpHeaders.create();
        this.body = "";
    }

    public static create(method: HttpMethod, url: string): HttpOutgoingRequest
    {
        return new HttpOutgoingRequest(method, url);
    }

    /**
     * Create a new {@link HttpOutgoingRequest} with a GET {@link HttpMethod}.
     * @param url The target URL for the {@link HttpOutgoingRequest}.
     */
    public static get(url: string): HttpOutgoingRequest
    {
        return HttpOutgoingRequest.create(HttpMethod.GET, url);
    }

    /**
     * Get the {@link HttpMethod} for this {@link HttpOutgoingRequest}.
     */
    public getMethod(): HttpMethod
    {
        return this.method;
    }

    /**
     * Set the {@link HttpMethod} for this {@link HttpOutgoingRequest}.
     * @param method The {@link HttpMethod} for this {@link HttpOutgoingRequest}.
     */
    public setMethod(method: HttpMethod): this
    {
        PreCondition.assertNotUndefinedAndNotNull(method, "method");

        this.method = method;

        return this;
    }

    /**
     * Get this {@link HttpOutgoingRequest}'s target URL.
     */
    public getURL(): string
    {
        return this.url;
    }

    /**
     * Set the URL that this request will be sent to.
     * @param url The URL to send this request to.
     */
    public setURL(url: string): this
    {
        PreCondition.assertNotEmpty(url, "url");

        this.url = url;

        return this;
    }

    /**
     * Get the {@link HttpHeaders} that will be sent.
     */
    public getHeaders(): HttpHeaders
    {
        return this.headers;
    }

    public getHeader(headerName: string): SyncResult<HttpHeader>
    {
        return this.headers.get(headerName);
    }

    public getHeaderValue(headerName: string): SyncResult<string>
    {
        return this.headers.getValue(headerName);
    }

    /**
     * Get the body that will be sent.
     */
    public getBody(): string
    {
        return this.body;
    }

    public setBody(body: string): this
    {
        PreCondition.assertNotUndefinedAndNotNull(body, "body");

        this.body = body;

        return this;
    }
}