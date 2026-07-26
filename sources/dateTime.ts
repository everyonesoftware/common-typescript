import { LuxonDateTime } from "./luxonDateTime.js";

export abstract class DateTime
{
    public static parse(text: string): DateTime
    {
        return LuxonDateTime.parse(text);
    }

    public static now(): DateTime
    {
        return LuxonDateTime.now();
    }

    public abstract getYear(): number;

    public abstract getMonth(): number;

    public abstract getDay(): number;

    public abstract getHour(): number;

    public abstract getMinute(): number;

    public abstract getSecond(): number;

    public abstract addDays(days: number): DateTime;

    /**
     * Compare this {@link DateTime} to the provided {@link DateTime}. If this {@link DateTime} is
     * less than the provided {@link DateTime}, then a negative number will be returned, 0 if
     * they're equal, or a positive number if this {@link DateTime} is greater than the provided
     * {@link DateTime}.
     * @param dateTime The {@link DateTime} to compare to this {@link DateTime}.
     */
    public compareTo(dateTime: DateTime, compareTimes: boolean): number
    {
        return DateTime.compareTo(this, dateTime, compareTimes);
    }

    public static compareTo(left: DateTime, right: DateTime, compareTimes: boolean): number
    {
        let result: number = left.getYear() - right.getYear();
        if (result === 0)
        {
            result = left.getMonth() - right.getMonth();
            if (result === 0)
            {
                result = left.getDay() - right.getDay();
                if (compareTimes && result === 0)
                {
                    result = left.getHour() - right.getHour();
                    if (result === 0)
                    {
                        result = left.getMinute() - right.getMinute();
                        if (result === 0)
                        {
                            result = left.getSecond() - right.getSecond();
                        }
                    }
                }
            }
        }
        return result;
    }

    public lessThan(dateTime: DateTime, compareTimes: boolean): boolean
    {
        return DateTime.lessThan(this, dateTime, compareTimes);
    }

    public static lessThan(left: DateTime, right: DateTime, compareTimes: boolean): boolean
    {
        return left.compareTo(right, compareTimes) < 0;
    }

    public lessThanOrEqualTo(dateTime: DateTime, compareTimes: boolean): boolean
    {
        return DateTime.lessThanOrEqualTo(this, dateTime, compareTimes);
    }

    public static lessThanOrEqualTo(left: DateTime, right: DateTime, compareTimes: boolean): boolean
    {
        return left.compareTo(right, compareTimes) <= 0;
    }

    public equals(dateTime: DateTime, compareTimes: boolean): boolean
    {
        return DateTime.equals(this, dateTime, compareTimes);
    }

    public static equals(left: DateTime, right: DateTime, compareTimes: boolean): boolean
    {
        return left.compareTo(right, compareTimes) === 0;
    }

    public greaterThanOrEqualTo(dateTime: DateTime, compareTimes: boolean): boolean
    {
        return DateTime.greaterThanOrEqualTo(this, dateTime, compareTimes);
    }

    public static greaterThanOrEqualTo(left: DateTime, right: DateTime, compareTimes: boolean): boolean
    {
        return left.compareTo(right, compareTimes) >= 0;
    }

    public greaterThan(dateTime: DateTime, compareTimes: boolean): boolean
    {
        return DateTime.greaterThan(this, dateTime, compareTimes);
    }

    public static greaterThan(left: DateTime, right: DateTime, compareTimes: boolean): boolean
    {
        return left.compareTo(right, compareTimes) > 0;
    }

    public get debug(): string
    {
        return DateTime.debug(this);
    }

    public static debug(dateTime: DateTime): string
    {
        return dateTime.toString();
    }

    public abstract toString(): string;

    /**
     * Get the string representation of this {@link DateTime}'s date in the format "yyyy-mm-dd", such
     * as "2020-05-13".
     */
    public abstract toDateString(): string;
    
    /**
     * Get the string representation of this {@link DateTime}'s date in the format "MMM d", such as
     * "Mar 3".
     */
    public abstract toShortDateString(): string;
}