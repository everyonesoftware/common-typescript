import { EqualFunctions } from "./equalFunctions";
import { JavascriptIterable } from "./javascript";
import { ListStack } from "./listStack";
import { AsyncResult } from "./asyncResult";

/**
 * A data structure that stores values in a first-in-last-out order.
 */
export abstract class Stack<T>
{
    /**
     * Create an instance of the default {@link Stack} implementation.
     * @returns A new {@link Stack} object.
     */
    public static create<T>(): ListStack<T>
    {
        return ListStack.create();
    }

    /**
     * Get whether there are any values in this {@link Stack}.
     */
    public abstract any(): AsyncResult<boolean>;

    /**
     * Get the number of values that are currently in this {@link Stack}.
     */
    public abstract getCount(): AsyncResult<number>;

    /**
     * Push the provided value onto the top of this {@link Stack}.
     * @param value The value to push on the top of this {@link Stack}.
     */
    public abstract add(value: T): AsyncResult<void>;

    /**
     * Push the provided values onto the top of this {@link Stack}.
     * @param values The values to push onto this {@link Stack}.
     */
    public abstract addAll(values: JavascriptIterable<T>): AsyncResult<void>;

    /**
     * Remove the top value off of this {@link Stack}.
     */
    public abstract remove(): AsyncResult<T>;

    /**
     * Get whether this {@link Stack} contains the provided value.
     * @param value The value to look for.
     * @param equalFunctions The functions to use to compare values.
     */
    public abstract contains(value: T, equalFunctions?: EqualFunctions): AsyncResult<boolean>;
}