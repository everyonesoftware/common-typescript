import { JavascriptIterable, JavascriptIterator } from "./javascript.js";
import { PreCondition } from "./preCondition.js";
import { Iterator } from "./iterator.js";
import { SyncResult } from "./syncResult.js";
import { Type } from "./types.js";

export class FlatMapIterator<TInput,TOutput> implements Iterator<TOutput>
{
    private readonly innerIterator: Iterator<TInput>;
    private readonly mapping: (value: TInput) => JavascriptIterable<TOutput>;
    private mappingIterator: Iterator<TOutput> | undefined;
    private started: boolean;

    private constructor(innerIterator: Iterator<TInput>, mapping: (value: TInput) => JavascriptIterable<TOutput>)
    {
        PreCondition.assertNotUndefinedAndNotNull(innerIterator, "innerIterator");
        PreCondition.assertNotUndefinedAndNotNull(mapping, "mapping");

        this.innerIterator = innerIterator;
        this.mapping = mapping;
        this.started = false;
    }

    public static create<TInput,TOutput>(innerIterator: Iterator<TInput>, mapping: (value: TInput) => JavascriptIterable<TOutput>): FlatMapIterator<TInput,TOutput>
    {
        return new FlatMapIterator(innerIterator, mapping);
    }

    public next(): SyncResult<boolean>
    {
        return SyncResult.create(() =>
        {
            this.innerIterator.start().await();

            while (this.innerIterator.hasCurrent())
            {
                if (this.mappingIterator === undefined)
                {
                    this.mappingIterator = Iterator.create(this.mapping(this.innerIterator.getCurrent()));
                }

                if (this.mappingIterator.next().await())
                {
                    break;
                }
                else if (this.innerIterator.next().await())
                {
                    this.mappingIterator = undefined;
                }
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
        return this.mappingIterator?.hasCurrent() ?? false;
    }

    public getCurrent(): TOutput
    {
        PreCondition.assertTrue(this.hasCurrent(), "this.hasCurrent()");

        return this.mappingIterator!.getCurrent();
    }

    public start(): SyncResult<this>
    {
        return Iterator.start<TOutput,this>(this);
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

    public concatenate(...toConcatenate: JavascriptIterable<TOutput>[]): Iterator<TOutput>
    {
        return Iterator.concatenate(this, ...toConcatenate);
    }

    public where(condition: (value: TOutput) => (boolean | SyncResult<boolean>)): Iterator<TOutput>
    {
        return Iterator.where(this, condition);
    }

    public map<TOutput2>(mapping: (value: TOutput) => (TOutput2 | SyncResult<TOutput2>)): Iterator<TOutput2>
    {
        return Iterator.map(this, mapping);
    }

    public flatMap<TOutput2>(mapping: (value: TOutput) => JavascriptIterable<TOutput2>): Iterator<TOutput2>
    {
        return Iterator.flatMap(this, mapping);
    }

    public whereInstanceOf<U extends TOutput>(typeCheck: (value: TOutput) => value is U): Iterator<U>
    {
        return Iterator.whereInstanceOf(this, typeCheck);
    }

    public whereInstanceOfType<U extends TOutput>(type: Type<U>): Iterator<U>
    {
        return Iterator.whereInstanceOfType(this, type);
    }

    public first(condition?: ((value: TOutput) => (boolean | SyncResult<boolean>)) | undefined): SyncResult<TOutput>
    {
        return Iterator.first(this, condition);
    }

    public last(condition?: ((value: TOutput) => (boolean | SyncResult<boolean>)) | undefined): SyncResult<TOutput>
    {
        return Iterator.last(this, condition);
    }

    public take(maximumToTake: number): Iterator<TOutput>
    {
        return Iterator.take(this, maximumToTake);
    }

    public skip(maximumToSkip: number): Iterator<TOutput>
    {
        return Iterator.skip(this, maximumToSkip);
    }

    public [Symbol.iterator](): JavascriptIterator<TOutput>
    {
        return Iterator[Symbol.iterator](this);
    }
}