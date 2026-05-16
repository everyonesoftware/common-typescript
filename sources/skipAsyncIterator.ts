import { PromiseAsyncResult } from "./promiseAsyncResult";
import { AsyncIterator } from "./asyncIterator";
import { JavascriptAsyncIterator } from "./javascript";
import { PreCondition } from "./preCondition";
import { Type } from "./types";

/**
 * An {@link AsyncIterator} that skips the first maximum number of values from an inner
 * {@link AsyncIterator} before beginning to return values.
 */
export class SkipAsyncIterator<T> implements AsyncIterator<T>
{
    private readonly innerIterator: AsyncIterator<T>;
    private started: boolean;
    private readonly maximumToSkip: number;

    private constructor(innerIterator: AsyncIterator<T>, maximumToSkip: number)
    {
        PreCondition.assertNotUndefinedAndNotNull(innerIterator, "innerIterator");
        PreCondition.assertNotUndefinedAndNotNull(maximumToSkip, "maximumToSkip");
        PreCondition.assertInteger(maximumToSkip, "maximumToSkip");
        PreCondition.assertGreaterThanOrEqualTo(maximumToSkip, 0, "maximumToSkip");

        this.innerIterator = innerIterator;
        this.started = false;
        this.maximumToSkip = maximumToSkip;
    }

    public static create<T>(innerIterator: AsyncIterator<T>, maximumToSkip: number): SkipAsyncIterator<T>
    {
        return new SkipAsyncIterator(innerIterator, maximumToSkip);
    }

    public next(): PromiseAsyncResult<boolean>
    {
        return PromiseAsyncResult.create(async () =>
        {
            if (!this.hasStarted())
            {
                this.started = true;
                await this.innerIterator.start();

                for (let i = 0; i < this.maximumToSkip; i++)
                {
                    if (!await this.innerIterator.next())
                    {
                        break;
                    }
                }
            }
            else
            {
                await this.innerIterator.next();
            }
            return this.hasCurrent();
        });
    }

    public hasStarted(): boolean
    {
        return this.started;
    }

    public hasCurrent(): boolean
    {
        return this.hasStarted() && this.innerIterator.hasCurrent();
    }

    public getCurrent(): T
    {
        PreCondition.assertTrue(this.hasCurrent(), "this.hasCurrent()");

        return this.innerIterator.getCurrent();
    }

    public start(): PromiseAsyncResult<this>
    {
        return AsyncIterator.start<T, this>(this);
    }

    public takeCurrent(): PromiseAsyncResult<T>
    {
        return AsyncIterator.takeCurrent(this);
    }

    public any(): PromiseAsyncResult<boolean>
    {
        return AsyncIterator.any(this);
    }

    public getCount(): PromiseAsyncResult<number>
    {
        return AsyncIterator.getCount(this);
    }

    public toArray(): PromiseAsyncResult<T[]>
    {
        return AsyncIterator.toArray(this);
    }

    public where(condition: (value: T) => (boolean | PromiseLike<boolean>)): AsyncIterator<T>
    {
        return AsyncIterator.where(this, condition);
    }

    public whereInstanceOf<U extends T>(typeCheck: (value: T) => value is U): AsyncIterator<U>
    {
        return AsyncIterator.whereInstanceOf(this, typeCheck);
    }

    public whereInstanceOfType<U extends T>(type: Type<U>): AsyncIterator<U>
    {
        return AsyncIterator.whereInstanceOfType(this, type);
    }

    public map<TOutput>(mapping: (value: T) => (TOutput | PromiseLike<TOutput>)): AsyncIterator<TOutput>
    {
        return AsyncIterator.map(this, mapping);
    }

    public first(condition?: (value: T) => (boolean | PromiseLike<boolean>)): PromiseAsyncResult<T>
    {
        return AsyncIterator.first(this, condition);
    }

    public last(condition?: (value: T) => (boolean | PromiseLike<boolean>)): PromiseAsyncResult<T>
    {
        return AsyncIterator.last(this, condition);
    }

    public [Symbol.asyncIterator](): JavascriptAsyncIterator<T>
    {
        return AsyncIterator[Symbol.asyncIterator](this);
    }

    public take(maximumToTake: number): AsyncIterator<T>
    {
        return AsyncIterator.take(this, maximumToTake);
    }

    public skip(maximumToSkip: number): AsyncIterator<T>
    {
        return AsyncIterator.skip(this, maximumToSkip);
    }
}