import { Comparable } from "./comparable.js";
import { Comparison } from "./comparison.js";
import { Duration } from "./Duration.js";
import { LuxonDateTime } from "./luxonDateTime.js";
import { ParseError } from "./ParseError.js";
import { escapeAndQuote } from "./strings.js";
import { SyncResult } from "./syncResult.js";

export abstract class DateTime implements Comparable<DateTime>
{
    public static parse(text: string): SyncResult<DateTime>
    {
        return LuxonDateTime.parse(text)
            .convertError(ParseError, () =>
            {
                return new ParseError(`Unable to parse ${escapeAndQuote(text)} into a DateTime.`);
            });
    }

    public abstract getYear(): number;

    public abstract getMonth(): number;

    public abstract getDay(): number;

    public abstract getHour(): number;

    public abstract getMinute(): number;

    public abstract getSecond(): number;

    public abstract addDays(days: number): DateTime;

    /**
     * Add the provided {@link Duration} to this {@link DateTime}.
     * @param duration The {@link Duration} to add to this {@link DateTime}.
     */
    public abstract plus(duration: Duration): DateTime;

    /**
     * Get the duration between this {@link DateTime} and the provided {@link DateTime}.
     * @param rhs The {@link DateTime} to subtract from this {@link DateTime}.
     */
    public abstract minus(rhs: DateTime): Duration;

    /**
     * Compare this {@link DateTime} to the provided {@link DateTime}. If this {@link DateTime} is
     * less than the provided {@link DateTime}, then a negative number will be returned, 0 if
     * they're equal, or a positive number if this {@link DateTime} is greater than the provided
     * {@link DateTime}.
     * @param dateTime The {@link DateTime} to compare to this {@link DateTime}.
     */
    public compareTo(dateTime: DateTime, compareTimes?: boolean): Comparison
    {
        return DateTime.compareTo(this, dateTime, compareTimes);
    }

    public static compareTo(left: DateTime, right: DateTime, compareTimes?: boolean): Comparison
    {
        let result: number = left.getYear() - right.getYear();
        if (result === 0)
        {
            result = left.getMonth() - right.getMonth();
            if (result === 0)
            {
                result = left.getDay() - right.getDay();
                if (result === 0 && compareTimes)
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
        return Comparison.parse(result);
    }

    public lessThan(dateTime: DateTime, compareTimes?: boolean): boolean
    {
        return DateTime.lessThan(this, dateTime, compareTimes);
    }

    public static lessThan(left: DateTime, right: DateTime, compareTimes?: boolean): boolean
    {
        return left.compareTo(right, compareTimes) === Comparison.LessThan;
    }

    public lessThanOrEqualTo(dateTime: DateTime, compareTimes?: boolean): boolean
    {
        return DateTime.lessThanOrEqualTo(this, dateTime, compareTimes);
    }

    public static lessThanOrEqualTo(left: DateTime, right: DateTime, compareTimes?: boolean): boolean
    {
        return left.compareTo(right, compareTimes) !== Comparison.GreaterThan;
    }

    public equals(dateTime: DateTime, compareTimes?: boolean): boolean
    {
        return DateTime.equals(this, dateTime, compareTimes);
    }

    public static equals(left: DateTime, right: DateTime, compareTimes?: boolean): boolean
    {
        return left.compareTo(right, compareTimes) === Comparison.Equal;
    }

    public notEquals(dateTime: DateTime, compareTimes?: boolean): boolean
    {
        return DateTime.notEquals(this, dateTime, compareTimes);
    }

    public static notEquals(left: DateTime, right: DateTime, compareTimes?: boolean): boolean
    {
        return left.compareTo(right, compareTimes) !== Comparison.Equal;
    }

    public greaterThanOrEqualTo(dateTime: DateTime, compareTimes?: boolean): boolean
    {
        return DateTime.greaterThanOrEqualTo(this, dateTime, compareTimes);
    }

    public static greaterThanOrEqualTo(left: DateTime, right: DateTime, compareTimes?: boolean): boolean
    {
        return left.compareTo(right, compareTimes) !== Comparison.LessThan;
    }

    public greaterThan(dateTime: DateTime, compareTimes?: boolean): boolean
    {
        return DateTime.greaterThan(this, dateTime, compareTimes);
    }

    public static greaterThan(left: DateTime, right: DateTime, compareTimes?: boolean): boolean
    {
        return left.compareTo(right, compareTimes) === Comparison.GreaterThan;
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