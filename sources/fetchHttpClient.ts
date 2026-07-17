import { FetchHttpResponse } from "./FetchHttpResponse.js";
import { HttpClient } from "./httpClient.js";
import { HttpOutgoingRequest } from "./httpOutgoingRequest.js";
import { HttpHeader } from "./httpHeader.js";
import { HttpMethod } from "./httpMethod.js";
import { PostCondition } from "./postCondition.js";
import { PreCondition } from "./preCondition.js";
import { AsyncResult } from "./asyncResult.js";
import { FetchError } from "./FetchError.js";

/**
 * A {@link HttpClient} that uses {@link fetch}() to make network requests.
 */
export class FetchHttpClient implements HttpClient
{
    protected constructor()
    {
    }

    public static create(): FetchHttpClient
    {
        return new FetchHttpClient();
    }

    public sendRequest(request: HttpOutgoingRequest): AsyncResult<FetchHttpResponse>
    {
        PreCondition.assertNotUndefinedAndNotNull(request, "request");

        return AsyncResult.create(async () =>
        {
            const fetchURL: string = request.getURL();
            const fetchMethod: string = FetchHttpClient.convertMethod(request.getMethod());
            const fetchHeaders: [string, string][] = request.getHeaders()
                .map<[string, string]>((header: HttpHeader) => [header.getName(), header.getValue()])
                .toArray()
                .await()
            const fetchBody: string | undefined = request.getBody() || undefined;
            const requestInit: RequestInit = {
                method: fetchMethod,
                headers: fetchHeaders,
                body: fetchBody,
            };

            let result: FetchHttpResponse;
            try
            {
                const fetchResponse: Response = await fetch(fetchURL, requestInit);
                result = FetchHttpResponse.create(fetchResponse);
            }
            catch (error)
            {
                if (error instanceof Error &&
                    error.cause instanceof Error)
                {
                    throw new FetchError(error.cause);
                }
                throw error;
            }

            return result;
        });
    }

    public sendGetRequest(url: string): AsyncResult<FetchHttpResponse>
    {
        return this.sendRequest(HttpOutgoingRequest.create(HttpMethod.GET, url));
    }

    public static convertMethod(method: HttpMethod): string
    {
        PreCondition.assertNotUndefinedAndNotNull(method, "method");

        let result: string;
        switch (method)
        {
            case HttpMethod.CONNECT:
                result = "CONNECT";
                break;
            case HttpMethod.DELETE:
                result = "DELETE";
                break;
            case HttpMethod.GET:
                result = "GET";
                break;
            case HttpMethod.HEAD:
                result = "HEAD";
                break;
            case HttpMethod.OPTIONS:
                result = "OPTIONS";
                break;
            case HttpMethod.PATCH:
                result = "PATCH";
                break;
            case HttpMethod.POST:
                result = "POST";
                break;
            case HttpMethod.PUT:
                result = "PUT";
                break;
            case HttpMethod.TRACE:
                result = "TRACE";
                break;
        }

        PostCondition.assertNotEmpty(result, "result");

        return result;
    }
}