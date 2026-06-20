import { EqualFunctions } from "./equalFunctions";
import { Indexable } from "./Indexable";
import { Iterable } from "./iterable";
import { Iterator } from "./iterator";
import { JavascriptIterable, JavascriptIterator } from "./javascript";
import { List } from "./list";
import { SyncResult } from "./syncResult";
import { ToStringFunctions } from "./toStringFunctions";
import { Type } from "./types";

/**
 * An {@link Indexable} that can change it's values.
 */
export abstract class MutableIndexable<T> implements Indexable<T>
{
    public static create<T>(values?: JavascriptIterable<T>): MutableIndexable<T>
    {
        return List.create(values);
    }

    public abstract get(index: number): SyncResult<T>;

    /**
     * Set the value at the provided index to the be the provided value.
     * @param index The index of the value to set.
     * @param value The value to set.
     */
    public abstract set(index: number, value: T): this;

    public abstract iterate(): Iterator<T>;

    public toArray(): SyncResult<T[]>
    {
        return MutableIndexable.toArray(this);
    }

    public static toArray<T>(indexable: Indexable<T>): SyncResult<T[]>
    {
        return Indexable.toArray(indexable);
    }

    public any(): SyncResult<boolean>
    {
        return MutableIndexable.any(this);
    }

    public static any<T>(indexable: Indexable<T>): SyncResult<boolean>
    {
        return Indexable.any(indexable);
    }

    public getCount(): SyncResult<number>
    {
        return MutableIndexable.getCount(this);
    }

    public static getCount<T>(indexable: Indexable<T>): SyncResult<number>
    {
        return Indexable.getCount(indexable);
    }

    public equals(right: JavascriptIterable<T>, equalFunctions?: EqualFunctions): SyncResult<boolean>
    {
        return MutableIndexable.equals(this, right, equalFunctions);
    }

    public static equals<T>(left: Indexable<T>, right: JavascriptIterable<T>, equalFunctions?: EqualFunctions): SyncResult<boolean>
    {
        return Indexable.equals(left, right, equalFunctions);
    }

    public toString(toStringFunctions?: ToStringFunctions): string
    {
        return MutableIndexable.toString(this, toStringFunctions);
    }

    public static toString<T>(indexable: Indexable<T>, toStringFunctions?: ToStringFunctions): string
    {
        return Indexable.toString(indexable, toStringFunctions);
    }

    public concatenate(...toConcatenate: JavascriptIterable<T>[]): Iterable<T>
    {
        return MutableIndexable.concatenate(this, ...toConcatenate);
    }

    public static concatenate<T>(indexable: Indexable<T>, ...toConcatenate: JavascriptIterable<T>[]): Iterable<T>
    {
        return Indexable.concatenate(indexable, ...toConcatenate);
    }

    public map<TOutput>(mapping: (value: T) => (TOutput | SyncResult<TOutput>)): Iterable<TOutput>
    {
        return MutableIndexable.map<T, TOutput>(this, mapping);
    }

    public static map<TInput, TOutput>(indexable: Indexable<TInput>, mapping: (value: TInput) => (TOutput | SyncResult<TOutput>)): Iterable<TOutput>
    {
        return Indexable.map<TInput, TOutput>(indexable, mapping);
    }

    public flatMap<TOutput>(mapping: (value: T) => JavascriptIterable<TOutput>): Iterable<TOutput>
    {
        return MutableIndexable.flatMap(this, mapping);
    }

    public static flatMap<TInput, TOutput>(indexable: Indexable<TInput>, mapping: (value: TInput) => JavascriptIterable<TOutput>): Iterable<TOutput>
    {
        return Indexable.flatMap<TInput, TOutput>(indexable, mapping);
    }

    public where(condition: (value: T) => (boolean | SyncResult<boolean>)): Iterable<T>
    {
        return MutableIndexable.where(this, condition);
    }

    public static where<T>(indexable: Indexable<T>, condition: (value: T) => (boolean | SyncResult<boolean>)): Iterable<T>
    {
        return Indexable.where(indexable, condition);
    }

    public instanceOf<TOutput extends T>(typeOrTypeCheck: Type<TOutput> | ((value: T) => value is TOutput)): Iterable<TOutput>
    {
        return MutableIndexable.instanceOf(this, typeOrTypeCheck);
    }

    public static instanceOf<TInput, TOutput extends TInput>(indexable: Indexable<TInput>, typeOrTypeCheck: Type<TOutput> | ((value: TInput) => value is TOutput)): Iterable<TOutput>
    {
        return Indexable.instanceOf(indexable, typeOrTypeCheck);
    }

    public first(condition?: ((value: T) => (boolean | SyncResult<boolean>)) | undefined): SyncResult<T>
    {
        return MutableIndexable.first(this, condition);
    }

    public static first<T>(indexable: Indexable<T>, condition?: (value: T) => (boolean | SyncResult<boolean>)): SyncResult<T>
    {
        return Indexable.first(indexable, condition);
    }

    public last(condition?: ((value: T) => (boolean | SyncResult<boolean>)) | undefined): SyncResult<T>
    {
        return MutableIndexable.last(this, condition);
    }

    public static last<T>(indexable: Indexable<T>, condition?: (value: T) => (boolean | SyncResult<boolean>)): SyncResult<T>
    {
        return Indexable.last(indexable, condition);
    }

    public [Symbol.iterator](): JavascriptIterator<T>
    {
        return Indexable[Symbol.iterator](this);
    }

    public static [Symbol.iterator]<T>(indexable: Indexable<T>): JavascriptIterator<T>
    {
        return Iterable[Symbol.iterator](indexable);
    }

    public contains(value: T, equalFunctions?: EqualFunctions): SyncResult<boolean>
    {
        return MutableIndexable.contains(this, value, equalFunctions);
    }

    public static contains<T>(indexable: Indexable<T>, value: T, equalFunctions?: EqualFunctions): SyncResult<boolean>
    {
        return Indexable.contains(indexable, value, equalFunctions);
    }
}