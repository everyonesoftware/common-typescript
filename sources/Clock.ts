import { DateTime } from "./dateTime.js";
import { PreCondition } from "./preCondition.js";
import { RealClock } from "./RealClock.js";
import { Timer } from "./Timer.js";

/**
 * A type that can be used to get the current {@link DateTime}.
 */
export abstract class Clock
{
    public static create(): Clock
    {
        return RealClock.create();
    }

    /**
     * Get the current {@link DateTime}.
     */
    public abstract getCurrent(): DateTime;

    /**
     * Create a new {@link Timer} based on this {@link Clock}.
     */
    public startTimer(): Timer
    {
        return Clock.startTimer(this);
    }

    public static startTimer(clock: Clock): Timer
    {
        PreCondition.assertNotUndefinedAndNotNull(clock, "clock");

        return Timer.create(clock);
    }
}