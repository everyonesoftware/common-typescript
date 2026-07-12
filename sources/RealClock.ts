import { Clock } from "./Clock.js";
import { DateTime } from "./dateTime.js";

/**
 * A {@link Clock} implementation that returns the actual current {@link DateTime}.
 */
export class RealClock implements Clock
{
    private constructor()
    {
    }

    public static create(): RealClock
    {
        return new RealClock();
    }

    public now(): DateTime
    {
        return DateTime.now();
    }
}