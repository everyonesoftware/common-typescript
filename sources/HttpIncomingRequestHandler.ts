import { HttpIncomingRequest } from "./httpIncomingRequest.js";
import { HttpOutgoingResponse } from "./httpOutgoingResponse.js";

/**
 * A function that can handle {@link HttpIncomingRequest}s.
 */
export type HttpIncomingRequestHandler = (request: HttpIncomingRequest, response: HttpOutgoingResponse) => PromiseLike<void>;