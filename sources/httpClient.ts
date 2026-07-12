import { FetchHttpClient } from "./fetchHttpClient.js";
import { HttpOutgoingRequest } from "./httpOutgoingRequest.js";
import { HttpIncomingResponse } from "./httpIncomingResponse.js";
import { HttpMethod } from "./httpMethod.js";
import { AsyncResult } from "./asyncResult.js";

/**
 * An object that can make HTTP network requests.
 */
export abstract class HttpClient
{
    public static create(): HttpClient
    {
        return FetchHttpClient.create();
    }

    /**
     * Send the provided {@link HttpOutgoingRequest}.
     * @param request The {@link HttpOutgoingRequest} to send.
     */
    public abstract sendRequest(request: HttpOutgoingRequest): AsyncResult<HttpIncomingResponse>;

    /**
     * Send a GET {@link HttpOutgoingRequest} to the provided URL.
     * @param url The URL to send the GET {@link HttpOutgoingRequest} to.
     */
    public sendGetRequest(url: string): AsyncResult<HttpIncomingResponse>
    {
        return HttpClient.sendGetRequest(this, url);
    }

    public static sendGetRequest(httpClient: HttpClient, url: string): AsyncResult<HttpIncomingResponse>
    {
        return httpClient.sendRequest(HttpOutgoingRequest.create(HttpMethod.GET, url));
    }
}