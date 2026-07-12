import { FetchHttpClient } from "./fetchHttpClient.js";
import { HttpClient } from "./httpClient.js";
import { HttpServer } from "./httpServer.js";
import { Network } from "./network.js";
import { NodeJSHttpServer } from "./nodeJSHttpServer.js";

export class RealNetwork extends Network
{
    private constructor()
    {
        super();
    }

    public static create(): RealNetwork
    {
        return new RealNetwork();
    }

    public createHttpServer(): HttpServer
    {
        return NodeJSHttpServer.create();
    }

    public createHttpClient(): HttpClient
    {
        return FetchHttpClient.create();
    }
}