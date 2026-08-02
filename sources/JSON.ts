import { ConversionError } from "./ConversionError.js";
import { SyncResult } from "./syncResult.js";
import { isArray, isBoolean, isNull, isNumber, isObject, isString } from "./types.js";

/**
 * The different data types in a JSON file.
 */
export type JSONData = string | number | boolean | null | {} | JSONData[];

/**
 * Get whether the provided value is a {@link JSONData}.
 * @param value The value to check.
 */
export function isJSONData(value: unknown): value is JSONData
{
    return isString(value) ||
        isNumber(value) ||
        isBoolean(value) ||
        isNull(value) ||
        (isObject(value) && Object.entries(value).every((property: [string, unknown]) => isString(property[0]) && isJSONData(property[1]))) ||
        (isArray(value) && value.every((element: unknown) => isJSONData(element)));
}

/**
 * Get the provided value as a {@link JSONData} value. This will just do a simple typecast.
 * @param value The value to convert.
 */
export function asJSONData(value: unknown): JSONData
{
    return value as JSONData;
}

/**
 * Convert the provided value to a JSONData object. Any properties that are not valid JSONData will
 * be omitted. This will create a deep-copy of the provided value. If you don't want to create a
 * deep-copy, then use asJSONData() instead.
 * @param value The value to convert.
 */
export function toJSONData(value: unknown): SyncResult<JSONData>
{
    return SyncResult.create(() =>
    {
        let result: JSONData;
        if (isString(value) || isNull(value) || isNumber(value) || isBoolean(value))
        {
            result = value;
        }
        else if (isArray(value))
        {
            result = [];
            for (const element of value)
            {
                toJSONData(element)
                    .then(jsonDataElement => { (result as JSONData[]).push(jsonDataElement); })
                    .catch(ConversionError, () => {})
                    .await();
            }
        }
        else if (isObject(value))
        {
            result = {};
            for (const property of Object.entries(value))
            {
                toJSONData(property[1])
                    .then(jsonDataPropertyValue => { (result as any)[property[0]] = jsonDataPropertyValue; })
                    .catch(ConversionError, () => {})
                    .await();
            }
        }
        else
        {
            throw new ConversionError(`Unable to convert ${JSON.stringify(value)} to JSONData.`);
        }

        return result;
    });
}