import { PreCondition } from "./preCondition.js";
import { SyncDisposable } from "./SyncDisposable.js";

/**
 * An object that wraps around a value and provides functions for getting the value, setting the
 * value, and be notified when the value changes.
 */
export abstract class Property<T>
{
    /**
     * Get the value of this {@link Property}.
     */
    public abstract get(): T;

    /**
     * Set the value of this {@link Property}.
     * @param value The new value of this {@link Property}.
     */
    public abstract set(value: T): this;

    /**
     * Register the provided listener function to be run when this {@link Property}'s value changes.
     * @param listener The function to run when this {@link Property}'s value changes.
     */
    public abstract onChanged(listener: (newValue: T, oldValue: T) => unknown): SyncDisposable;

    /**
     * Get the string representation of this {@link Property}'s value.
     */
    public toString(): string
    {
        return `${this.get()}`;
    }

    public static toString<T>(property: Property<T>): string
    {
        PreCondition.assertNotUndefinedAndNotNull(property, "property");

        return `${property.get()}`;
    }
}