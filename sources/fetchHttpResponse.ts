import { PromiseAsyncResult } from "./promiseAsyncResult";
import { HttpHeader } from "./httpHeader";
import { HttpHeaders } from "./httpHeaders";
import { HttpIncomingResponse } from "./httpIncomingResponse";
import { MutableHttpHeaders } from "./mutableHttpHeaders";
import { NotFoundError } from "./notFoundError";
import { PreCondition } from "./preCondition";
import { escapeAndQuote } from "./strings";
import { SyncResult } from "./syncResult";

/**
 * An {@link HttpIncomingResponse} that comes from a {@link FetchHttpClient}.
 */
export class FetchHttpIncomingResponse extends HttpIncomingResponse
{
    private readonly response: Response;

    private constructor(response: Response)
    {
        PreCondition.assertNotUndefinedAndNotNull(response, "response");

        super();

        this.response = response;
    }

    public static create(response: Response): FetchHttpIncomingResponse
    {
        return new FetchHttpIncomingResponse(response);
    }

    public getStatusCode(): number
    {
        return this.response.status;
    }

    public getHeaders(): SyncResult<HttpHeaders>
    {
        return SyncResult.create(() =>
        {
            const result: MutableHttpHeaders = HttpHeaders.create();
            for (const header of this.response.headers)
            {
                result.set(header[0], header[1]);
            }
            return result;
        });
    }

    public getHeader(headerName: string): SyncResult<HttpHeader>
    {
        PreCondition.assertNotEmpty(headerName, "headerName");

        return SyncResult.create(() =>
        {
            let result: HttpHeader | undefined;

            const lowerHeaderName: string = headerName.toLowerCase();
            for (const header of this.response.headers)
            {
                if (lowerHeaderName === header[0].toLowerCase())
                {
                    result = HttpHeader.create(header[0], header[1]);
                    break;
                }
            }
            if (result === undefined)
            {
                throw new NotFoundError(`Could not find a header with the name ${escapeAndQuote(headerName)}.`)
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
            for (const header of this.response.headers)
            {
                if (lowerHeaderName === header[0].toLowerCase())
                {
                    result = header[1];
                    break;
                }
            }
            if (result === undefined)
            {
                throw new NotFoundError(`Could not find a header with the name ${escapeAndQuote(headerName)}.`)
            }

            return result;
        });
    }

    public getBody(): PromiseAsyncResult<string>
    {
        return PromiseAsyncResult.create(this.response.text());
    }
}