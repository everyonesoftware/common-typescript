import { EqualFunctions } from "./equalFunctions.js";
import { JavascriptIterable } from "./javascript.js";
import { ListQueue } from "./listQueue.js";
import { ListStack } from "./listStack.js";
import { AsyncResult } from "./asyncResult.js";

/**
 * A data structure that stores values in a first-in-first-out order.
 */
export abstract class Queue<T>
{
    /**
     * Create an instance of the default {@link Queue} implementation.
     * @returns A new {@link Queue} object.
     */
    public static create<T>(): ListQueue<T>
    {
        return ListQueue.create();
    }

    /**
     * Get whether there are any values in this {@link Stack}.
     */
    public abstract any(): AsyncResult<boolean>;

    /**
     * Add the provided value onto the end of this {@link Queue}.
     * @param value The value to add to the end of this {@link Queue}.
     */
    public abstract add(value: T): AsyncResult<void>;

    /**
     * Add the provided values to the end of this {@link Queue}.
     * @param values The values to add to the end of this {@link Queue}.
     */
    public abstract addAll(values: JavascriptIterable<T>): AsyncResult<void>;

    /**
     * Remove the next value off of this {@link Queue}.
     */
    public abstract remove(): AsyncResult<T>;

    /**
     * Get whether this {@link Stack} contains the provided value.
     * @param value The value to look for.
     * @param equalFunctions The functions to use to compare values.
     */
    public abstract contains(value: T, equalFunctions?: EqualFunctions): AsyncResult<boolean>;
}