import { AsyncResult } from "./asyncResult.js";
import { HttpClient } from "./httpClient.js";
import { HttpClientDecorator } from "./HttpClientDecorator.js";
import { HttpIncomingResponse } from "./httpIncomingResponse.js";
import { HttpOutgoingRequest } from "./httpOutgoingRequest.js";
import { Logger } from "./Logger.js";
import { ToStringFunctions } from "./toStringFunctions.js";
import { isBoolean, isFunction, isUndefinedOrNull } from "./types.js";

/**
 * Options that can be used to specify how a {@link LoggingHttpClient} will log
 * {@link HttpOutgoingRequest}s.
 */
export interface LoggingHttpClientRequestOptions
{
    readonly method?: boolean;
    readonly url?: boolean;
    readonly headers?: boolean;
    readonly body?: boolean;
}

/**
 * Options that can be used to specify how a {@link LoggingHttpClient} will log
 * {@link HttpIncomingResponse}s.
 */
export interface LoggingHttpClientResponseOptions
{
    readonly statusCode?: boolean;
    readonly headers?: boolean;
    readonly body?: boolean;
}

/**
 * Options that can be use to specify how the {@link LoggingHttpClient} will log
 * {@link HttpOutgoingRequest}s and {@link HttpIncomingResponse}s.
 */
export interface LoggingHttpClientOptions
{
    /**
     * Options that define how a {@link HttpOutgoingRequest} will be logged or a function that will
     * be used to convert the {@link HttpOutgoingRequest} to a string that will be logged. If the
     * returned string is falsy then the {@link HttpOutgoingRequest} will not be logged.
     */
    readonly logRequest?: boolean | LoggingHttpClientRequestOptions | ((request: HttpOutgoingRequest, logger?: Logger) => (string | null | undefined));

    /**
     * Options that define how a {@link HttpIncomingResponse} will be logged or a function that will
     * be used to convert the {@link HttpIncomingResponse} to a string that will be logged. If the
     * returned string is falsy then the {@link HttpIncomingResponse} will not be logged.
     */
    readonly logResponse?: boolean | LoggingHttpClientResponseOptions | ((response: HttpIncomingResponse, logger?: Logger) => (string | null | undefined));
}

/**
 * A {@link HttpClient} that logs {@link HttpOutgoingRequest}s and {@link HttpIncomingResponse}s.
 */
export class LoggingHttpClient extends HttpClientDecorator
{
    private readonly logger: Logger | undefined;
    private readonly options: LoggingHttpClientOptions | undefined;
    private readonly toStringFunctions: ToStringFunctions;

    protected constructor(innerClient: HttpClient, logger: Logger | undefined, options?: LoggingHttpClientOptions)
    {
        super(innerClient);

        this.logger = logger;
        this.options = options;
        this.toStringFunctions = ToStringFunctions.create();
    }

    public static create(innerClient: HttpClient, logger: Logger | undefined, options?: LoggingHttpClientOptions): LoggingHttpClient
    {
        return new LoggingHttpClient(innerClient, logger, options);
    }

    public sendRequest(request: HttpOutgoingRequest): AsyncResult<HttpIncomingResponse>
    {
        return AsyncResult.create(async () =>
        {
            if (!isUndefinedOrNull(this.logger))
            {
                if (isBoolean(this.options?.logRequest))
                {
                    if (this.options.logRequest === true)
                    {
                        this.logger.info(this.toStringFunctions.toString(request));
                    }
                }
                else if (isFunction(this.options?.logRequest))
                {
                    this.options.logRequest(request, this.logger);
                }
                else
                {
                    let requestData: any = {};
                    let shouldLog: boolean = false;
                    if (this.options?.logRequest?.method !== false)
                    {
                        requestData.method = request.getMethod().toString();
                        shouldLog = true;
                    }
                    if (this.options?.logRequest?.url !== false)
                    {
                        requestData.url = request.getURL();
                        shouldLog = true;
                    }
                    if (this.options?.logRequest?.headers === true)
                    {
                        requestData.headers = request.getHeaders();
                        shouldLog = true;
                    }
                    if (this.options?.logRequest?.body === true)
                    {
                        const requestBody: string = request.getBodyString();
                        if (requestBody.length > 0)
                        {
                            requestData.body = requestBody;
                            shouldLog = true;
                        }
                    }

                    if (shouldLog)
                    {
                        this.logger.info(this.toStringFunctions.toString(requestData));
                    }
                }
            }

            const response: HttpIncomingResponse = await super.sendRequest(request);

            // if (!isUndefinedOrNull(this.logger))
            // {
            //     this.logger.info(this.toStringFunctions.toString(response));
            // }

            return response;
        });
    }
}