import { HttpIncomingRequest } from "./httpIncomingRequest";
import * as http from "http";
import { PreCondition } from "./preCondition";
import { HttpHeader } from "./httpHeader";
import { HttpHeaders } from "./httpHeaders";
import { HttpMethod, parseHttpMethod } from "./httpMethod";
import { NotFoundError } from "./notFoundError";
import { isArray } from "./types";
import { escapeAndQuote } from "./strings";
import { SyncResult } from "./syncResult";
import { AsyncResult } from "./asyncResult";

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
        return parseHttpMethod(this.request.method!).await();
    }

    public getHost(): SyncResult<string>
    {
        return SyncResult.value(process.env.HOST ?? "localhost");
    }

    public getURLPath(): string
    {
        const url: URL = new URL(this.request.url!);
        return url.pathname;
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
        return SyncResult.value(HttpHeaders.create(Object.entries(this.request.headers).map(NodeJSHttpIncomingRequest.toHttpHeader)));
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
                    result = HttpHeader.create(header[0], NodeJSHttpIncomingRequest.toHttpHeaderValue(header[1]));
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
                    result = NodeJSHttpIncomingRequest.toHttpHeaderValue(header[1]);
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
        return AsyncResult.createSync(() =>
        {
            throw new NotFoundError("Could not read the body from the incoming HTTP request.");
        });
    }
}