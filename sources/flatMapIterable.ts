import { EqualFunctions } from "./equalFunctions.js";
import { Iterable } from "./iterable.js";
import { Iterator } from "./iterator.js";
import { JavascriptIterable, JavascriptIterator } from "./javascript.js";
import { PreCondition } from "./preCondition.js";
import { SyncResult } from "./syncResult.js";
import { ToStringFunctions } from "./toStringFunctions.js";
import { Type } from "./types.js";

export class FlatMapIterable<TInput,TOutput> implements Iterable<TOutput>
{
    private readonly innerIterable: Iterable<TInput>;
    private readonly mapping: (value: TInput) => JavascriptIterable<TOutput>;

    private constructor(innerIterable: Iterable<TInput>, mapping: (value: TInput) => JavascriptIterable<TOutput>)
    {

        PreCondition.assertNotUndefinedAndNotNull(innerIterable, "innerIterable");
        PreCondition.assertNotUndefinedAndNotNull(mapping, "mapping");

        this.innerIterable = innerIterable;
        this.mapping = mapping;
    }

    public static create<TInput,TOutput>(innerIterable: Iterable<TInput>, mapping: (value: TInput) => JavascriptIterable<TOutput>): FlatMapIterable<TInput,TOutput>
    {
        return new FlatMapIterable(innerIterable, mapping);
    }

    public iterate(): Iterator<TOutput>
    {
        return this.innerIterable.iterate().flatMap(this.mapping);
    }

    public toArray(): SyncResult<TOutput[]>
    {
        return Iterable.toArray<TOutput>(this);
    }

    public any(): SyncResult<boolean>
    {
        return Iterable.any(this);
    }

    public getCount(): SyncResult<number>
    {
        return Iterable.getCount(this);
    }

    public equals(right: JavascriptIterable<TOutput>, equalFunctions?: EqualFunctions): SyncResult<boolean>
    {
        return Iterable.equals(this, right, equalFunctions);
    }

    public toString(toStringFunctions?: ToStringFunctions): string
    {
        return Iterable.toString(this, toStringFunctions);
    }

    public concatenate(...toConcatenate: JavascriptIterable<TOutput>[]): Iterable<TOutput>
    {
        return Iterable.concatenate<TOutput>(this, ...toConcatenate);
    }

    public map<TOutput2>(mapping: (value: TOutput) => TOutput2 | SyncResult<TOutput2>): Iterable<TOutput2>
    {
        return Iterable.map(this, mapping);
    }

    public flatMap<TOutput2>(mapping: (value: TOutput) => JavascriptIterable<TOutput2>): Iterable<TOutput2>
    {
        return Iterable.flatMap(this, mapping);
    }

    public where(condition: (value: TOutput) => (boolean | SyncResult<boolean>)): Iterable<TOutput>
    {
        return Iterable.where(this, condition);
    }

    public instanceOf<TOutput2 extends TOutput>(typeOrTypeCheck: Type<TOutput2> | ((value: TOutput2) => value is TOutput2)): Iterable<TOutput2>
    {
        return Iterable.instanceOf<TOutput,TOutput2>(this, typeOrTypeCheck);
    }

    public first(condition?: ((value: TOutput) => (boolean | SyncResult<boolean>)) | undefined): SyncResult<TOutput>
    {
        return Iterable.first(this, condition);
    }

    public last(condition?: ((value: TOutput) => (boolean | SyncResult<boolean>)) | undefined): SyncResult<TOutput>
    {
        return Iterable.last(this, condition);
    }

    public contains(value: TOutput, equalFunctions?: EqualFunctions): SyncResult<boolean>
    {
        return Iterable.contains(this, value, equalFunctions);
    }

    public [Symbol.iterator](): JavascriptIterator<TOutput>
    {
        return Iterable[Symbol.iterator](this);
    }
}