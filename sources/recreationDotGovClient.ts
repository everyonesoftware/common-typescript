import { DateTime } from "./dateTime.js";
import { HttpClient } from "./httpClient.js";
import { HttpIncomingResponse } from "./httpIncomingResponse.js";
import { HttpOutgoingRequest } from "./httpOutgoingRequest.js";
import { Iterable } from "./iterable.js";
import { List } from "./list.js";
import { PreCondition } from "./preCondition.js";
import { AsyncResult } from "./asyncResult.js";
import { HttpHeaders } from "./httpHeaders.js";
import { BaseError } from "./BaseError.js";

export interface RecreationDotGovDivisionDayAvailability
{
    readonly date: DateTime;

    readonly walkup: boolean;

    readonly reservationsRemaining: number;

    readonly totalSpots: number;
}

export interface RecreationDotGovDivisionAvailabilityJson
{
    readonly bools: { [date: string]: boolean };

    readonly rules: {
        readonly name: string;
        readonly value: number;
    }[];

    readonly quota_type_maps: {
        readonly ConstantQuotaUsageDaily?: {
            [date: string]: {
                readonly is_hidden: boolean;
                readonly remaining: number;
                readonly season_type: string;
                readonly show_walkup: boolean;
                readonly total: number;
            };
        };
        readonly QuotaUsageByMemberDaily?: {
            [date: string]: {
                readonly is_hidden: boolean;
                readonly remaining: number;
                readonly season_type: string;
                readonly show_walkup: boolean;
                readonly total: number;
            };
        };
    };
}

export class RecreationDotGovDivisionAvailability
{
    public readonly json: RecreationDotGovDivisionAvailabilityJson;

    public readonly minimumGroupSize?: number;
    public readonly maximumGroupSize?: number;
    public readonly dayAvailabilities: Iterable<RecreationDotGovDivisionDayAvailability>;

    private constructor(json: RecreationDotGovDivisionAvailabilityJson)
    {
        PreCondition.assertNotUndefinedAndNotNull(json, "json");

        this.json = json;

        const minGroupSize: string = "MinGroupSize".toLowerCase();
        const maxGroupSize: string = "MaxGroupSize".toLowerCase();
        for (const rule of json.rules)
        {
            switch (rule.name.toLowerCase())
            {
                case minGroupSize:
                    this.minimumGroupSize = rule.value;
                    break;

                case maxGroupSize:
                    this.maximumGroupSize = rule.value;
                    break;
            }
        }

        const dayAvailabilities = List.create<RecreationDotGovDivisionDayAvailability>();
        const quotaUsageByMemberDaily = json.quota_type_maps?.QuotaUsageByMemberDaily;
        if (quotaUsageByMemberDaily)
        {
            for (const quotaUsage of Object.entries(quotaUsageByMemberDaily))
            {
                const dateString: string = quotaUsage[0];

                const usageData = quotaUsage[1];

                let walkup: boolean = false;
                let reservationsRemaining: number = 0;
                const boolsEntry: boolean = json.bools[dateString];
                if (boolsEntry)
                {
                    walkup = usageData.show_walkup;
                    reservationsRemaining = usageData.remaining;
                }

                dayAvailabilities.add({
                    date: DateTime.parse(dateString).await(),
                    totalSpots: usageData.total,
                    walkup,
                    reservationsRemaining,
                });
            }
        }
        this.dayAvailabilities = dayAvailabilities;
    }

    public static create(json: RecreationDotGovDivisionAvailabilityJson): RecreationDotGovDivisionAvailability
    {
        return new RecreationDotGovDivisionAvailability(json);
    }
}

interface RecreationDotGovPayloadResponse<T>
{
    readonly payload: T;
}

export interface RecreationDotGovDivisionJson
{
    readonly id: string;

    readonly name: string;

    readonly type: string;

    readonly district: string;
}

export interface RecreationDotGovPermitItineraryJson
{
    readonly id: string;

    readonly name: string;

    readonly divisions: { [divisionId: number]: RecreationDotGovDivisionJson };
}

export class RecreationDotGovError extends BaseError
{
}

export interface RecreationDotGovErrorResponse
{
    readonly error: string;
}

