import { AsyncResult } from "./asyncResult.js";
import { HttpHeader } from "./httpHeader.js";
import { HttpHeaders } from "./httpHeaders.js";
import { HttpIncomingRequest } from "./httpIncomingRequest.js";
import { HttpMethod } from "./httpMethod.js";
import { JSONData } from "./JSON.js";
import { Map } from "./map.js";
import { MutableHttpHeaders } from "./mutableHttpHeaders.js";
import { MutableMap } from "./mutableMap.js";
import { PreCondition } from "./preCondition.js";
import { SyncResult } from "./syncResult.js";
import { isArray } from "./types.js";

/**
 * An {@link HttpIncomingRequest} that can be used with servers that support the Fetch API.
 */
export class FetchHttpIncomingRequest implements HttpIncomingRequest
{
    private readonly request: Request;

    private constructor(request: Request)
    {
        PreCondition.assertNotUndefinedAndNotNull(request, "request");

        this.request = request;
    }

    public static create(request: Request): FetchHttpIncomingRequest
    {
        return new FetchHttpIncomingRequest(request);
    }

    public getMethod(): HttpMethod
    {
        return HttpMethod.parse(this.request.method).await();
    }

    public getHost(): SyncResult<string>
    {
        const requestUrl: URL = new URL(this.request.url);
        return SyncResult.value(requestUrl.hostname);
    }

    public getPath(): string
    {
        const requestUrl: URL = new URL(this.request.url);
        return requestUrl.pathname;
    }

    public getQueryParameters(): Map<string, string>
    {
        const requestUrl: URL = new URL(this.request.url);
        const queryParameters: URLSearchParams = requestUrl.searchParams;

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
        for (const header of this.request.headers)
        {
            result.set(FetchHttpIncomingRequest.toHttpHeader(header));
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

    public getBodyString(): AsyncResult<string>
    {
        return AsyncResult.create(this.request.text());
    }

    public getBodyJSON(): AsyncResult<JSONData>
    {
        return AsyncResult.create(this.request.json());
    }
}