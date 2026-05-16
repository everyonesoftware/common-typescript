import { PromiseAsyncResult } from "./promiseAsyncResult";
import { SyncResult } from "./syncResult";
import { isPromise, Type } from "./types";

/**
 * A result object that adds extra behavior beyond the standard {@link Promise}.
 */
export abstract class Result<T> implements Promise<T>
{
    /**
     * Create a new {@link SyncResult} that contains the result of the provided function.
     * @param action The function to run.
     */
    public static createSync<T>(action: () => T): SyncResult<T>
    {
        return SyncResult.create<T>(action);
    }

    public static createAsync<T>(action: () => (T | Promise<T>)): PromiseAsyncResult<T>;
    public static createAsync<T>(promise: Promise<T>): PromiseAsyncResult<T>;
    static createAsync<T>(actionOrPromise: (() => (T | Promise<T>)) | Promise<T>): PromiseAsyncResult<T>
    {
        return PromiseAsyncResult.create<T>(isPromise<T>(actionOrPromise) ? actionOrPromise : new Promise<T>(actionOrPromise));
    }

    /**
     * Create a new {@link Result} that contains the provided value.
     * @param value The value to wrap in a {@link Result}.
     */
    public static value<T>(value: T): SyncResult<T>
    {
        return SyncResult.value(value);
    }

    /**
     * Create a new {@link Result} that contains the provided error.
     * @param error The error to wrap in a {@link Result}.
     */
    public static error<T>(error: Error): SyncResult<T>
    {
        return SyncResult.error<T>(error);
    }

    public static yield(): PromiseAsyncResult<void>
    {
        return PromiseAsyncResult.yield();
    }

    /**
     * Get a {@link Result} that runs the provided function if this {@link Result} is successful.
     * @param thenFunction The function to run if this {@link Result} is successful.
     */
    public abstract then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | null | undefined, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null | undefined): Result<TResult1 | TResult2>

    /**
     * Run the provided onValueFunction if this {@link Result} is successful. The value or error
     * contained by this {@link Result} will be contained by the returned {@link Result}.
     * @param onValueFunction The function to run if this {@link Result} is successful.
     */
    public abstract onValue(onValueFunction: (value: T) => (void | Promise<void>)): Result<T>

    /**
     * Run the provided catchFunction if this {@link Result} contains an error.
     * @param catchFunction The function to run if an error is caught.
     */
    public abstract catch<TResult = never>(onrejected?: ((reason: unknown) => TResult | PromiseLike<TResult>) | null): Result<T | TResult>
    /**
     * Run the provided catchFunction if this {@link Result} contains an error of the provided type.
     * @param errorType The type of error to catch.
     * @param catchFunction The function to run if the error is caught.
     */
    public abstract catch<TError,TResult = never>(errorType: Type<TError>, onrejected: (reason: TError) => (TResult | PromiseLike<TResult>)): Result<T | TResult>

    /**
     * Run the provided onErrorFunction if this {@link Result} contains an error.
     * @param onErrorFunction The function to run if an error is found.
     */
    public abstract onError(onErrorFunction: (reason: unknown) => (void | PromiseLike<void>)): Result<T>;
    /**
     * Run the provided onErrorFunction if this {@link Result} contains an error of the provided
     * type.
     * @param errorType The type of error to respond to.
     * @param onErrorFunction The function to run if the error is found.
     */
    public abstract onError<TError>(errorType: Type<TError>, onErrorFunction: (reason: TError) => (void | PromiseLike<void>)): Result<T>;

    /**
     * Run the provided convertErrorFunction if this {@link Result} contains an error. The value
     * returned from the convertErrorFunction will be the error for the returned {@link Result}.
     * @param convertErrorFunction The function that will return the new error. 
     */
    public abstract convertError(convertErrorFunction: (reason: unknown) => (unknown | PromiseLike<unknown>)): Result<T>;
    /**
     * Run the provided convertErrorFunction if this {@link Result} contains an error of the
     * provided type. The value returned from the convertErrorFunction will be the error for the
     * returned {@link Result}.
     * @param errorType The type of error to respond to.
     * @param convertErrorFunction The function that will return the new error. 
     */
    public abstract convertError<TError>(errorType: Type<TError>, convertErrorFunction: (reason: TError) => (unknown | PromiseLike<unknown>)): Result<T>;

    public abstract finally(onfinally?: (() => (void | Promise<void>)) | null): Result<T>;

    readonly abstract [Symbol.toStringTag]: string;
}
