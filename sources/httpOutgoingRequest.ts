import { HttpHeader } from "./httpHeader.js";
import { HttpHeaders } from "./httpHeaders.js";
import { HttpMethod } from "./httpMethod.js";
import { JavascriptIterable } from "./javascript.js";
import { MutableHttpHeaders } from "./mutableHttpHeaders.js";
import { PreCondition } from "./preCondition.js";
import { SyncResult } from "./syncResult.js";
import { isUndefinedOrNull } from "./types.js";

/**
 * A HTTP request that is sent out by a {@link HttpClient}.
 */
export class HttpOutgoingRequest
{
    private method: HttpMethod;
    private url: string;
    private readonly headers: MutableHttpHeaders;
    private body: string;

    private constructor(method: HttpMethod, url: string, headers?: HttpHeaders)
    {
        PreCondition.assertNotUndefinedAndNotNull(method, "method");
        PreCondition.assertNotEmpty(url, "url");

        this.method = method;
        this.url = url;
        this.headers = HttpHeaders.create();
        if (!isUndefinedOrNull(headers))
        {
            this.headers.setAll(headers);
        }
        this.body = "";
    }

    public static create(method: HttpMethod, url: string, headers?: HttpHeaders): HttpOutgoingRequest
    {
        return new HttpOutgoingRequest(method, url, headers);
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
     * Create a deep-copy of this {@link HttpOutgoingRequest}.
     */
    public clone(): HttpOutgoingRequest
    {
        return HttpOutgoingRequest.create(this.getMethod(), this.getURL())
            .setHeaders(this.getHeaders())
            .setBody(this.getBody());
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

    public setHeader(headerName: string, headerValue: string): this
    {
        this.headers.set(headerName, headerValue);

        return this;
    }

    public setHeaders(headers: JavascriptIterable<HttpHeader>): this
    {
        this.headers.setAll(headers);

        return this;
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

    /**
     * Get whether this {@link HttpOutgoingRequest} is equal to the provided
     * {@link HttpOutgoingRequest}.
     * @param rhs The {@link HttpOutgoingRequest} to compare against this
     * {@link HttpOutgoingRequest}.
     */
    public equals(rhs: HttpOutgoingRequest): boolean
    {
        let result: boolean = false;
        if (!isUndefinedOrNull(rhs))
        {
            result = this.getMethod() === rhs.getMethod() &&
                this.getURL() === rhs.getURL() &&
                this.getHeaders().equals(rhs.getHeaders()).await() &&
                this.getBody() === rhs.getBody();
        }
        return result;
    }
}