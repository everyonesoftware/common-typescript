import { NotFoundError } from "./notFoundError.js";
import { PreCondition } from "./preCondition.js";
import { SyncResult } from "./syncResult.js";
import { TemperatureUnits } from "./TemperatureUnits.js";
import { isString, isUndefinedOrNull } from "./types.js";

/**
 * Options that can be passed to Temperature.toString().
 */
export interface TemperatureToStringOptions
{
    readonly fractionDigits?: number;
}

/**
 * A type that represents a temperature value.
 */
export class Temperature
{
    private readonly value: number;
    private readonly units: TemperatureUnits;

    private constructor(value: number, units: TemperatureUnits)
    {
        PreCondition.assertNotUndefinedAndNotNull(value, "value");
        PreCondition.assertNotUndefinedAndNotNull(units, "units");

        this.value = value;
        this.units = units;
    }

    public static create(value: number, units: TemperatureUnits | string): Temperature
    {
        PreCondition.assertNotUndefinedAndNotNull(value, "value");
        PreCondition.assertNotUndefinedAndNotNull(units, "units");

        if (isString(units))
        {
            units = TemperatureUnits.parse(units).await();
        }
        return new Temperature(value, units);
    }

    public static fahrenheit(value: number): Temperature
    {
        return Temperature.create(value, TemperatureUnits.Fahrenheit);
    }

    public static celsius(value: number): Temperature
    {
        return Temperature.create(value, TemperatureUnits.Celsius);
    }

    public static kelvin(value: number): Temperature
    {
        return Temperature.create(value, TemperatureUnits.Kelvin);
    }

    public static rankine(value: number): Temperature
    {
        return Temperature.create(value, TemperatureUnits.Rankine);
    }

    public convertTo(units: TemperatureUnits): SyncResult<Temperature>
    {
        PreCondition.assertNotUndefinedAndNotNull(units, "units");

        return SyncResult.create(() =>
        {
            let result: Temperature;
            switch (this.units)
            {
                case TemperatureUnits.Fahrenheit:
                    switch (units)
                    {
                        case TemperatureUnits.Fahrenheit:
                            result = this;
                            break;

                        case TemperatureUnits.Celsius:
                            result = Temperature.celsius((this.value - 32) * 5 / 9);
                            break;

                        case TemperatureUnits.Kelvin:
                            result = Temperature.kelvin((this.value + 459.67) * 5 / 9);
                            break;

                        case TemperatureUnits.Rankine:
                            result = Temperature.rankine(this.value + 459.67);
                            break;

                        default:
                            throw new NotFoundError(`Unrecognized TemperatureUnits: ${units}`);
                    }
                    break;

                case TemperatureUnits.Celsius:
                    switch (units)
                    {
                        case TemperatureUnits.Fahrenheit:
                            result = Temperature.fahrenheit((this.value * 9 / 5) + 32);
                            break;

                        case TemperatureUnits.Celsius:
                            result = this;
                            break;

                        case TemperatureUnits.Kelvin:
                            result = Temperature.kelvin(this.value + 273.15);
                            break;

                        case TemperatureUnits.Rankine:
                            result = Temperature.rankine((this.value * 9 / 5) + 491.67);
                            break;

                        default:
                            throw new NotFoundError(`Unrecognized TemperatureUnits: ${units}`);
                    }
                    break;

                case TemperatureUnits.Kelvin:
                    switch (units)
                    {
                        case TemperatureUnits.Fahrenheit:
                            result = Temperature.fahrenheit((this.value * 9 / 5) - 459.67);
                            break;

                        case TemperatureUnits.Celsius:
                            result = Temperature.celsius(this.value - 273.15);
                            break;

                        case TemperatureUnits.Kelvin:
                            result = this;
                            break;

                        case TemperatureUnits.Rankine:
                            result = Temperature.rankine(this.value * 9 / 5);
                            break;

                        default:
                            throw new NotFoundError(`Unrecognized TemperatureUnits: ${units}`);
                    }
                    break;

                case TemperatureUnits.Rankine:
                    switch (units)
                    {
                        case TemperatureUnits.Fahrenheit:
                            result = Temperature.fahrenheit(this.value - 459.67);
                            break;

                        case TemperatureUnits.Celsius:
                            result = Temperature.celsius((this.value * 5 / 9) - 273.15);
                            break;

                        case TemperatureUnits.Kelvin:
                            result = Temperature.kelvin(this.value * 5 / 9);
                            break;

                        case TemperatureUnits.Rankine:
                            result = this;
                            break;

                        default:
                            throw new NotFoundError(`Unrecognized TemperatureUnits: ${units}`);
                    }
                    break;

                default:
                    throw new NotFoundError(`Unrecognized TemperatureUnits: ${this.units}`);
            }

            return result;
        });
    }

    public getValue(): number
    {
        return this.value;
    }

    public getUnits(): TemperatureUnits
    {
        return this.units;
    }

    /**
     * Get whether this {@link Temperature} is equal to the provided {@link Temperature}.
     * @param other The {@link Temperature} value to compare against this {@link Temperature}.
     * @param marginOfError The margin of error to allow but still consider the {@link Temperature}s
     * equal.
     */
    public equals(other: Temperature, marginOfError?: number): boolean
    {
        let result: boolean = false;
        if (!isUndefinedOrNull(other))
        {
            const comparisonUnits: TemperatureUnits = this.getUnits();

            const convertedOther: Temperature = other.convertTo(comparisonUnits).await();

            const valueDifference: number = this.getValue() - convertedOther.getValue();
            if (isUndefinedOrNull(marginOfError))
            {
                result = (valueDifference === 0);
            }
            else
            {
                const marginOfErrorValue = Math.abs(marginOfError);
                result = -marginOfErrorValue <= valueDifference && valueDifference <= marginOfErrorValue;
            }

        }
        return result;
    }

    /**
     * Get the string representation of this {@link Temperature}.
     */
    public toString(options: TemperatureToStringOptions = {}): string
    {
        const value: number = this.getValue();
        const valueString: string = isUndefinedOrNull(options?.fractionDigits)
            ? value.toString()
            : value.toFixed(options.fractionDigits);
        return `${valueString}°${this.units.getAbbreviation()}`
    }
}