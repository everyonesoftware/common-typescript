import { HttpClient } from "./httpClient.js";
import { HttpServer } from "./httpServer.js";

/**
 * An object that provides access to the network.
 */
export abstract class Network
{
    /**
     * Create a new {@link HttpServer} that is connected to this {@link Network}.
     */
    public abstract createHttpServer(): HttpServer;

    /**
     * Create a new {@link HttpClient} that is connected to this {@link Network}.
     */
    public abstract createHttpClient(): HttpClient;
}