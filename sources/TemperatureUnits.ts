import { JavascriptIterable } from "./javascript.js";
import { NotFoundError } from "./notFoundError.js";
import { PreCondition } from "./preCondition.js";
import { StringEnum } from "./StringEnum.js";
import { escapeAndQuote } from "./strings.js";
import { SyncResult } from "./syncResult.js";
import { isString } from "./types.js";

/**
 * A type that represents the different temperature units available.
 */
export class TemperatureUnits
{
    private static readonly stringEnum: StringEnum<TemperatureUnits> = StringEnum.create("TemperatureUnits", "TemperatureUnit");

    private readonly name: string;
    private readonly abbreviations: string[];

    private constructor(name: string, abbreviations: string[])
    {
        PreCondition.assertNotEmpty(name, "name");
        PreCondition.assertNotEmpty(abbreviations, "abbreviations");

        this.name = name;
        this.abbreviations = abbreviations;
    }

    private static create(name: string, abbreviations: string | string[]): TemperatureUnits
    {
        if (isString(abbreviations))
        {
            abbreviations = [abbreviations];
        }
        const temperatureUnits = new TemperatureUnits(name, abbreviations);

        TemperatureUnits.stringEnum.add(temperatureUnits, [name, ...abbreviations]);

        return temperatureUnits;
    }

    /**
     * Parse a {@link TemperatureUnits} value from the provided text.
     * @param text The text to parse.
     */
    public static parse(text: string): SyncResult<TemperatureUnits>
    {
        return TemperatureUnits.stringEnum.parse(text)
            .convertError(NotFoundError, () => new NotFoundError(`No TemperatureUnits found for: ${escapeAndQuote(text)}`));
    }

    public getName(): string
    {
        return this.name;
    }

    public getAbbreviation(): string
    {
        return this.abbreviations[0];
    }

    public getAbbreviations(): JavascriptIterable<string>
    {
        return this.abbreviations;
    }

    public toString(): string
    {
        return this.getName();
    }

    /**
     * The Celsius temperature unit. See https://en.wikipedia.org/wiki/Celsius for more.
     */
    public static readonly Celsius = TemperatureUnits.create("Celsius", "C");
    /**
     * The Fahrenheit temperature unit. See https://en.wikipedia.org/wiki/Fahrenheit for more.
     */
    public static readonly Fahrenheit = TemperatureUnits.create("Fahrenheit", "F");
    /**
     * The Kelvin temperature unit. See https://en.wikipedia.org/wiki/Kelvin for more.
     */
    public static readonly Kelvin = TemperatureUnits.create("Kelvin", "K");
    /**
     * The Rankine temperature unit. See https://en.wikipedia.org/wiki/Rankine_scale for more.
     */
    public static readonly Rankine = TemperatureUnits.create("Rankine", ["R", "Ra"]);
}