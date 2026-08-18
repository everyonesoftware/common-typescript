import { Comparable } from "./comparable.js";
import { Comparison } from "./comparison.js";
import { PreCondition } from "./preCondition.js";
import { SyncResult } from "./syncResult.js";
import { Iterable } from "./iterable.js";
import { NotFoundError } from "./notFoundError.js";
import { ParseError } from "./ParseError.js";
import { escapeAndQuote } from "./strings.js";

export class LogLevel extends Comparable<LogLevel>
{
    private readonly name: string;
    private readonly value: number;

    private constructor(name: string, value: number)
    {
        PreCondition.assertNotEmpty(name, "name");
        PreCondition.assertNotUndefinedAndNotNull(value, "value");

        super();

        this.name = name;
        this.value = value;
    }

    private static create(name: string, value: number): LogLevel
    {
        return new LogLevel(name, value);
    }

    /**
     * Parse the provided string into a {@link LogLevel}.
     * @param value The value to parse into a {@link LogLevel}.
     * @throws ParseError if the string isn't a {@link LogLevel}.
     */
    public static parse(value: string): SyncResult<LogLevel>
    {
        PreCondition.assertNotUndefinedAndNotNull(value, "value");

        const lowerValue: string = value.toLowerCase();
        return LogLevel.values()
            .first((logLevel: LogLevel) => logLevel.getName().toLowerCase() === lowerValue)
            .convertError(NotFoundError, () => new ParseError(`Could not parse ${escapeAndQuote(value)} into a LogLevel.`));
    }

    public getName(): string
    {
        return this.name;
    }

    public getValue(): number
    {
        return this.value;
    }

    public toString(): string
    {
        return this.getName();
    }

    public compareTo(logLevel: LogLevel): Comparison
    {
        return Comparison.parse(this.getValue() - logLevel.getValue());
    }

    /**
     * Get the different {@link LogLevel} values available.
     */
    public static values(): Iterable<LogLevel>
    {
        return Iterable.create([
            LogLevel.Debug,
            LogLevel.Info,
            LogLevel.Warning,
            LogLevel.Error,
        ]);
    }

    public static readonly Debug = LogLevel.create("Debug", 1);
    public static readonly Info = LogLevel.create("Info", 2);
    public static readonly Warning = LogLevel.create("Warning", 3);
    public static readonly Error = LogLevel.create("Error", 4);
}