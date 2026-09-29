import { Duration } from "./Duration.js";
import * as luxon from "luxon";
import { PreCondition } from "./preCondition.js";
import { SyncResult } from "./syncResult.js";
import { ParseError } from "./ParseError.js";
import { escapeAndQuote } from "./strings.js";

/**
 * A {@link Duration} object that wraps around a {@link luxon.Duration}.
 */
export class LuxonDuration implements Duration
{
    private readonly duration: luxon.Duration;

    private constructor(duration: luxon.Duration)
    {
        PreCondition.assertNotUndefinedAndNotNull(duration, "duration");
        PreCondition.assertTrue(duration.isValid, "duration.isValid");

        this.duration = duration;
    }

    public static create(duration: luxon.Duration): LuxonDuration
    {
        return new LuxonDuration(duration);
    }

    public static zero(): LuxonDuration
    {
        return LuxonDuration.create(luxon.Duration.fromObject({}));
    }

    public static parse(text: string): SyncResult<LuxonDuration>
    {
        PreCondition.assertNotEmpty(text, "text");

        return SyncResult.create(() =>
        {
            const luxonDuration: luxon.DurationMaybeValid = luxon.Duration.fromISO(text);
            if (!luxonDuration.isValid)
            {
                throw new ParseError(`${escapeAndQuote(text)} is not a valid Duration.`);
            }
            return LuxonDuration.create(luxonDuration);
        });
    }

    /**
     * Get the inner {@link luxon.Duration} that this {@link LuxonDuration} is wrapped around.
     */
    public getLuxonDuration(): luxon.Duration
    {
        return this.duration;
    }

    public getYears(): number
    {
        return this.duration.get("years");
    }

    public getMonths(): number
    {
        return this.duration.get("months");
    }

    public getDays(): number
    {
        return this.duration.get("days");
    }

    public getHours(): number
    {
        return this.duration.get("hours");
    }

    public getMinutes(): number
    {
        return this.duration.get("minutes");
    }

    public getSeconds(): number
    {
        return this.duration.get("seconds");
    }

    public getMilliseconds(): number
    {
        return this.duration.get("milliseconds");
    }

    public toDays(): number
    {
        return this.duration.as("days");
    }

    public toHours(): number
    {
        return this.duration.as("hours");
    }

    public toMinutes(): number
    {
        return this.duration.as("minutes");
    }

    public toSeconds(): number
    {
        return this.duration.as("seconds");
    }

    public toMilliseconds(): number
    {
        return this.duration.as("milliseconds");
    }

    public toString(): string
    {
        return this.duration.toISO()!;
    }

    public plus(duration: Duration): Duration
    {
        const luxonDuration: LuxonDuration = duration instanceof LuxonDuration ? duration : LuxonDuration.parse(duration.toString()).await();
        return LuxonDuration.create(this.duration.plus(luxonDuration.duration));
    }
}