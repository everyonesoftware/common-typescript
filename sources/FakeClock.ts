import { Clock, DateTime, Duration, PreCondition } from "./index.js";
import { Timer } from "./Timer.js";

/**
 * A {@link Clock} implementation that returns a configured {@link DateTime}.
 */
export class FakeClock implements Clock
{
    private currentTime: DateTime;

    private constructor(currentTime: DateTime)
    {
        PreCondition.assertNotUndefinedAndNotNull(currentTime, "currentTime");

        this.currentTime = currentTime;
    }

    public static create(currentTime: DateTime): FakeClock
    {
        return new FakeClock(currentTime);
    }

    /**
     * Set the {@link DateTime} that this {@link FakeClock} will return.
     * @param currentTime The {@link DateTime} that this {@link FakeClock} will return.
     */
    public setCurrent(currentTime: DateTime): this
    {
        PreCondition.assertNotUndefinedAndNotNull(currentTime, "currentTime");

        this.currentTime = currentTime;

        return this;
    }

    /**
     * Advance this {@link FakeClock}'s current time by the provided {@link Duration}.
     * @param duration The {@link Duration} to advance this {@link FakeClock}'s current time by.
     */
    public advanceCurrent(duration: Duration): this
    {
        PreCondition.assertNotUndefinedAndNotNull(duration, "duration");

        this.currentTime = this.currentTime.plus(duration);

        return this;
    }

    public getCurrent(): DateTime
    {
        return this.currentTime;
    }

    public startTimer(): Timer
    {
        return Clock.startTimer(this);
    }
}