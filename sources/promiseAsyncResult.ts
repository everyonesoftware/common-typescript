import { PreCondition } from "./preCondition";
import { AsyncResult } from "./asyncResult";
import { instanceOfType, isPromise, isUndefinedOrNull, Type } from "./types";

export class PromiseAsyncResult<T> implements AsyncResult<T>
{
    private readonly promise: Promise<T>;

    private constructor(promise: Promise<T>)
    {
        PreCondition.assertNotUndefinedAndNotNull(promise, "promise");

        this.promise = promise;
    }

    public static create<T>(action: () => (T | Promise<T>)): PromiseAsyncResult<T>;
    public static create<T>(promise: Promise<T>): PromiseAsyncResult<T>;
    static create<T>(actionOrPromise: (() => (T | Promise<T>)) | Promise<T>): PromiseAsyncResult<T>
    {
        PreCondition.assertNotUndefinedAndNotNull(actionOrPromise, "action or promise");

        return new PromiseAsyncResult(Promise.resolve(isPromise<T>(actionOrPromise) ? actionOrPromise : actionOrPromise()));
    }

    public static value<T>(value: T): PromiseAsyncResult<T>
    {
        return PromiseAsyncResult.create(Promise.resolve(value));
    }

    public static error<T>(error: unknown): PromiseAsyncResult<T>
    {
        return PromiseAsyncResult.create(Promise.reject(error));
    }

    public static yield(): PromiseAsyncResult<void>
    {
        return PromiseAsyncResult.create(Promise.resolve());
    }

    public then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | null | undefined, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null | undefined): PromiseAsyncResult<TResult1 | TResult2>
    {
        return PromiseAsyncResult.create(this.promise.then(onfulfilled, onrejected));
    }

    public onValue(onValueFunction: (value: T) => (void | Promise<void>)): PromiseAsyncResult<T>
    {
        return this.then<T>(async (value: T) =>
        {
            let result: PromiseAsyncResult<T>;
            try
            {
                await onValueFunction(value);
                result = this;
            }
            catch (error)
            {
                result = PromiseAsyncResult.error(error);
            }
            return result;
        })
    }

    public catch<TResult = never>(onrejected?: ((reason: unknown) => TResult | PromiseLike<TResult>) | null): PromiseAsyncResult<T | TResult>
    public catch<TError,TResult = never>(errorType: Type<TError>, onrejected: (reason: TError) => (TResult | PromiseLike<TResult>)): PromiseAsyncResult<T | TResult>
    catch<TResult = never>(errorTypeOrOnRejected?: Type<Error> | ((reason: unknown) => TResult | PromiseLike<TResult>) | null, onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | null): PromiseAsyncResult<T | TResult>
    {
        let errorType: Type<Error> | undefined;
        if (!isUndefinedOrNull(onrejected))
        {
            errorType = errorTypeOrOnRejected as Type<unknown>;

            PreCondition.assertNotUndefinedAndNotNull(errorType, "errorType");
        }
        else
        {
            onrejected = errorTypeOrOnRejected as ((reason: any) => TResult | PromiseLike<TResult>) | null;
        }

        return PromiseAsyncResult.create<T | TResult>(this.promise.catch((reason: unknown) =>
        {
            let value: TResult | PromiseLike<TResult> | undefined;
            if (errorType && !instanceOfType(reason, errorType))
            {
                throw reason;
            }
            else if (!isUndefinedOrNull(onrejected))
            {
                value = onrejected(reason);
            }
            return value!;
        }));
    }

    public onError(onErrorFunction: (reason: unknown) => (void | PromiseLike<void>)): PromiseAsyncResult<T>;
    public onError<TError>(errorType: Type<TError>, onErrorFunction: (reason: TError) => (void | PromiseLike<void>)): PromiseAsyncResult<T>;
    onError(errorTypeOrOnErrorFunction: Type<unknown> | ((reason: unknown) => (void | PromiseLike<void>)), onErrorFunction?: (reason: unknown) => (void | PromiseLike<void>)): PromiseAsyncResult<T>
    {
        let errorType: Type<unknown> | undefined;
        if (!isUndefinedOrNull(onErrorFunction))
        {
            errorType = errorTypeOrOnErrorFunction as Type<unknown>;

            PreCondition.assertNotUndefinedAndNotNull(errorType, "errorType");
        }
        else
        {
            onErrorFunction = errorTypeOrOnErrorFunction as ((reason: unknown) => void | PromiseLike<void>);
        }
        PreCondition.assertNotUndefinedAndNotNull(onErrorFunction, "onErrorFunction");

        let result: PromiseAsyncResult<T>;
        if (errorType)
        {
            result = this.catch(errorType, async (reason: unknown) =>
            {
                await onErrorFunction(reason);
                throw reason;
            });
        }
        else
        {
            result = this.catch(async (reason: unknown) =>
            {
                await onErrorFunction(reason);
                throw reason;
            });
        }

        return result;
    }

    public convertError(convertErrorFunction: (reason: unknown) => (unknown | PromiseLike<unknown>)): PromiseAsyncResult<T>;
    public convertError<TError>(errorType: Type<TError>, convertErrorFunction: (reason: TError) => (unknown | PromiseLike<unknown>)): PromiseAsyncResult<T>;
    convertError(errorTypeOrConvertErrorFunction: Type<unknown> | ((reason: unknown) => (unknown | PromiseLike<unknown>)), convertErrorFunction?: (reason: unknown) => (unknown | PromiseLike<unknown>)): PromiseAsyncResult<T>
    {
        let errorType: Type<unknown> | undefined;
        if (!isUndefinedOrNull(convertErrorFunction))
        {
            errorType = errorTypeOrConvertErrorFunction as Type<unknown>;

            PreCondition.assertNotUndefinedAndNotNull(errorType, "errorType");
        }
        else
        {
            convertErrorFunction = errorTypeOrConvertErrorFunction as ((reason: unknown) => void | PromiseLike<void>);
        }
        PreCondition.assertNotUndefinedAndNotNull(convertErrorFunction, "convertErrorFunction");

        let result: PromiseAsyncResult<T>;
        if (errorType)
        {
            result = this.catch(errorType, async (reason: unknown) =>
            {
                throw await convertErrorFunction(reason);
            });
        }
        else
        {
            result = this.catch(async (reason: unknown) =>
            {
                throw await convertErrorFunction(reason);
            });
        }

        return result;
    }

    public finally(onfinally?: (() => (void | Promise<void>)) | null): PromiseAsyncResult<T>
    {
        return PromiseAsyncResult.create(this.promise.finally(onfinally));
    }
    
    readonly [Symbol.toStringTag]: string = "AsyncResult";
}