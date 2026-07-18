import * as http from "http";
import { HttpOutgoingResponse } from "./httpOutgoingResponse.js";
import { PreCondition } from "./preCondition.js";
import { SyncResult } from "./syncResult.js";
import { HttpHeaders } from "./httpHeaders.js";
import { MutableHttpHeaders } from "./mutableHttpHeaders.js";
import { HttpHeader } from "./httpHeader.js";
import { isArray } from "./types.js";
import { escapeAndQuote, join } from "./strings.js";
import { NotFoundError } from "./notFoundError.js";
import { AsyncResult } from "./asyncResult.js";

export class NodeJSHttpOutgoingResponse implements HttpOutgoingResponse
{
    private readonly innerResponse: http.ServerResponse<http.IncomingMessage>;
    private bodyString: string | undefined;

    private constructor(innerResponse: http.ServerResponse<http.IncomingMessage>)
    {
        PreCondition.assertNotUndefinedAndNotNull(innerResponse, "innerResponse");

        this.innerResponse = innerResponse;
    }

    public static create(innerResponse : http.ServerResponse<http.IncomingMessage>): NodeJSHttpOutgoingResponse
    {
        return new NodeJSHttpOutgoingResponse(innerResponse);
    }

    public setStatusCode(statusCode: number): this
    {
        this.innerResponse.statusCode = statusCode;

        return this;
    }

    public getStatusCode(): number
    {
        return this.innerResponse.statusCode;
    }

    private static headerValueToString(headerValue: http.OutgoingHttpHeader): string
    {
        PreCondition.assertNotUndefinedAndNotNull(headerValue, "headerValue");

        return isArray(headerValue) ? join(",", headerValue) : headerValue.toString()
    }

    public getHeaders(): HttpHeaders
    {
        const result: MutableHttpHeaders = HttpHeaders.create()
        for (const rawHeader of Object.entries(this.innerResponse.getHeaders()))
        {
            const headerName: string = rawHeader[0];
            const headerValue: http.OutgoingHttpHeader | undefined = rawHeader[1];
            if (headerValue !== undefined)
            {
                result.set(headerName, NodeJSHttpOutgoingResponse.headerValueToString(headerValue));
            }
        }
        return result;
    }

    public getHeader(headerName: string): SyncResult<HttpHeader>
    {
        PreCondition.assertNotEmpty(headerName, "headerName");

        const headerValue: http.OutgoingHttpHeader | undefined = this.innerResponse.getHeader(headerName);
        return headerValue === undefined
            ? SyncResult.error(new NotFoundError(`No HTTP header value exists with the name ${escapeAndQuote(headerName)}.`))
            : SyncResult.value(HttpHeader.create(headerName, NodeJSHttpOutgoingResponse.headerValueToString(headerValue)));
    }

    public getHeaderValue(headerName: string): SyncResult<string>
    {
        const headerValue: http.OutgoingHttpHeader | undefined = this.innerResponse.getHeader(headerName);
        return headerValue === undefined
            ? SyncResult.error(new NotFoundError(`No HTTP header value exists with the name ${escapeAndQuote(headerName)}.`))
            : SyncResult.value(NodeJSHttpOutgoingResponse.headerValueToString(headerValue));
    }

    public setHeader(headerName: string, headerValue: string): this
    {
        PreCondition.assertNotEmpty(headerName, "headerName");
        PreCondition.assertNotUndefinedAndNotNull(headerValue, "headerValue");

        this.innerResponse.setHeader(headerName, headerValue);
        
        return this;
    }

    public setBodyString(body: string): this
    {
        PreCondition.assertNotUndefinedAndNotNull(body, "body");

        this.bodyString = body;

        return this;
    }

    public setBodyJSON(body: unknown): this
    {
        PreCondition.assertNotUndefinedAndNotNull(body, "body");

        return this.setBodyString(JSON.stringify(body));
    }

    public end(): AsyncResult<void>
    {
        return AsyncResult.create(new Promise<void>((resolve, reject) =>
        {
            this.innerResponse.end(this.bodyString, () =>
            {
                resolve();
            });
        }));
    }
}