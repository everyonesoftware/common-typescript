import { Clock, DateTime, PreCondition } from "../sources";

/**
 * A {@link Clock} implementation that returns a configured {@link DateTime}.
 */
export class FakeClock extends Clock
{
    private currentTime: DateTime;

    private constructor(currentTime: DateTime)
    {
        PreCondition.assertNotUndefinedAndNotNull(currentTime, "currentTime");

        super();

        this.currentTime = currentTime;
    }

    public static create(currentTime?: DateTime): FakeClock
    {
        return new FakeClock(currentTime ?? DateTime.now());
    }

    /**
     * Set the {@link DateTime} that this {@link FakeClock} will return.
     * @param currentTime The {@link DateTime} that this {@link FakeClock} will return.
     */
    public setCurrentTime(currentTime: DateTime): this
    {
        this.currentTime = currentTime;

        return this;
    }

    public now(): DateTime
    {
        return this.currentTime;
    }
}