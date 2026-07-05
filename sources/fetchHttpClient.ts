import { FetchHttpIncomingResponse } from "./fetchHttpResponse";
import { HttpClient } from "./httpClient";
import { HttpOutgoingRequest } from "./httpOutgoingRequest";
import { HttpHeader } from "./httpHeader";
import { HttpMethod } from "./httpMethod";
import { PostCondition } from "./postCondition";
import { PreCondition } from "./preCondition";
import { AsyncResult } from "./asyncResult";
import { FetchError } from "./FetchError";

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

    public sendRequest(request: HttpOutgoingRequest): AsyncResult<FetchHttpIncomingResponse>
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

            let result: FetchHttpIncomingResponse;
            try
            {
                const fetchResponse: Response = await fetch(fetchURL, requestInit);
                result = FetchHttpIncomingResponse.create(fetchResponse);
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

    public sendGetRequest(url: string): AsyncResult<FetchHttpIncomingResponse>
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