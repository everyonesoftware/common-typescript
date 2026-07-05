import * as luxon from "luxon";
import { DateTime } from "./dateTime";

const pctTimeZone: string = "America/Los_Angeles";

export class LuxonDateTime implements DateTime
{
    private readonly dateTime: luxon.DateTime;

    private constructor(dateTime: luxon.DateTime)
    {
        this.dateTime = dateTime;
    }

    private static create(dateTime: luxon.DateTime): LuxonDateTime
    {
        return new LuxonDateTime(dateTime);
    }

    public static parse(text: string): LuxonDateTime
    {
        return LuxonDateTime.create(luxon.DateTime.fromISO(text, { zone: pctTimeZone }));
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

    public compareTo(dateTime: DateTime, compareTimes: boolean): number
    {
        return DateTime.compareTo(this, dateTime, compareTimes);
    }

    public lessThan(dateTime: DateTime, compareTimes: boolean): boolean
    {
        return DateTime.lessThan(this, dateTime, compareTimes);
    }

    public lessThanOrEqualTo(dateTime: DateTime, compareTimes: boolean): boolean
    {
        return DateTime.lessThanOrEqualTo(this, dateTime, compareTimes);
    }

    public equals(dateTime: DateTime, compareTimes: boolean): boolean
    {
        return DateTime.equals(this, dateTime, compareTimes);
    }

    public greaterThanOrEqualTo(dateTime: DateTime, compareTimes: boolean): boolean
    {
        return DateTime.greaterThanOrEqualTo(this, dateTime, compareTimes);
    }

    public greaterThan(dateTime: DateTime, compareTimes: boolean): boolean
    {
        return DateTime.greaterThan(this, dateTime, compareTimes);
    }

    public get debug(): string
    {
        return DateTime.debug(this);
    }
}