export class RecreationDotGovClient
{
    private readonly httpClient: HttpClient;

    private constructor(httpClient: HttpClient)
    {
        PreCondition.assertNotUndefinedAndNotNull(httpClient, "httpClient");

        this.httpClient = httpClient;
    }

    public static create(httpClient: HttpClient): RecreationDotGovClient
    {
        return new RecreationDotGovClient(httpClient);
    }

    public sendRequest(request: HttpOutgoingRequest): AsyncResult<HttpIncomingResponse>
    {
        return this.httpClient.sendRequest(request);
    }

    public sendGetRequest(url: string, headers?: HttpHeaders): AsyncResult<HttpIncomingResponse>
    {
        return this.httpClient.sendGetRequest(url, headers);
    }

    public getPermitItinerary(permitItineraryId: string): AsyncResult<RecreationDotGovPermitItineraryJson>
    {
        PreCondition.assertNotEmpty(permitItineraryId, "permitItineraryId");

        return AsyncResult.create(async () =>
        {
            const response: HttpIncomingResponse = await this.sendGetRequest(`https://www.recreation.gov/api/permitcontent/${permitItineraryId}`);

            const responseBody: unknown = await response.getBodyJSON();

            const statusCode: number = response.getStatusCode();
            if (statusCode < 200 || 300 <= statusCode)
            {
                const responseBodyJson: RecreationDotGovErrorResponse = responseBody as RecreationDotGovErrorResponse;
                const errorMessage: string = responseBodyJson.error;
                switch (errorMessage.toLowerCase())
                {
                    case "permit not found":
                        throw new RecreationDotGovError(`No permit itinerary found for id: ${JSON.stringify(permitItineraryId)}`);
                        
                    default:
                        throw new RecreationDotGovError(`Unrecognized error: ${JSON.stringify(errorMessage)}`);
                }
            }

            const responseBodyJson = responseBody as RecreationDotGovPayloadResponse<RecreationDotGovPermitItineraryJson>;
            return responseBodyJson.payload;
        });
    }

    public getDivisionAvailability(permitItineraryId: string, divisionId: string, month: number, year: number, earlyAccessPermitLotteryId?: string): AsyncResult<RecreationDotGovDivisionAvailability>
    {
        PreCondition.assertNotEmpty(permitItineraryId, "permitItineraryId");
        PreCondition.assertNotEmpty(divisionId, "divisionId");
        PreCondition.assertBetween(1, month, 12, "month");

        return AsyncResult.create(async () =>
        {
            const url: string = earlyAccessPermitLotteryId
                ? `https://www.recreation.gov/api/permititinerary/${permitItineraryId}/division/${divisionId}/eapavailability/month/${earlyAccessPermitLotteryId}?month=${month}&year=${year}`
                : `https://www.recreation.gov/api/permititinerary/${permitItineraryId}/division/${divisionId}/availability/month?month=${month}&year=${year}`
            const response: HttpIncomingResponse = await this.sendGetRequest(url);

            let responseBody: unknown = await response.getBodyJSON();

            const statusCode: number = response.getStatusCode();
            if (statusCode < 200 || 300 <= statusCode)
            {
                const responseBodyJson = responseBody as RecreationDotGovErrorResponse;
                const errorMessage: string = responseBodyJson.error;
                switch (errorMessage.toLowerCase())
                {
                    case "invalid permit id":
                        throw new RecreationDotGovError(`No permit itinerary found for id: ${JSON.stringify(permitItineraryId)}`);

                    case "request year is missing or invalid":
                        // Ignore this error and just return an empty availability.
                        const emptyResponseBody: RecreationDotGovPayloadResponse<RecreationDotGovDivisionAvailabilityJson> = {
                            payload: {
                                bools: {},
                                rules: [],
                                quota_type_maps: {},
                            },
                        };
                        responseBody = emptyResponseBody;
                        break;
                        
                    default:
                        throw new RecreationDotGovError(`Unrecognized error: ${JSON.stringify(errorMessage)}`);
                }
            }

            const responseBodyJson = responseBody as RecreationDotGovPayloadResponse<RecreationDotGovDivisionAvailabilityJson>;
            return RecreationDotGovDivisionAvailability.create(responseBodyJson.payload);
        });
    }
}