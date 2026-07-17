import { PromiseAsyncResult } from "./promiseAsyncResult.js";
import { Type } from "./types.js";

/**
 * A result object that adds extra behavior beyond the standard {@link Promise}.
 */
export abstract class AsyncResult<T> implements Promise<T>
{
    public static create<T>(actionOrPromise: (() => (T | Promise<T>)) | Promise<T>): AsyncResult<T>
    {
        return PromiseAsyncResult.create<T>(actionOrPromise);
    }

    /**
     * Get an {@link AsyncResult} that is already completed and doesn't do anything.
     */
    public static empty(): AsyncResult<void>
    {
        return PromiseAsyncResult.empty();
    }

    /**
     * Create a new {@link AsyncResult} that contains the provided value.
     * @param value The value to wrap in a {@link AsyncResult}.
     */
    public static value<T>(value: T): AsyncResult<T>
    {
        return PromiseAsyncResult.value(value);
    }

    /**
     * Create a new {@link AsyncResult} that contains the provided error.
     * @param error The error to wrap in a {@link AsyncResult}.
     */
    public static error<T>(error: unknown): AsyncResult<T>
    {
        return PromiseAsyncResult.error<T>(error);
    }

    public static yield(): AsyncResult<void>
    {
        return PromiseAsyncResult.yield();
    }

    /**
     * Get a {@link AsyncResult} that runs the provided function if this {@link AsyncResult} is successful.
     * @param thenFunction The function to run if this {@link AsyncResult} is successful.
     */
    public abstract then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | null | undefined, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null | undefined): AsyncResult<TResult1 | TResult2>

    /**
     * Run the provided onValueFunction if this {@link AsyncResult} is successful. The value or error
     * contained by this {@link AsyncResult} will be contained by the returned {@link AsyncResult}.
     * @param onValueFunction The function to run if this {@link AsyncResult} is successful.
     */
    public abstract onValue(onValueFunction: (value: T) => (void | Promise<void>)): AsyncResult<T>

    /**
     * Run the provided catchFunction if this {@link AsyncResult} contains an error.
     * @param catchFunction The function to run if an error is caught.
     */
    public abstract catch<TResult = never>(onrejected?: ((reason: unknown) => TResult | PromiseLike<TResult>) | null): AsyncResult<T | TResult>
    /**
     * Run the provided catchFunction if this {@link AsyncResult} contains an error of the provided type.
     * @param errorType The type of error to catch.
     * @param catchFunction The function to run if the error is caught.
     */
    public abstract catch<TError,TResult = never>(errorType: Type<TError>, onrejected: (reason: TError) => (TResult | PromiseLike<TResult>)): AsyncResult<T | TResult>

    /**
     * Run the provided onErrorFunction if this {@link AsyncResult} contains an error.
     * @param onErrorFunction The function to run if an error is found.
     */
    public abstract onError(onErrorFunction: (reason: unknown) => (void | PromiseLike<void>)): AsyncResult<T>;
    /**
     * Run the provided onErrorFunction if this {@link AsyncResult} contains an error of the provided
     * type.
     * @param errorType The type of error to respond to.
     * @param onErrorFunction The function to run if the error is found.
     */
    public abstract onError<TError>(errorType: Type<TError>, onErrorFunction: (reason: TError) => (void | PromiseLike<void>)): AsyncResult<T>;

    /**
     * Run the provided convertErrorFunction if this {@link AsyncResult} contains an error. The value
     * returned from the convertErrorFunction will be the error for the returned {@link AsyncResult}.
     * @param convertErrorFunction The function that will return the new error. 
     */
    public abstract convertError(convertErrorFunction: (reason: unknown) => (unknown | PromiseLike<unknown>)): AsyncResult<T>;
    /**
     * Run the provided convertErrorFunction if this {@link AsyncResult} contains an error of the
     * provided type. The value returned from the convertErrorFunction will be the error for the
     * returned {@link AsyncResult}.
     * @param errorType The type of error to respond to.
     * @param convertErrorFunction The function that will return the new error. 
     */
    public abstract convertError<TError>(errorType: Type<TError>, convertErrorFunction: (reason: TError) => (unknown | PromiseLike<unknown>)): AsyncResult<T>;

    public abstract finally(onfinally?: (() => (void | Promise<void>)) | null): AsyncResult<T>;

    readonly abstract [Symbol.toStringTag]: string;
}
