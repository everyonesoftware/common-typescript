import { HttpIncomingRequest } from "./httpIncomingRequest.js";
import * as http from "http";
import { PreCondition } from "./preCondition.js";
import { HttpHeader } from "./httpHeader.js";
import { HttpHeaders } from "./httpHeaders.js";
import { HttpMethod } from "./httpMethod.js";
import { NotFoundError } from "./notFoundError.js";
import { isArray } from "./types.js";
import { SyncResult } from "./syncResult.js";
import { Map } from "./map.js";
import { MutableMap } from "./mutableMap.js";
import { JSONData } from "./JSON.js";
import { MutableHttpHeaders } from "./mutableHttpHeaders.js";

export class NodeJSHttpIncomingRequest extends HttpIncomingRequest
{
    private readonly request: http.IncomingMessage;

    private constructor(request: http.IncomingMessage)
    {
        PreCondition.assertNotUndefinedAndNotNull(request, "request");

        super();

        this.request = request;
    }

    public static create(request: http.IncomingMessage): NodeJSHttpIncomingRequest
    {
        return new NodeJSHttpIncomingRequest(request);
    }

    public getMethod(): HttpMethod
    {
        return HttpMethod.parse(this.request.method!).await();
    }

    public getHost(): SyncResult<string>
    {
        return SyncResult.value(process.env.HOST ?? "localhost");
    }

    public getURL(): URL
    {
        return new URL(`http://${this.getHost().await()}${this.request.url}`);
    }

    public getPath(): string
    {
        return this.getURL().pathname;
    }

    public getQueryParameters(): Map<string, string>
    {
        const queryParameters: URLSearchParams = this.getURL().searchParams;

        const result: MutableMap<string, string> = MutableMap.create();
        for (const queryParameter of queryParameters)
        {
            result.set(queryParameter[0], queryParameter[1]);
        }
        return result;
    }

    private static toHttpHeader(header: [string, string | string[] | undefined]): HttpHeader
    {
        const headerName: string = header[0];
        const headerValue: string = this.toHttpHeaderValue(header[1]);
        return HttpHeader.create(headerName, headerValue);
    }

    private static toHttpHeaderValue(headerValue: string | string[] | undefined): string
    {
        let result: string | string[] | undefined = headerValue;
        if (result === undefined)
        {
            result = "";
        }
        else if (isArray(result))
        {
            result = result.join(",");
        }
        return result;
    }

    public getHeaders(): HttpHeaders
    {
        const result: MutableHttpHeaders = HttpHeaders.create();
        for (const header of Object.entries(this.request.headers))
        {
            result.set(NodeJSHttpIncomingRequest.toHttpHeader(header));
        }
        return result;
    }

    public getHeader(headerName: string): SyncResult<HttpHeader>
    {
        return HttpIncomingRequest.getHeader(this, headerName);
    }

    public getHeaderValue(headerName: string): SyncResult<string>
    {
        return HttpIncomingRequest.getHeaderValue(this, headerName);
    }

    public getBodyString(): SyncResult<string>
    {
        return SyncResult.create(() =>
        {
            throw new NotFoundError("Could not read the body from the incoming HTTP request.");
        });
    }

    public getBodyJSON(): SyncResult<JSONData>
    {
        return SyncResult.create(() =>
        {
            throw new NotFoundError("Could not read the body from the incoming HTTP request.");
        });
    }
}