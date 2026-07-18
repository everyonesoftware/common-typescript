import { AsyncResult } from "./asyncResult.js";
import { HttpHeader } from "./httpHeader.js";
import { HttpHeaders } from "./httpHeaders.js";
import { HttpIncomingRequest } from "./httpIncomingRequest.js";
import { HttpMethod, parseHttpMethod } from "./httpMethod.js";
import { Map } from "./map.js";
import { MutableMap } from "./mutableMap.js";
import { NotFoundError } from "./notFoundError.js";
import { PreCondition } from "./preCondition.js";
import { escapeAndQuote } from "./strings.js";
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
        return parseHttpMethod(this.request.method).await();
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

    public getHeaders(): SyncResult<HttpHeaders>
    {
        return SyncResult.value(HttpHeaders.create(Object.entries(this.request.headers).map(FetchHttpIncomingRequest.toHttpHeader)));
    }

    public getHeader(headerName: string): SyncResult<HttpHeader>
    {
        PreCondition.assertNotEmpty(headerName, "headerName");

        return SyncResult.create(() =>
        {
            let result: HttpHeader | undefined;

            const lowerHeaderName: string = headerName.toLowerCase();
            for (const header of Object.entries(this.request.headers))
            {
                if (header[0].toLowerCase() === lowerHeaderName)
                {
                    result = HttpHeader.create(header[0], FetchHttpIncomingRequest.toHttpHeaderValue(header[1]));
                    break;
                }
            }
            if (result === undefined)
            {
                throw new NotFoundError(`No header with the name ${escapeAndQuote(headerName)} found.`);
            }

            return result;
        });
    }
    public getHeaderValue(headerName: string): SyncResult<string>
    {
        PreCondition.assertNotEmpty(headerName, "headerName");

        return SyncResult.create(() =>
        {
            let result: string | undefined;

            const lowerHeaderName: string = headerName.toLowerCase();
            for (const header of Object.entries(this.request.headers))
            {
                if (header[0].toLowerCase() === lowerHeaderName)
                {
                    result = FetchHttpIncomingRequest.toHttpHeaderValue(header[1]);
                    break;
                }
            }
            if (result === undefined)
            {
                throw new NotFoundError(`No header with the name ${escapeAndQuote(headerName)} found.`);
            }

            return result;
        });
    }

    public getBody(): AsyncResult<string>
    {
        return AsyncResult.create(this.request.text());
    }
}