import { Clock } from "./Clock.js";
import { DateTime } from "./dateTime.js";
import { LuxonDateTime } from "./luxonDateTime.js";
import { Timer } from "./Timer.js";

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

    public getCurrent(): DateTime
    {
        return LuxonDateTime.now();
    }

    public startTimer(): Timer
    {
        return Clock.startTimer(this);
    }
}