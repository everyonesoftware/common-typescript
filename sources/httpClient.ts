import { FetchHttpClient } from "./fetchHttpClient";
import { HttpOutgoingRequest } from "./httpOutgoingRequest";
import { HttpIncomingResponse } from "./httpIncomingResponse";
import { HttpMethod } from "./httpMethod";
import { AsyncResult } from "./asyncResult";

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