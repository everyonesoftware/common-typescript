import { AsyncResult } from "./asyncResult.js";
import { BaseError } from "./BaseError.js";
import { HttpClient } from "./httpClient.js";
import { HttpIncomingResponse } from "./httpIncomingResponse.js";
import { HttpOutgoingRequest } from "./httpOutgoingRequest.js";
import { PreCondition } from "./preCondition.js";
import { TemperatureUnits } from "./TemperatureUnits.js";

export interface WeatherDotGovClientErrorData
{
    readonly status: number,
    readonly detail: string,
    readonly title: string,
    readonly type: string,
}

export class WeatherDotGovClientError extends BaseError
{
    private readonly data: WeatherDotGovClientErrorData;

    constructor(data: WeatherDotGovClientErrorData)
    {
        super(data.detail);

        this.data = data;
    }

    public getData(): WeatherDotGovClientErrorData
    {
        return this.data
    }
}

export interface WeatherDotGovPointProperties
{
    readonly gridId: string;
    readonly gridX: number;
    readonly gridY: number;
}

/**
 * Response from a request to https://api.weather.gov/points/{latitude},{longitude}.
 * Source: https://api.weather.gov/
 * API: /points/{latitude},{longitude}
 */
export interface GetPointResponse
{
    readonly properties: WeatherDotGovPointProperties,
}

/**
 * A forecast for a specific period of time.
 */
export interface ForecastResponsePeriod
{
    /**
     * Sequential period number.
     */
    readonly number: number,
    /**
     * A textual identifier for the period. This value will not be present for hourly forecasts.
     * For example, "This Afternoon", "Tonight", "Wednesday"
     */
    readonly name: string,
    /**
     * The starting time that this forecast period is valid for.
     * For example: "2025-05-27T12:00:00-07:00"
     */
    readonly startTime: string,
    /**
     * The ending time that this forecast period is valid for.
     * For example: "2025-05-27T18:00:00-07:00"
     */
    readonly endTime: string,
    /**
     * Whether this period is daytime (true) or nighttime (false).
     */
    readonly isDaytime: boolean,
    /**
     * High/low temperature for the period, depending on whether the period is day or night. This
     * property as an integer value is deprecated. Future versions will express this value as a
     * quantitative value object. To make use of the future standard format now, set the
     * "forecast_temperature_qv" feature flag on the request.
     * For example: 76
     */
    readonly temperature: number,
    /**
     * The unit of the temperature value (Fahrenheit or Celsius). This property is deprecated.
     * Future versions will indicate the unit within the quantitative value object for the
     * temperature property. To make use of the future standard format now, set the
     * "forecast_temperature_qv" feature flag on the request.
     * For example: "F" (Fahrenheit) or "C" (Celsius)
     */
    readonly temperatureUnit: "F",
    /**
     * The probability of precipitation for the period, expressed as a percentage.
     */
    readonly probabilityOfPrecipitation: {
        /**
         * The percentage value of the probability of precipitation.
         * For example: 20
         */
        readonly value: number,
    },
    /**
     * Wind speed for the period. This property as an string value is deprecated. Future versions
     * will express this value as a quantitative value object. To make use of the future standard
     * format now, set the "forecast_wind_speed_qv" feature flag on the request.
     * For example: "5 to 15 mph"
     */
    readonly windSpeed: string,
    /**
     * The prevailing direction of the wind for the period, using a 16-point compass.
     * For example: "SW" (Southwest), "N" (North), "E" (East), etc.
     */
    readonly windDirection: string,
    /**
     * A link to an icon representing the forecast summary.
     * For example: "https://api.weather.gov/icons/land/day/few?size=medium"
     */
    readonly icon: string,
    /**
     * 	A brief textual forecast summary for the period.
     * For example: "Sunny", "Mostly Cloudy", "Chance of Rain"
     */
    readonly shortForecast: string,
    /**
     * A detailed textual forecast for the period.
     * For example: "Sunny, with a high near 79. Southwest wind 5 to 15 mph, with gusts as high as 25 mph."
     */
    readonly detailedForecast: string,
}

