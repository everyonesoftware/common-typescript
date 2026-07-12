import { AsyncResult } from "./asyncResult.js";
import { HttpIncomingRequest } from "./httpIncomingRequest.js";
import { HttpOutgoingResponse } from "./httpOutgoingResponse.js";

/**
 * A function that can handle {@link HttpIncomingRequest}s.
 */
export type HttpRequestHandler = (request: HttpIncomingRequest, response: HttpOutgoingResponse) => AsyncResult<void>;