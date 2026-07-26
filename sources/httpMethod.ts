import { NotFoundError } from "./notFoundError.js";
import { PreCondition } from "./preCondition.js";
import { SyncResult } from "./syncResult.js";

export class HttpMethod
{
    private readonly name: string;

    private constructor(name: string)
    {
        PreCondition.assertNotEmpty(name, "name");

        this.name = name;
    }

    private static create(name: string): HttpMethod
    {
        return new HttpMethod(name);
    }

    /**
     * Parse a {@link HttpMethod} from the provided text.
     * @param text The text to parse.
     */
    public static parse(text: string): SyncResult<HttpMethod>
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

    public getName(): string
    {
        return this.name;
    }

    public toString(): string
    {
        return this.getName();
    }

    /**
     * The GET method requests a representation of the specified resource. Requests using GET should
     * only retrieve data and should not contain a request content.
     * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Methods/GET
     */
    public static readonly GET = HttpMethod.create("GET");
    /**
     * The HEAD method asks for a response identical to a GET request, but without a response body.
     * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Methods/HEAD
     */
    public static readonly HEAD = HttpMethod.create("HEAD");
    /**
     * The POST method submits an entity to the specified resource, often causing a change in state
     * or side effects on the server.
     * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Methods/POST
     */
    public static readonly POST = HttpMethod.create("POST");
    /**
     * The PUT method replaces all current representations of the target resource with the request
     * content.
     * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Methods/PUT
     */
    public static readonly PUT = HttpMethod.create("PUT");
    /**
     * The DELETE method deletes the specified resource.
     * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Methods/DELETE
     */
    public static readonly DELETE = HttpMethod.create("DELETE");
    /**
     * The CONNECT method establishes a tunnel to the server identified by the target resource.
     * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Methods/CONNECT
     */
    public static readonly CONNECT = HttpMethod.create("CONNECT");
    /**
     * The OPTIONS method describes the communication options for the target resource.
     * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Methods/OPTIONS
     */
    public static readonly OPTIONS = HttpMethod.create("OPTIONS");
    /**
     * The TRACE method performs a message loop-back test along the path to the target resource.
     * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Methods/TRACE
     */
    public static readonly TRACE = HttpMethod.create("TRACE");
    /**
     * The PATCH method applies partial modifications to a resource.
     * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Methods/PATCH
     */
    public static readonly PATCH = HttpMethod.create("PATCH");
}