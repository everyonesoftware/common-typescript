import { PreCondition } from "./preCondition.js";
import { Type } from "./types.js";
import { AsyncIterator } from "./asyncIterator.js";
import { AsyncResult } from "./asyncResult.js";
import { JavascriptAsyncIterator } from "./javascript.js";

/**
 * An {@link AsyncIterator} that maps {@link TInput} values to {@link TOutput} values.
 */
export class MapAsyncIterator<TInput, TOutput> implements AsyncIterator<TOutput>
{
    private readonly inputIterator: AsyncIterator<TInput>;
    private readonly mapping: (value: TInput) => (TOutput | PromiseLike<TOutput>);
    private current: TOutput | undefined;
    private started: boolean;

    protected constructor(inputIterator: AsyncIterator<TInput>, mapping: (value: TInput) => (TOutput | PromiseLike<TOutput>))
    {
        PreCondition.assertNotUndefinedAndNotNull(inputIterator, "inputIterator");
        PreCondition.assertNotUndefinedAndNotNull(mapping, "mapping");

        this.inputIterator = inputIterator;
        this.mapping = mapping;
        this.started = false;
    }

    public static create<TInput, TOutput>(inputIterator: AsyncIterator<TInput>, mapping: (value: TInput) => (TOutput | PromiseLike<TOutput>)): MapAsyncIterator<TInput, TOutput>
    {
        return new MapAsyncIterator(inputIterator, mapping);
    }

    public next(): AsyncResult<boolean>
    {
        return AsyncResult.create(async () =>
        {
            if (!this.hasStarted())
            {
                this.started = true;
                await this.inputIterator.start();
            }
            else
            {
                await this.inputIterator.next();
            }

            const result: boolean = this.inputIterator.hasCurrent();
            this.current = result
                ? await this.mapping(this.inputIterator.getCurrent())
                : undefined;

            return result;
        });
    }

    public hasStarted(): boolean
    {
        return this.started;
    }

    public hasCurrent(): boolean
    {
        return this.hasStarted() && this.inputIterator.hasCurrent();
    }

    public getCurrent(): TOutput
    {
        PreCondition.assertTrue(this.hasCurrent(), "this.hasCurrent()");

        return this.current!;
    }

    public start(): AsyncResult<this>
    {
        return AsyncIterator.start<TOutput, this>(this);
    }

    public takeCurrent(): AsyncResult<TOutput>
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

    public toArray(): AsyncResult<TOutput[]>
    {
        return AsyncIterator.toArray(this);
    }

    public map<TOutput2>(mapping: (value: TOutput) => (TOutput2 | PromiseLike<TOutput2>)): AsyncIterator<TOutput2>
    {
        return AsyncIterator.map(this, mapping);
    }

    public [Symbol.asyncIterator](): JavascriptAsyncIterator<TOutput>
    {
        return AsyncIterator[Symbol.asyncIterator](this);
    }

    public first(condition?: (value: TOutput) => boolean): AsyncResult<TOutput>
    {
        return AsyncIterator.first(this, condition);
    }

    public last(): AsyncResult<TOutput>
    {
        return AsyncIterator.last(this);
    }

    public where(condition: (value: TOutput) => (boolean | PromiseLike<boolean>)): AsyncIterator<TOutput>
    {
        return AsyncIterator.where(this, condition);
    }

    public whereInstanceOf<U extends TOutput>(typeCheck: (value: TOutput) => value is U): AsyncIterator<U>
    {
        return AsyncIterator.whereInstanceOf(this, typeCheck);
    }

    public whereInstanceOfType<U extends TOutput>(type: Type<U>): AsyncIterator<U>
    {
        return AsyncIterator.whereInstanceOfType(this, type);
    }

    public take(maximumToTake: number): AsyncIterator<TOutput>
    {
        return AsyncIterator.take(this, maximumToTake);
    }

    public skip(maximumToSkip: number): AsyncIterator<TOutput>
    {
        return AsyncIterator.skip(this, maximumToSkip);
    }
}