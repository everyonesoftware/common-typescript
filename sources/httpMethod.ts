import { NotFoundError } from "./notFoundError.js";
import { PreCondition } from "./preCondition.js";
import { SyncResult } from "./syncResult.js";

export enum HttpMethod
{
    /**
     * The GET method requests a representation of the specified resource. Requests using GET should
     * only retrieve data and should not contain a request content.
     * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Methods/GET
     */
    GET,
    /**
     * The HEAD method asks for a response identical to a GET request, but without a response body.
     * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Methods/HEAD
     */
    HEAD,
    /**
     * The POST method submits an entity to the specified resource, often causing a change in state
     * or side effects on the server.
     * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Methods/POST
     */
    POST,
    /**
     * The PUT method replaces all current representations of the target resource with the request
     * content.
     * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Methods/PUT
     */
    PUT,
    /**
     * The DELETE method deletes the specified resource.
     * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Methods/DELETE
     */
    DELETE,
    /**
     * The CONNECT method establishes a tunnel to the server identified by the target resource.
     * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Methods/CONNECT
     */
    CONNECT,
    /**
     * The OPTIONS method describes the communication options for the target resource.
     * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Methods/OPTIONS
     */
    OPTIONS,
    /**
     * The TRACE method performs a message loop-back test along the path to the target resource.
     * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Methods/TRACE
     */
    TRACE,
    /**
     * The PATCH method applies partial modifications to a resource.
     * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Methods/PATCH
     */
    PATCH,
}

/**
 * Parse a {@link HttpMethod} from the provided text.
 * @param text The text to parse.
 */
export function parseHttpMethod(text: string): SyncResult<HttpMethod>
{
    return SyncResult.create(() =>
    {
        let result: HttpMethod;

        switch (text.toUpperCase())
        {
            case "GET":
                result = HttpMethod.GET;
                break;

            case "HEAD":
                result = HttpMethod.HEAD;
                break;

            case "POST":
                result = HttpMethod.POST;
                break;

            case "PUT":
                result = HttpMethod.PUT;
                break;

            case "DELETE":
                result = HttpMethod.DELETE;
                break;

            case "CONNECT":
                result = HttpMethod.CONNECT;
                break;

            case "OPTIONS":
                result = HttpMethod.OPTIONS;
                break;

            case "TRACE":
                result = HttpMethod.TRACE;
                break;

            case "PATCH":
                result = HttpMethod.PATCH;
                break;

            default:
                throw new NotFoundError(`No HttpMethod exists for the text "${text}".`);
        }

        return result;
    });
}

/**
 * Get the string representation of the provided {@link HttpMethod}.
 * @param httpMethod The {@link HttpMethod} to get the string representation of.
 */
export function httpMethodToString(httpMethod: HttpMethod): string
{
    PreCondition.assertNotUndefinedAndNotNull(httpMethod, "httpMethod");

    let result: string;
    switch (httpMethod)
    {
        case HttpMethod.GET:
            result = "GET";
            break;

        case HttpMethod.HEAD:
            result = "HEAD";
            break;

        case HttpMethod.POST:
            result = "POST";
            break;

        case HttpMethod.PUT:
            result = "PUT";
            break;

        case HttpMethod.DELETE:
            result = "DELETE";
            break;

        case HttpMethod.CONNECT:
            result = "CONNECT";
            break;

        case HttpMethod.OPTIONS:
            result = "OPTIONS";
            break;

        case HttpMethod.TRACE:
            result = "TRACE";
            break;

        case HttpMethod.PATCH:
            result = "PATCH";
            break;

        default:
            throw new NotFoundError(`Unrecognized HttpMethod: ${httpMethod}`);
    }
    return result;
}