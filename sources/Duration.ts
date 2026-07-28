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
     * Get the number of years in this {@link Duration}.
     */
    public abstract getYears(): number;
    
    /**
     * Get the number of months in this {@link Duration}.
     */
    public abstract getMonths(): number;
    
    /**
     * Get the number of days in this {@link Duration}.
     */
    public abstract getDays(): number;
    
    /**
     * Get the number of hours in this {@link Duration}.
     */
    public abstract getHours(): number;
    
    /**
     * Get the number of minutes in this {@link Duration}.
     */
    public abstract getMinutes(): number;

    /**
     * Get the number of seconds in this {@link Duration}.
     */
    public abstract getSeconds(): number;

    /**
     * Get the total number of minutes in this {@link Duration}.
     */
    public abstract toMinutes(): number;

    /**
     * Get the total number of seconds in this {@link Duration}.
     */
    public abstract toSeconds(): number;

    /**
     * Get the total number of milliseconds in this {@link Duration}.
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