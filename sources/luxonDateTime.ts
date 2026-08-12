import * as luxon from "luxon";
import { DateTime } from "./dateTime.js";
import { Comparison } from "./comparison.js";
import { LuxonDuration } from "./LuxonDuration.js";
import { Duration } from "./Duration.js";
import { PreCondition } from "./preCondition.js";
import { SyncResult } from "./syncResult.js";
import { ParseError } from "./ParseError.js";
import { escapeAndQuote } from "./strings.js";

const pctTimeZone: string = "America/Los_Angeles";

export class LuxonDateTime implements DateTime
{
    private readonly dateTime: luxon.DateTime;

    private constructor(dateTime: luxon.DateTime)
    {
        PreCondition.assertNotUndefinedAndNotNull(dateTime, "dateTime");

        this.dateTime = dateTime;
    }

    private static create(dateTime: luxon.DateTime): LuxonDateTime
    {
        return new LuxonDateTime(dateTime);
    }

    public static parse(text: string): SyncResult<LuxonDateTime>
    {
        return SyncResult.create(() =>
        {
            const luxonDateTime: luxon.DateTimeMaybeValid = luxon.DateTime.fromISO(text, { zone: pctTimeZone });
            if (luxonDateTime?.isValid !== true)
            {
                throw new ParseError(`Unable to parse ${escapeAndQuote(text)} into a LuxonDateTime.`);
            }
            return LuxonDateTime.create(luxonDateTime);
        });
    }

    public static now(): LuxonDateTime
    {
        return LuxonDateTime.create(luxon.DateTime.now().setZone(pctTimeZone));
    }

    public getYear(): number
    {
        return this.dateTime.year;
    }

    public getMonth(): number
    {
        return this.dateTime.month;
    }

    public getDay(): number
    {
        return this.dateTime.day;
    }

    public getHour(): number
    {
        return this.dateTime.hour;
    }

    public getMinute(): number
    {
        return this.dateTime.minute;
    }

    public getSecond(): number
    {
        return this.dateTime.second;
    }

    public addDays(days: number): LuxonDateTime
    {
        return LuxonDateTime.create(this.dateTime.plus({ days: days }));
    }

    public plus(duration: Duration): LuxonDateTime
    {
        PreCondition.assertNotUndefinedAndNotNull(duration, "duration");

        const luxonDuration: LuxonDuration = duration instanceof LuxonDuration ? duration : LuxonDuration.parse(duration.toString()).await();
        return LuxonDateTime.create(this.dateTime.plus(luxonDuration.getLuxonDuration()));
    }

    public minus(rhs: DateTime): LuxonDuration
    {
        const luxonRhs: LuxonDateTime = rhs instanceof LuxonDateTime ? rhs : LuxonDateTime.parse(rhs.toString()).await();
        return LuxonDuration.create(this.dateTime.diff(luxonRhs.dateTime));
    }

    public toString(): string
    {
        return this.dateTime.toISO()!;
    }

    public toDateString(): string
    {
        return this.dateTime.toISODate()!;
    }

    public toShortDateString(): string
    {
        return `${this.dateTime.monthShort} ${this.dateTime.day}`;
    }

    public compareTo(dateTime: DateTime, compareTimes?: boolean): Comparison
    {
        return DateTime.compareTo(this, dateTime, compareTimes);
    }

    public lessThan(dateTime: DateTime, compareTimes?: boolean): boolean
    {
        return DateTime.lessThan(this, dateTime, compareTimes);
    }

    public lessThanOrEqualTo(dateTime: DateTime, compareTimes?: boolean): boolean
    {
        return DateTime.lessThanOrEqualTo(this, dateTime, compareTimes);
    }

    public equals(dateTime: DateTime, compareTimes?: boolean): boolean
    {
        return DateTime.equals(this, dateTime, compareTimes);
    }

    public notEquals(dateTime: DateTime, compareTimes?: boolean): boolean
    {
        return DateTime.notEquals(this, dateTime, compareTimes);
    }

    public greaterThanOrEqualTo(dateTime: DateTime, compareTimes?: boolean): boolean
    {
        return DateTime.greaterThanOrEqualTo(this, dateTime, compareTimes);
    }

    public greaterThan(dateTime: DateTime, compareTimes?: boolean): boolean
    {
        return DateTime.greaterThan(this, dateTime, compareTimes);
    }
}