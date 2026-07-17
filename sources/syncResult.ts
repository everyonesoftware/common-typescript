import { PreCondition } from "./preCondition.js";
import { instanceOfType, isPromise, isPromiseLike, isUndefinedOrNull, Type } from "./types.js";
import { AsyncResult } from "./asyncResult.js";

export class SyncResult<T> implements AsyncResult<T>
{
    private value: T | undefined;
    private error: unknown | undefined;

    private constructor(value: T | undefined, error: unknown | undefined)
    {
        PreCondition.assertTrue(value === undefined || error === undefined, "value === undefined || error === undefined", "Either value or error must be undefined.");

        this.value = value;
        this.error = error;
    }

    public static create<T>(action: () => T): SyncResult<T>
    {
        PreCondition.assertNotUndefinedAndNotNull(action, "action");

        let value: T | undefined;
        let error: unknown | undefined;
        try
        {
            value = action();
        }
        catch (e)
        {
            error = e;
        }
        return new SyncResult(value, error);
    }

    public static value<T>(value: T): SyncResult<T>
    {
        return new SyncResult(value, undefined);
    }

    public static error<T>(error: unknown): SyncResult<T>
    {
        return new SyncResult<T>(undefined, error);
    }

    public await(): T
    {
        if (this.error)
        {
            throw this.error;
        }
        return this.value!;
    }