/**
 * Source: https://api.weather.gov/
 * API: /gridpoints/{wfo}/{x},{y}/forecast
 */
export interface GetForecastResponse
{
    /**
     * Source: https://api.weather.gov/openapi.json#/components/schemas/Gridpoint12hForecast
     */
    readonly properties: {
        /**
         * The time this forecast data was generated.
         * For example: "2025-05-27T19:31:42+00:00"
         */
        readonly generatedAt: string,
        /**
         * The last update time of the data this forecast was generated from.
         * For example: "2025-05-27T15:05:02+00:00"
         */
        readonly updateTime: string,
        /**
         * An array of forecast periods.
         */
        readonly periods: ForecastResponsePeriod[],
    }
}

/**
 * A client that can get data from NOAA.
 */
export class WeatherDotGovClient
{
    private readonly httpClient: HttpClient;

    private constructor(httpClient: HttpClient)
    {
        PreCondition.assertNotUndefinedAndNotNull(httpClient, "httpClient");

        this.httpClient = httpClient;
    }

    public static create(httpClient: HttpClient): WeatherDotGovClient
    {
        return new WeatherDotGovClient(httpClient);
    }

    /**
     * Send a GET HTTP request to the provided URL.
     * @param url The URL string to send the GET HTTP request to.
     */
    private sendGetRequest(url: string): AsyncResult<HttpIncomingResponse>
    {
        return AsyncResult.create(async () =>
        {
            const request: HttpOutgoingRequest = HttpOutgoingRequest.get(url)
                .setHeader("Accept", "application/geo+json")
                .setHeader("User-Agent", `PCTWeather/1.0 (https://pctweather.com)`);

            const response: HttpIncomingResponse = await this.httpClient.sendRequest(request);

            return response;
        });
    }

    /**
     * Returns metadata about a given latitude/longitude point. This function only works for
     * coordinates within the United States. Coordinates within Mexico and Canada will throw a
     * {@link WeatherDotGovClientError}.
     * @param latitude The latitude to get metadata about.
     * @param longitude The longitude to get metadata about.
     */
    public getPoint(latitude: number, longitude: number): AsyncResult<GetPointResponse>
    {
        return AsyncResult.create(async () =>
        {
            const requestLatitude: string = latitude.toFixed(4);
            const requestLongitude: string = longitude.toFixed(4);
            const pointsRequestURL: string = `https://api.weather.gov/points/${requestLatitude},${requestLongitude}`;

            const rawPointsResponse: HttpIncomingResponse = await this.sendGetRequest(pointsRequestURL);
            const pointsResponseJson: unknown = await rawPointsResponse.getBodyJSON();
            if (rawPointsResponse.getStatusCode() / 100 !== 2)
            {
                throw new WeatherDotGovClientError(pointsResponseJson as WeatherDotGovClientErrorData);
            }

            return pointsResponseJson as GetPointResponse;
        });
    }

    public getForecast(gridId: string, gridX: number, gridY: number, temperatureUnits: TemperatureUnits): AsyncResult<GetForecastResponse>
    {
        return AsyncResult.create(async () =>
        {
            const noaaUnits: string = (temperatureUnits === TemperatureUnits.Celsius ? "si" : "us");
            const forecastRequestURL: string = `https://api.weather.gov/gridpoints/${gridId}/${gridX},${gridY}/forecast?units=${noaaUnits}`;

            const getForecastResponse: HttpIncomingResponse = await this.sendGetRequest(forecastRequestURL);
            const forecastResponseJson: unknown = await getForecastResponse.getBodyJSON();
            if (!getForecastResponse.isStatusCodeOk())
            {
                throw new WeatherDotGovClientError(forecastResponseJson as WeatherDotGovClientErrorData);
            }
            return forecastResponseJson as GetForecastResponse;
        });
    }
}