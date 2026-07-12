import { DateTime } from "./dateTime.js";
import { RealClock } from "./RealClock.js";

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
    public abstract now(): DateTime;
}