    public then<TResult1 = T, TResult2 = never>(onfullfilled?: ((value: T) => TResult1) | null, onrejected?: ((reason: unknown) => TResult2) | null): SyncResult<TResult1 | TResult2>;
    public then<TResult1 = T, TResult2 = never>(onfullfilled?: ((value: T) => (TResult1 | PromiseLike<TResult1>)) | null, onrejected?: ((reason: unknown) => (TResult2 | PromiseLike<TResult2>)) | null): SyncResult<TResult1 | TResult2>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => (TResult1 | PromiseLike<TResult1>)) | null, onrejected?: ((reason: unknown) => (TResult2 | PromiseLike<TResult2>)) | null): SyncResult<TResult1 | TResult2> | AsyncResult<TResult1 | TResult2>
    {
        let result: SyncResult<TResult1 | TResult2> | AsyncResult<TResult1 | TResult2>;
        if (this.error)
        {
            if (onrejected)
            {
                try
                {
                    const onRejectedResult: TResult2 | PromiseLike<TResult2> = onrejected(this.error);
                    if (onRejectedResult instanceof SyncResult || onRejectedResult instanceof AsyncResult)
                    {
                        result = onRejectedResult;
                    }
                    else if (isPromise<TResult2>(onRejectedResult))
                    {
                        result = AsyncResult.create(onRejectedResult);
                    }
                    else
                    {
                        result = SyncResult.value(onRejectedResult as TResult2);
                    }
                }
                catch (error)
                {
                    result = SyncResult.error(error);
                }
            }
            else
            {
                result = SyncResult.error<TResult2>(this.error);
            }
        }
        else
        {
            if (onfulfilled)
            {
                try
                {
                    const onFullfilledResult: TResult1 | PromiseLike<TResult1> = onfulfilled(this.value!);
                    if (onFullfilledResult instanceof SyncResult || onFullfilledResult instanceof AsyncResult)
                    {
                        result = onFullfilledResult;
                    }
                    else if (isPromise<TResult1>(onFullfilledResult))
                    {
                        result = AsyncResult.create(onFullfilledResult);
                    }
                    else
                    {
                        result = SyncResult.value(onFullfilledResult as TResult1);
                    }
                }
                catch (error)
                {
                    result = SyncResult.error(error);
                }
            }
            else
            {
                result = SyncResult.value<TResult1>(this.value as TResult1);
            }
        }
        return result;
    }

    public onValue(onValueFunction: (value: T) => void): SyncResult<T>;
    public onValue(onValueFunction: (value: T) => Promise<void>): AsyncResult<T>;
    onValue(onValueFunction: (value: T) => (void | Promise<void>)): SyncResult<T> | AsyncResult<T>
    {
        return this.then<T>((value: T) =>
        {
            let result: SyncResult<T> | AsyncResult<T>;
            try
            {
                const onValueFunctionResult: (void | Promise<void>) = onValueFunction(value);
                if (isPromise(onValueFunctionResult))
                {
                    result = AsyncResult.create(onValueFunctionResult.then(() => value));
                }
                else
                {
                    result = this;
                }
            }
            catch (error)
            {
                result = SyncResult.error(error);
            }
            return result;
        })
    }

    public catch<TResult = never>(onrejected: (reason: unknown) => TResult): SyncResult<T | TResult>;
    public catch<TResult = never>(onrejected?: ((reason: unknown) => TResult | PromiseLike<TResult>) | null): SyncResult<T | TResult> | AsyncResult<T | TResult>
    public catch<TError, TResult = never>(errorType: Type<TError>, onrejected: (reason: TError) => TResult): SyncResult<T | TResult>;
    public catch<TError, TResult = never>(errorType: Type<TError>, onrejected: (reason: TError) => PromiseLike<TResult>): AsyncResult<T | TResult>;
    catch<TResult = never>(errorTypeOrOnRejected?: Type<unknown> | ((reason: unknown) => TResult | PromiseLike<TResult>) | null, onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | null): SyncResult<T | TResult> | AsyncResult<T | TResult>
    {
        let errorType: Type<TypeError> | undefined;
        if (!isUndefinedOrNull(onrejected))
        {
            errorType = errorTypeOrOnRejected as Type<unknown>;

            PreCondition.assertNotUndefinedAndNotNull(errorType, "errorType");
        }
        else
        {
            onrejected = errorTypeOrOnRejected as ((reason: any) => TResult | PromiseLike<TResult>) | null;
        }
        PreCondition.assertNotUndefinedAndNotNull(onrejected, "onrejected");

        let result: SyncResult<T | TResult> | AsyncResult<T | TResult> = this;
        if (this.error && (!errorType || instanceOfType(this.error, errorType)))
        {
            try
            {
                const onRejectedResult: TResult | PromiseLike<TResult> = onrejected(this.error);
                if (onRejectedResult instanceof SyncResult || onRejectedResult instanceof AsyncResult)
                {
                    result = onRejectedResult;
                }
                else if (isPromise<TResult>(onRejectedResult))
                {
                    result = AsyncResult.create(onRejectedResult);
                }
                else
                {
                    result = SyncResult.value(onRejectedResult as TResult);
                }
            }
            catch (error)
            {
                result = SyncResult.error(error);
            }
        }
        return result;
    }

    public onError(onErrorFunction: (reason: unknown) => void): SyncResult<T>;
    public onError(onErrorFunction: (reason: unknown) => PromiseLike<void>): AsyncResult<T>;
    public onError<TError>(errorType: Type<TError>, onErrorFunction: (reason: TError) => void): SyncResult<T>;
    public onError<TError>(errorType: Type<TError>, onErrorFunction: (reason: TError) => PromiseLike<void>): AsyncResult<T>;
    onError(errorTypeOrOnErrorFunction: Type<unknown> | ((reason: unknown) => (void | PromiseLike<void>)), onErrorFunction?: (reason: unknown) => (void | PromiseLike<void>)): SyncResult<T> | AsyncResult<T>
    {
        let errorType: Type<TypeError> | undefined;
        if (!isUndefinedOrNull(onErrorFunction))
        {
            errorType = errorTypeOrOnErrorFunction as Type<unknown>;

            PreCondition.assertNotUndefinedAndNotNull(errorType, "errorType");
        }
        else
        {
            onErrorFunction = errorTypeOrOnErrorFunction as ((reason: any) => void | PromiseLike<void>);
        }
        PreCondition.assertNotUndefinedAndNotNull(onErrorFunction, "onErrorFunction");

        let result: SyncResult<T> | AsyncResult<T> = this;
        if (this.error && (!errorType || instanceOfType(this.error, errorType)))
        {
            try
            {
                const onErrorResult: void | PromiseLike<void> = onErrorFunction(this.error);
                if (isPromise(onErrorResult))
                {
                    result = AsyncResult.create(onErrorResult).then(() => this);
                }
            }
            catch (error)
            {
                result = SyncResult.error(error);
            }
        }
        return result;
    }

    public convertError(convertErrorFunction: (reason: unknown) => unknown): SyncResult<T>;
    public convertError(onErrorFunction: (reason: unknown) => PromiseLike<unknown>): AsyncResult<T>;
    public convertError<TError>(errorType: Type<TError>, convertErrorFunction: (reason: TError) => unknown): SyncResult<T>;
    public convertError<TError>(errorType: Type<TError>, convertErrorFunction: (reason: TError) => PromiseLike<unknown>): AsyncResult<T>;
    convertError(errorTypeOrConvertErrorFunction: Type<unknown> | ((reason: unknown) => (unknown | PromiseLike<unknown>)), convertErrorFunction?: (reason: unknown) => (unknown | PromiseLike<unknown>)): SyncResult<T> | AsyncResult<T>
    {
        let errorType: Type<TypeError> | undefined;
        if (!isUndefinedOrNull(convertErrorFunction))
        {
            errorType = errorTypeOrConvertErrorFunction as Type<unknown>;

            PreCondition.assertNotUndefinedAndNotNull(errorType, "errorType");
        }
        else
        {
            convertErrorFunction = errorTypeOrConvertErrorFunction as ((reason: any) => void | PromiseLike<void>);
        }
        PreCondition.assertNotUndefinedAndNotNull(convertErrorFunction, "convertErrorFunction");

        let result: SyncResult<T> | AsyncResult<T> = this;
        if (this.error && (!errorType || instanceOfType(this.error, errorType)))
        {
            try
            {
                const convertErrorResult: unknown | PromiseLike<unknown> = convertErrorFunction(this.error);
                if (isPromise(convertErrorResult))
                {
                    result = AsyncResult.error(convertErrorResult);
                }
                else
                {
                    result = SyncResult.error(convertErrorResult);
                }
            }
            catch (error)
            {
                result = SyncResult.error(error);
            }
        }
        return result;
    }

    public finally(onfinally?: (() => void) | null): SyncResult<T>
    public finally(onfinally?: (() => Promise<void>) | null): AsyncResult<T>
    finally(onfinally?: (() => (void | Promise<void>)) | null | undefined): AsyncResult<T> | SyncResult<T>
    {
        let result: AsyncResult<T> | SyncResult<T> = this;
        if (onfinally)
        {
            try
            {
                const onfinallyResult: void | Promise<void> = onfinally();
                if (isPromiseLike(onfinallyResult))
                {
                    result = AsyncResult.create(onfinallyResult).then(() => this);
                }
            }
            catch (error)
            {
                result = SyncResult.error(error);
            }
        }
        return result;
    }

    readonly [Symbol.toStringTag]: string = "SyncResult2";
}