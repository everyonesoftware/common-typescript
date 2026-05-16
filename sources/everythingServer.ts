import { CharacterWriteStream } from "./characterWriteStream";
import { CurrentProcess } from "./currentProcess";
import { HttpClient } from "./httpClient";
import { HttpIncomingRequest } from "./httpIncomingRequest";
import { HttpIncomingResponse } from "./httpIncomingResponse";
import { HttpOutgoingResponse } from "./httpOutgoingResponse";
import { HttpServer } from "./httpServer";
import { Network } from "./network";
import { AsyncResult } from "./asyncResult";

CurrentProcess.run(async (currentProcess: CurrentProcess) =>
{
    const output: CharacterWriteStream = currentProcess.getOutputWriteStream();
    await output.writeLine("Hello world!");

    const network: Network = currentProcess.getNetwork();

    const client: HttpClient = network.createHttpClient();
    const response: HttpIncomingResponse = await client.sendGetRequest("https://www.example.com");
    await output.writeLine(response.getStatusCode().toString());

    const server: HttpServer = network.createHttpServer();

    server.addRequestHandler("", (request: HttpIncomingRequest, response: HttpOutgoingResponse) =>
    {
        return AsyncResult.createSync(() =>
        {
            response.setStatusCode(200);
            response.setBody("Hello world!");
        });
    });

    await server.start(10101);
});