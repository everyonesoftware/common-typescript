import { Iterator } from "./iterator.js";
import { JavascriptIterable, JavascriptIterator } from "./javascript.js";
import { PreCondition } from "./preCondition.js";
import { SyncResult } from "./syncResult.js";
import { Type } from "./types.js";

/**
 * An {@link Iterator} that maps {@link TInput} values to {@link TOutput} values.
 */
export class MapIterator<TInput, TOutput> implements Iterator<TOutput>
{
    private readonly inputIterator: Iterator<TInput>;
    private readonly mapping: (value: TInput) => (TOutput | SyncResult<TOutput>);
    private started: boolean;

    protected constructor(inputIterator: Iterator<TInput>, mapping: (value: TInput) => (TOutput | SyncResult<TOutput>))
    {
        PreCondition.assertNotUndefinedAndNotNull(inputIterator, "inputIterator");
        PreCondition.assertNotUndefinedAndNotNull(mapping, "mapping");

        this.inputIterator = inputIterator;
        this.mapping = mapping;
        this.started = false;
    }

    public static create<TInput, TOutput>(inputIterator: Iterator<TInput>, mapping: (value: TInput) => (TOutput | SyncResult<TOutput>)): MapIterator<TInput, TOutput>
    {
        return new MapIterator(inputIterator, mapping);
    }

    public next(): SyncResult<boolean>
    {
        return SyncResult.create(() =>
        {
            if (!this.hasStarted())
            {
                this.started = true;
                this.inputIterator.start();
            }
            else
            {
                this.inputIterator.next();
            }
            return this.inputIterator.hasCurrent();
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

        const mappingResult: TOutput | SyncResult<TOutput> = this.mapping(this.inputIterator.getCurrent());
        return mappingResult instanceof SyncResult ? mappingResult.await() : mappingResult;
    }

    public start(): SyncResult<this>
    {
        return Iterator.start<TOutput, this>(this);
    }

    public takeCurrent(): SyncResult<TOutput>
    {
        return Iterator.takeCurrent(this);
    }

    public any(): SyncResult<boolean>
    {
        return Iterator.any(this);
    }

    public getCount(): SyncResult<number>
    {
        return Iterator.getCount(this);
    }

    public toArray(): SyncResult<TOutput[]>
    {
        return Iterator.toArray(this);
    }

    public concatenate(toConcatenate: JavascriptIterable<TOutput>): Iterator<TOutput>
    {
        return Iterator.concatenate(this, toConcatenate);
    }

    public map<TOutput2>(mapping: (value: TOutput) => (TOutput2 | SyncResult<TOutput2>)): Iterator<TOutput2>
    {
        return Iterator.map(this, mapping);
    }

    public flatMap<TOutput2>(mapping: (value: TOutput) => JavascriptIterable<TOutput2>): Iterator<TOutput2>
    {
        return Iterator.flatMap(this, mapping);
    }

    public [Symbol.iterator](): JavascriptIterator<TOutput>
    {
        return Iterator[Symbol.iterator](this);
    }

    public first(condition?: (value: TOutput) => boolean): SyncResult<TOutput>
    {
        return Iterator.first(this, condition);
    }

    public last(): SyncResult<TOutput>
    {
        return Iterator.last(this);
    }

    public where(condition: (value: TOutput) => boolean): Iterator<TOutput>
    {
        return Iterator.where(this, condition);
    }

    public whereInstanceOf<U extends TOutput>(typeCheck: (value: TOutput) => value is U): Iterator<U>
    {
        return Iterator.whereInstanceOf(this, typeCheck);
    }

    public whereInstanceOfType<U extends TOutput>(type: Type<U>): Iterator<U>
    {
        return Iterator.whereInstanceOfType(this, type);
    }

    public take(maximumToTake: number): Iterator<TOutput>
    {
        return Iterator.take(this, maximumToTake);
    }

    public skip(maximumToSkip: number): Iterator<TOutput>
    {
        return Iterator.skip(this, maximumToSkip);
    }
}