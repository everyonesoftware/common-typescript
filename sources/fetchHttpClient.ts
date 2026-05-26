import { FetchHttpIncomingResponse } from "./fetchHttpResponse";
import { HttpClient } from "./httpClient";
import { HttpOutgoingRequest } from "./httpOutgoingRequest";
import { HttpHeader } from "./httpHeader";
import { HttpMethod } from "./httpMethod";
import { PostCondition } from "./postCondition";
import { PreCondition } from "./preCondition";
import { PromiseAsyncResult } from "./promiseAsyncResult";

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

    public sendRequest(request: HttpOutgoingRequest): PromiseAsyncResult<FetchHttpIncomingResponse>
    {
        PreCondition.assertNotUndefinedAndNotNull(request, "request");

        return PromiseAsyncResult.create(async () =>
        {
            const requestInit: RequestInit = {
                method: FetchHttpClient.convertMethod(request.getMethod()),
                headers: request.getHeaders()
                    .map<[string, string]>((header: HttpHeader) => [header.getName(), header.getValue()])
                    .toArray()
                    .await(),
                body: request.getBody() || undefined,
            };

            const fetchResponse: Response = await fetch(request.getURL(), requestInit);
            return FetchHttpIncomingResponse.create(fetchResponse);
        });
    }

    public sendGetRequest(url: string): PromiseAsyncResult<FetchHttpIncomingResponse>
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