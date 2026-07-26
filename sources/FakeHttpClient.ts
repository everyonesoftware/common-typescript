import { FetchHttpIncomingResponse } from "./FetchHttpIncomingResponse.js";
import { HttpClient } from "./httpClient.js";
import { HttpIncomingResponse } from "./httpIncomingResponse.js";
import { HttpOutgoingRequest } from "./httpOutgoingRequest.js";
import { List } from "./list.js";
import { PreCondition } from "./preCondition.js";
import { SyncResult } from "./syncResult.js";
import { Iterable } from "./iterable.js";
import { HttpHeaders } from "./httpHeaders.js";
import { HttpMethod } from "./httpMethod.js";

export class FakeHttpClient extends HttpClient
{
    private readonly requests: List<HttpOutgoingRequest>;

    private constructor()
    {
        super();

        this.requests = List.create();
    }

    public static create(): FakeHttpClient
    {
        return new FakeHttpClient();
    }

    public getRequests(): Iterable<HttpOutgoingRequest>
    {
        return this.requests;
    }

    public sendRequest(request: HttpOutgoingRequest): SyncResult<HttpIncomingResponse>
    {
        PreCondition.assertNotUndefinedAndNotNull(request, "request");

        return SyncResult.create(() =>
        {
            this.requests.add(request.clone());

            return FetchHttpIncomingResponse.create(Response.json({}, {
                status: 200,
            }));
        });
    }

    public sendGetRequest(url: string, headers?: HttpHeaders): SyncResult<HttpIncomingResponse>
    {
        return this.sendRequest(HttpOutgoingRequest.create(HttpMethod.GET, url, headers));
    }
}