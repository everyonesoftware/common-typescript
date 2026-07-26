import { AsyncResult } from "./asyncResult.js";
import { HttpClient } from "./httpClient.js";
import { HttpHeaders } from "./httpHeaders.js";
import { HttpIncomingResponse } from "./httpIncomingResponse.js";
import { HttpOutgoingRequest } from "./httpOutgoingRequest.js";
import { Logger } from "./Logger.js";
import { LoggingHttpClientOptions, LoggingHttpClient } from "./LoggingHttpClient.js";
import { PreCondition } from "./preCondition.js";

/**
 * A {@link HttpClient} that wraps around another {@link HttpClient}.
 */
export class HttpClientDecorator implements HttpClient
{
    private readonly innerClient: HttpClient;

    protected constructor(innerClient: HttpClient)
    {
        PreCondition.assertNotUndefinedAndNotNull(innerClient, "innerClient");

        this.innerClient = innerClient;
    }

    public logging(logger: Logger | undefined, options?: LoggingHttpClientOptions): LoggingHttpClient
    {
        return HttpClient.logging(this, logger, options);
    }

    public sendRequest(request: HttpOutgoingRequest): AsyncResult<HttpIncomingResponse>
    {
        return this.innerClient.sendRequest(request);
    }

    public sendGetRequest(url: string, headers?: HttpHeaders): AsyncResult<HttpIncomingResponse>
    {
        return HttpClient.sendGetRequest(this, url, headers);
    }
}