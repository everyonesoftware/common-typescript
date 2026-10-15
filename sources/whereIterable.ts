import { EqualFunctions } from "./equalFunctions.js";
import { Iterable } from "./iterable.js";
import { Iterator } from "./iterator.js";
import { JavascriptIterable, JavascriptIterator } from "./javascript.js";
import { PreCondition } from "./preCondition.js";
import { SyncResult } from "./syncResult.js";
import { ToStringFunctions } from "./toStringFunctions.js";

/**
 * An {@link Iterable} that only returns values that match a condition.
 */
export class WhereIterable<TInner, TOuter extends TInner = TInner> implements Iterable<TOuter>
{
    // WhereIterable cannot extend Iterable because their create() functions are different.

    private readonly innerIterable: Iterable<TInner>;
    private readonly condition: (value: TInner) => value is TOuter;

    private constructor(innerIterable: Iterable<TInner>, condition: (value: TInner) => value is TOuter)
    {
        PreCondition.assertNotUndefinedAndNotNull(innerIterable, "innerIterable");
        PreCondition.assertNotUndefinedAndNotNull(condition, "condition");

        this.innerIterable = innerIterable;
        this.condition = condition;
    }

    public static create<TInner, TOuter extends TInner>(innerIterable: Iterable<TInner>, condition: (value: TInner) => value is TOuter): WhereIterable<TInner, TOuter>;
    public static create<T>(innerIterable: Iterable<T>, condition: (value: T) => boolean): WhereIterable<T>;
    static create<TInner, TOuter extends TInner>(innerIterable: Iterable<TInner>, condition: (value: TInner) => value is TOuter): WhereIterable<TInner, TOuter>
    {
        return new WhereIterable(innerIterable, condition);
    }

    public iterate(): Iterator<TOuter>
    {
        return this.innerIterable.iterate().where(this.condition);
    }

    public toArray(): SyncResult<TOuter[]>
    {
        return Iterable.toArray(this);
    }

    public any(): SyncResult<boolean>
    {
        return Iterable.any(this);
    }

    public getCount(): SyncResult<number>
    {
        return Iterable.getCount(this);
    }

    public equals(right: JavascriptIterable<TOuter>, equalFunctions?: EqualFunctions): SyncResult<boolean>
    {
        return Iterable.equals(this, right, equalFunctions);
    }

    public toString(toStringFunctions?: ToStringFunctions): string
    {
        return Iterable.toString(this, toStringFunctions);
    }

    public concatenate(...toConcatenate: JavascriptIterable<TOuter>[]): Iterable<TOuter>
    {
        return Iterable.concatenate(this, ...toConcatenate);
    }

    public map<TOutput>(mapping: (value: TOuter) => (TOutput | SyncResult<TOutput>)): Iterable<TOutput>
    {
        return Iterable.map(this, mapping);
    }

    public flatMap<TOutput>(mapping: (value: TOuter) => JavascriptIterable<TOutput>): Iterable<TOutput>
    {
        return Iterable.flatMap(this, mapping);
    }

    public where<TOuter2 extends TOuter>(condition: (value: TOuter) => value is TOuter2): Iterable<TOuter2>
    {
        return Iterable.where(this, condition);
    }

    public first(condition?: ((value: TOuter) => (boolean | SyncResult<boolean>)) | undefined): SyncResult<TOuter>
    {
        return Iterable.first(this, condition);
    }

    public last(condition?: ((value: TOuter) => (boolean | SyncResult<boolean>)) | undefined): SyncResult<TOuter>
    {
        return Iterable.last(this, condition);
    }

    public [Symbol.iterator](): JavascriptIterator<TOuter>
    {
        return Iterable[Symbol.iterator](this);
    }

    public contains(value: TOuter, equalFunctions?: EqualFunctions): SyncResult<boolean>
    {
        return Iterable.contains(this, value, equalFunctions);
    }

    public containsAny(values: JavascriptIterable<TOuter>, equalFunctions?: EqualFunctions): SyncResult<boolean>
    {
        return Iterable.containsAny(this, values, equalFunctions);
    }

    public skip(toSkip: number): Iterable<TOuter>
    {
        return Iterable.skip(this, toSkip);
    }
}