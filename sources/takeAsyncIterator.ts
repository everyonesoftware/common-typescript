import { AsyncIterator } from "./asyncIterator.js";
import { AsyncResult } from "./asyncResult.js";
import { JavascriptAsyncIterator } from "./javascript.js";
import { PreCondition } from "./preCondition.js";
import { Type } from "./types.js";

/**
 * An {@link AsyncIterator} that iterates over a maximum number of values.
 */
export class TakeAsyncIterator<T> implements AsyncIterator<T>
{
    private readonly innerIterator: AsyncIterator<T>;
    private started: boolean;
    private readonly maximumToTake: number;
    private taken: number;

    private constructor(innerIterator: AsyncIterator<T>, maximumToTake: number)
    {
        PreCondition.assertGreaterThanOrEqualTo(maximumToTake, 0, "maximumToTake");

        this.innerIterator = innerIterator;
        this.started = false;
        this.maximumToTake = maximumToTake;
        this.taken = 0;
    }

    public static create<T>(innerIterator: AsyncIterator<T>, maximumToTake: number)
    {
        return new TakeAsyncIterator(innerIterator, maximumToTake);
    }

    public hasCurrent(): boolean
    {
        return this.hasStarted() && this.taken <= this.maximumToTake && this.innerIterator.hasCurrent();
    }

    public next(): AsyncResult<boolean>
    {
        return AsyncResult.create(async () =>
        {
            if (this.maximumToTake <= 0)
            {
                return false;
            }
            else if (!this.hasStarted())
            {
                this.started = true;
                await this.innerIterator.start();
                this.taken++;
            }
            else if (this.taken <= this.maximumToTake)
            {
                await this.innerIterator.next();
                this.taken++;
            }
            return this.hasCurrent();
        });
    }

    public hasStarted(): boolean
    {
        return this.started;
    }

    public getCurrent(): T
    {
        PreCondition.assertTrue(this.hasCurrent(), "this.hasCurrent()");

        return this.innerIterator.getCurrent();
    }

    public start(): AsyncResult<this>
    {
        return AsyncIterator.start<T, this>(this);
    }

    public takeCurrent(): AsyncResult<T>
    {
        return AsyncIterator.takeCurrent(this);
    }

    public any(): AsyncResult<boolean>
    {
        return AsyncIterator.any(this);
    }

    public getCount(): AsyncResult<number>
    {
        return AsyncIterator.getCount(this);
    }

    public toArray(): AsyncResult<T[]>
    {
        return AsyncIterator.toArray(this);
    }

    public where(condition: (value: T) => boolean): AsyncIterator<T>
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

    public first(condition?: (value: T) => (boolean | PromiseLike<boolean>)): AsyncResult<T>
    {
        return AsyncIterator.first(this, condition);
    }

    public last(condition?: (value: T) => (boolean | PromiseLike<boolean>)): AsyncResult<T>
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