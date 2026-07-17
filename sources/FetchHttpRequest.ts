import { AsyncResult } from "./asyncResult.js";
import { HttpHeader } from "./httpHeader.js";
import { HttpHeaders } from "./httpHeaders.js";
import { HttpIncomingRequest } from "./httpIncomingRequest.js";
import { HttpMethod, parseHttpMethod } from "./httpMethod.js";
import { NotFoundError } from "./notFoundError.js";
import { PreCondition } from "./preCondition.js";
import { escapeAndQuote } from "./strings.js";
import { SyncResult } from "./syncResult.js";
import { isArray } from "./types.js";

export class FetchHttpRequest implements HttpIncomingRequest
{
    private readonly request: Request;

    private constructor(request: Request)
    {
        PreCondition.assertNotUndefinedAndNotNull(request, "request");

        this.request = request;
    }

    public static create(request: Request): FetchHttpRequest
    {
        return new FetchHttpRequest(request);
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

    public getURLPath(): string
    {
        const requestUrl: URL = new URL(this.request.url);
        return requestUrl.pathname;
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
        return SyncResult.value(HttpHeaders.create(Object.entries(this.request.headers).map(FetchHttpRequest.toHttpHeader)));
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
                    result = HttpHeader.create(header[0], FetchHttpRequest.toHttpHeaderValue(header[1]));
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
                    result = FetchHttpRequest.toHttpHeaderValue(header[1]);
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