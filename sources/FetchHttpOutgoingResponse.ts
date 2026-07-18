import { FetchHttpClient } from "./fetchHttpClient.js";
import { HttpHeader } from "./httpHeader.js";
import { HttpHeaders } from "./httpHeaders.js";
import { HttpOutgoingResponse } from "./httpOutgoingResponse.js";
import { MutableHttpHeaders } from "./mutableHttpHeaders.js";
import { PreCondition } from "./preCondition.js";
import { SyncResult } from "./syncResult.js";

export class FetchHttpOutgoingResponse extends HttpOutgoingResponse
{
    private statusCode: number | undefined;
    private readonly headers: MutableHttpHeaders;
    private body: string | undefined;

    private constructor()
    {
        super();

        this.headers = MutableHttpHeaders.create();
    }

    public getResponse(): Response
    {
        let bodyInit: BodyInit | undefined = this.body;
        let responseInit: ResponseInit = {
            status: this.statusCode,
            headers: FetchHttpClient.convertHeaders(this.headers),
        };
        return new Response(bodyInit, responseInit);
    }

    public setStatusCode(statusCode: number): this
    {
        this.statusCode = statusCode;

        return this;
    }

    public getStatusCode(): number
    {
        PreCondition.assertNotUndefinedAndNotNull(this.statusCode, "this.statusCode");

        return this.statusCode;
    }

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

    public setBodyString(body: string): this
    {
        PreCondition.assertNotUndefinedAndNotNull(body, "body");

        this.body = body;

        return this;
    }

    public setBodyJSON(body: unknown): this
    {
        PreCondition.assertNotUndefinedAndNotNull(body, "body");

        return this.setBodyString(JSON.stringify(body));
    }
}