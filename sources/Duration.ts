import { LuxonDuration } from "./LuxonDuration.js";
import { SyncResult } from "./syncResult.js";

export abstract class Duration
{
    /**
     * Get an empty {@link Duration} object.
     */
    public static zero(): Duration
    {
        return LuxonDuration.zero();
    }

    /**
     * Parse the provided ISO 8601 Duration text (https://en.wikipedia.org/wiki/ISO_8601#Durations)
     * into a {@link Duration} object.
     * @param text The text to parse into a {@link Duration}.
     */
    public static parse(text: string): SyncResult<Duration>
    {
        return LuxonDuration.parse(text);
    }

    /**
     * Get the years component of this {@link Duration}.
     */
    public abstract getYears(): number;
    
    /**
     * Get the months component of this {@link Duration}.
     */
    public abstract getMonths(): number;
    
    /**
     * Get the days component of this {@link Duration}.
     */
    public abstract getDays(): number;
    
    /**
     * Get the hours component of this {@link Duration}.
     */
    public abstract getHours(): number;
    
    /**
     * Get the minutes component of this {@link Duration}.
     */
    public abstract getMinutes(): number;

    /**
     * Get the seconds component of this {@link Duration}.
     */
    public abstract getSeconds(): number;

    /**
     * Get the milliseconds component of this {@link Duration}.
     */
    public abstract getMilliseconds(): number;

    /**
     * Get this {@link Duration}'s value converted to days.
     */
    public abstract toDays(): number;

    /**
     * Get this {@link Duration}'s value converted to hours.
     */
    public abstract toHours(): number;

    /**
     * Get this {@link Duration}'s value converted to minutes.
     */
    public abstract toMinutes(): number;

    /**
     * Get this {@link Duration}'s value converted to seconds.
     */
    public abstract toSeconds(): number;

    /**
     * Get this {@link Duration}'s value converted to milliseconds.
     */
    public abstract toMilliseconds(): number

    /**
     * Get the https://en.wikipedia.org/wiki/ISO_8601 string representation of this {@link Duration}.
     */
    public abstract toString(): string;

    /**
     * Get the sum of adding this {@link Duration} to the provided {@link Duration}.
     * @param duration The {@link Duration} to add to this {@link Duration}.
     */
    public abstract plus(duration: Duration): Duration;
}