import { EqualFunctions } from "./equalFunctions.js";
import { Iterable } from "./iterable.js";
import { Iterator } from "./iterator.js";
import { JavascriptIterable, JavascriptIterator } from "./javascript.js";
import { PreCondition } from "./preCondition.js";
import { SyncResult } from "./syncResult.js";
import { Type } from "./types.js";

/**
 * An {@link Iterable} that converts {@link TInput} values to {@link TOutput} values.
 */
export class MapIterable<TInput,TOutput> implements Iterable<TOutput>
{
    private readonly innerIterable: Iterable<TInput>;
    private readonly mapping: (value: TInput) => (TOutput | SyncResult<TOutput>);

    protected constructor(innerIterable: Iterable<TInput>, mapping: (value: TInput) => (TOutput | SyncResult<TOutput>))
    {
        PreCondition.assertNotUndefinedAndNotNull(innerIterable, "innerIterable");
        PreCondition.assertNotUndefinedAndNotNull(mapping, "mapping");

        this.innerIterable = innerIterable;
        this.mapping = mapping;
    }

    public static create<TInput,TOutput>(innerIterable: Iterable<TInput>, mapping: (value: TInput) => (TOutput | SyncResult<TOutput>)): MapIterable<TInput,TOutput>
    {
        return new MapIterable<TInput,TOutput>(innerIterable, mapping);
    }

    public iterate(): Iterator<TOutput>
    {
        return this.innerIterable.iterate().map(this.mapping);
    }

    public toArray(): SyncResult<TOutput[]>
    {
        return Iterable.toArray(this);
    }

    public equals(right: Iterable<TOutput>, equalFunctions?: EqualFunctions): SyncResult<boolean>
    {
        return Iterable.equals(this, right, equalFunctions);
    }

    public toString(): string
    {
        return Iterable.toString(this);
    }

    public concatenate(...toConcatenate: JavascriptIterable<TOutput>[]): Iterable<TOutput>
    {
        return Iterable.concatenate(this, ...toConcatenate);
    }

    public map<TOutput2>(mapping: (value: TOutput) => (TOutput2 | SyncResult<TOutput2>)): Iterable<TOutput2>
    {
        return Iterable.map(this, mapping);
    }

    public flatMap<TOutput2>(mapping: (value: TOutput) => JavascriptIterable<TOutput2>): Iterable<TOutput2>
    {
        return Iterable.flatMap(this, mapping);
    }

    public where(condition: (value: TOutput) => boolean): Iterable<TOutput>
    {
        return Iterable.where(this, condition);
    }

    public instanceOf<TOutput2 extends TOutput>(typeOrTypeCheck: Type<TOutput2> | ((value: TOutput) => value is TOutput2)): Iterable<TOutput2>
    {
        return Iterable.instanceOf(this, typeOrTypeCheck);
    }

    public [Symbol.iterator](): JavascriptIterator<TOutput>
    {
        return Iterable[Symbol.iterator](this);
    }

    public any(): SyncResult<boolean>
    {
        return this.innerIterable.any();
    }

    public getCount(): SyncResult<number>
    {
        return this.innerIterable.getCount();
    }

    public first(): SyncResult<TOutput>
    {
        return Iterable.first(this);
    }

    public last(): SyncResult<TOutput>
    {
        return Iterable.last(this);
    }

    public contains(value: TOutput, equalFunctions?: EqualFunctions): SyncResult<boolean>
    {
        return Iterable.contains(this, value, equalFunctions);
    }
}