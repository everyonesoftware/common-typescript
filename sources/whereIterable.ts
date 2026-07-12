import { EqualFunctions } from "./equalFunctions.js";
import { Iterable } from "./iterable.js";
import { Iterator } from "./iterator.js";
import { JavascriptIterable, JavascriptIterator } from "./javascript.js";
import { PreCondition } from "./preCondition.js";
import { SyncResult } from "./syncResult.js";
import { ToStringFunctions } from "./toStringFunctions.js";
import { Type } from "./types.js";

/**
 * An {@link Iterable} that only returns values that match a condition.
 */
export class WhereIterable<T> implements Iterable<T>
{
    // WhereIterable cannot extend Iterable because their create() functions are different.

    private readonly innerIterable: Iterable<T>;
    private readonly condition: (value: T) => (boolean | SyncResult<boolean>);

    private constructor(innerIterable: Iterable<T>, condition: (value: T) => (boolean | SyncResult<boolean>))
    {
        PreCondition.assertNotUndefinedAndNotNull(innerIterable, "innerIterable");
        PreCondition.assertNotUndefinedAndNotNull(condition, "condition");

        this.innerIterable = innerIterable;
        this.condition = condition;
    }

    public static create<T>(innerIterable: Iterable<T>, condition: (value: T) => (boolean | SyncResult<boolean>)): WhereIterable<T>
    {
        return new WhereIterable(innerIterable, condition);
    }

    public iterate(): Iterator<T>
    {
        return this.innerIterable.iterate().where(this.condition);
    }

    public toArray(): SyncResult<T[]>
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

    public equals(right: JavascriptIterable<T>, equalFunctions?: EqualFunctions): SyncResult<boolean>
    {
        return Iterable.equals(this, right, equalFunctions);
    }

    public toString(toStringFunctions?: ToStringFunctions): string
    {
        return Iterable.toString(this, toStringFunctions);
    }

    public concatenate(...toConcatenate: JavascriptIterable<T>[]): Iterable<T>
    {
        return Iterable.concatenate(this, ...toConcatenate);
    }

    public map<TOutput>(mapping: (value: T) => (TOutput | SyncResult<TOutput>)): Iterable<TOutput>
    {
        return Iterable.map(this, mapping);
    }

    public flatMap<TOutput>(mapping: (value: T) => JavascriptIterable<TOutput>): Iterable<TOutput>
    {
        return Iterable.flatMap(this, mapping);
    }

    public where(condition: (value: T) => (boolean | SyncResult<boolean>)): Iterable<T>
    {
        return Iterable.where(this, condition);
    }

    public instanceOf<TOutput extends T>(typeOrTypeCheck: Type<TOutput> | ((value: T) => value is TOutput)): Iterable<TOutput>
    {
        return Iterable.instanceOf(this, typeOrTypeCheck);
    }

    public first(condition?: ((value: T) => (boolean | SyncResult<boolean>)) | undefined): SyncResult<T>
    {
        return Iterable.first(this, condition);
    }

    public last(condition?: ((value: T) => (boolean | SyncResult<boolean>)) | undefined): SyncResult<T>
    {
        return Iterable.last(this, condition);
    }

    public [Symbol.iterator](): JavascriptIterator<T>
    {
        return Iterable[Symbol.iterator](this);
    }

    public contains(value: T, equalFunctions?: EqualFunctions): SyncResult<boolean>
    {
        return Iterable.contains(this, value, equalFunctions);
    }
}