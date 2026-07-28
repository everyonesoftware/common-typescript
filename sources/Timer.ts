import { Clock } from "./Clock.js";
import { DateTime } from "./dateTime.js";
import { Duration } from "./Duration.js";
import { PreCondition } from "./preCondition.js";
import { isUndefinedOrNull } from "./types.js";

/**
 * An object that can be used to determine the duration between a start time and the current time.
 */
export class Timer
{
    private readonly clock: Clock;
    private readonly startTime: DateTime;

    private constructor(clock: Clock, startTime: DateTime)
    {
        PreCondition.assertNotUndefinedAndNotNull(clock, "clock");
        PreCondition.assertNotUndefinedAndNotNull(startTime, "startTime");

        this.clock = clock;
        this.startTime = startTime;
    }

    /**
     * Create a new {@link Timer} using the provided properties.
     * @param clock The {@link Clock} to get the current time from.
     * @param startTime The {@link DateTime} that the {@link Timer} started at.
     */
    public static create(clock: Clock, startTime?: DateTime): Timer
    {
        if (isUndefinedOrNull(startTime))
        {
            startTime = clock.getCurrent();
        }
        return new Timer(clock, startTime);
    }

    /**
     * Get the {@link DateTime} that this {@link Timer} was started at.
     */
    public getStartTime(): DateTime
    {
        return this.startTime;
    }

    /**
     * Get amount of time that has elapsed since this {@link Timer} started.
     */
    public getDuration(): Duration
    {
        return this.clock.getCurrent().minus(this.startTime);
    }
}