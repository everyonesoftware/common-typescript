import { AsyncIterator } from "./asyncIterator.js";
import { PromiseAsyncResult } from "./promiseAsyncResult.js";
import { JavascriptAsyncIterator } from "./javascript.js";
import { PreCondition } from "./preCondition.js";
import { Type } from "./types.js";

/**
 * An {@link Iterator} that only returns values that match a condition.
 */
export class WhereAsyncIterator<T> implements AsyncIterator<T>
{
    private readonly innerIterator: AsyncIterator<T>;
    private started: boolean;
    private readonly condition: (value: T) => (boolean | PromiseLike<boolean>);

    private constructor(innerIterator: AsyncIterator<T>, condition: (value: T) => (boolean | PromiseLike<boolean>))
    {
        PreCondition.assertNotUndefinedAndNotNull(innerIterator, "innerIterator");
        PreCondition.assertNotUndefinedAndNotNull(condition, "condition");

        this.innerIterator = innerIterator;
        this.started = false;
        this.condition = condition;
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

    public static create<T>(innerIterator: AsyncIterator<T>, condition: (value: T) => (boolean | PromiseLike<boolean>)): WhereAsyncIterator<T>
    {
        return new WhereAsyncIterator(innerIterator, condition);
    }

    public next(): PromiseAsyncResult<boolean>
    {
        return PromiseAsyncResult.create(async () =>
        {
            if (!this.hasStarted())
            {
                await this.innerIterator.start();
                this.started = true;

                while (this.hasCurrent() && !await this.condition(this.getCurrent()))
                {
                    await this.innerIterator.next();
                }
            }
            else
            {
                do
                {
                    await this.innerIterator.next();
                }
                while (this.hasCurrent() && !await this.condition(this.getCurrent()));
            }
            return this.hasCurrent();
        });
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

    public map<TOutput>(mapping: (value: T) => (TOutput | PromiseLike<TOutput>)): AsyncIterator<TOutput>
    {
        return AsyncIterator.map(this, mapping);
    }

    public whereInstanceOf<U extends T>(typeCheck: (value: T) => value is U): AsyncIterator<U>
    {
        return AsyncIterator.whereInstanceOf(this, typeCheck);
    }

    public whereInstanceOfType<U extends T>(type: Type<U>): AsyncIterator<U>
    {
        return AsyncIterator.whereInstanceOfType(this, type);
    }

    public first(condition?: (value: T) => (boolean | PromiseLike<boolean>)): PromiseAsyncResult<T>
    {
        return AsyncIterator.first(this, condition);
    }

    public last(condition?: (value: T) => (boolean | PromiseLike<boolean>)): PromiseAsyncResult<T>
    {
        return AsyncIterator.last(this, condition);
    }

    public take(maximumToTake: number): AsyncIterator<T>
    {
        return AsyncIterator.take(this, maximumToTake);
    }

    public skip(maximumToSkip: number): AsyncIterator<T>
    {
        return AsyncIterator.skip(this, maximumToSkip);
    }

    public [Symbol.asyncIterator](): JavascriptAsyncIterator<T>
    {
        return AsyncIterator[Symbol.asyncIterator](this);
    }
}