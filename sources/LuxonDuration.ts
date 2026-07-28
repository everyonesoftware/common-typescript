import { Duration } from "./Duration.js";
import * as luxon from "luxon";
import { PreCondition } from "./preCondition.js";
import { SyncResult } from "./syncResult.js";

/**
 * A {@link Duration} object that wraps around a {@link luxon.Duration}.
 */
export class LuxonDuration implements Duration
{
    private readonly duration: luxon.Duration;

    private constructor(duration: luxon.Duration)
    {
        PreCondition.assertNotUndefinedAndNotNull(duration, "duration");

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
        return SyncResult.create(() =>
        {
            return LuxonDuration.create(luxon.Duration.fromISO(text));
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

    public toMinutes(): number
    {
        return this.duration.toMillis() / 60000;
    }

    public toSeconds(): number
    {
        return this.duration.toMillis() / 1000;
    }

    public toMilliseconds(): number
    {
        return this.duration.toMillis();
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