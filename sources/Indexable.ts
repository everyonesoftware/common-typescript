import { EmptyError } from "./emptyError.js";
import { EqualFunctions } from "./equalFunctions.js";
import { Iterable } from "./iterable.js";
import { Iterator } from "./iterator.js";
import { JavascriptIterable, JavascriptIterator } from "./javascript.js";
import { List } from "./list.js";
import { SyncResult } from "./syncResult.js";
import { ToStringFunctions } from "./toStringFunctions.js";
import { Type } from "./types.js";

/**
 * A container that can be accessed using indexes.
 */
export abstract class Indexable<T> implements Iterable<T>
{
    public static create<T>(values?: JavascriptIterable<T>): Indexable<T>
    {
        return List.create(values);
    }

    /**
     * Get the value at the provided index.
     * @param index The index of the value to return.
     */
    public abstract get(index: number): SyncResult<T>;

    /**
     * Iterate over the values in this {@link Indexable}.
     */
    public abstract iterate(): Iterator<T>;

    public toArray(): SyncResult<T[]>
    {
        return Indexable.toArray(this);
    }

    public static toArray<T>(indexable: Indexable<T>): SyncResult<T[]>
    {
        return Iterable.toArray(indexable);
    }

    public any(): SyncResult<boolean>
    {
        return Indexable.any(this);
    }

    public static any<T>(indexable: Indexable<T>): SyncResult<boolean>
    {
        return Iterable.any(indexable);
    }

    public getCount(): SyncResult<number>
    {
        return Indexable.getCount(this);
    }

    public static getCount<T>(indexable: Indexable<T>): SyncResult<number>
    {
        return Iterable.getCount(indexable);
    }

    public equals(right: JavascriptIterable<T>, equalFunctions?: EqualFunctions): SyncResult<boolean>
    {
        return Indexable.equals(this, right, equalFunctions);
    }

    public static equals<T>(left: Indexable<T>, right: JavascriptIterable<T>, equalFunctions?: EqualFunctions): SyncResult<boolean>
    {
        return Iterable.equals(left, right, equalFunctions);
    }

    public toString(toStringFunctions?: ToStringFunctions): string
    {
        return Indexable.toString(this, toStringFunctions);
    }

    public static toString<T>(indexable: Indexable<T>, toStringFunctions?: ToStringFunctions): string
    {
        return Iterable.toString(indexable, toStringFunctions);
    }

    public concatenate(...toConcatenate: JavascriptIterable<T>[]): Iterable<T>
    {
        return Indexable.concatenate(this, ...toConcatenate);
    }

    public static concatenate<T>(indexable: Indexable<T>, ...toConcatenate: JavascriptIterable<T>[]): Iterable<T>
    {
        return Iterable.concatenate(indexable, ...toConcatenate);
    }

    public map<TOutput>(mapping: (value: T) => (TOutput | SyncResult<TOutput>)): Iterable<TOutput>
    {
        return Indexable.map<T, TOutput>(this, mapping);
    }

    public static map<TInput, TOutput>(indexable: Indexable<TInput>, mapping: (value: TInput) => (TOutput | SyncResult<TOutput>)): Iterable<TOutput>
    {
        return Iterable.map<TInput, TOutput>(indexable, mapping);
    }

    public flatMap<TOutput>(mapping: (value: T) => JavascriptIterable<TOutput>): Iterable<TOutput>
    {
        return Indexable.flatMap(this, mapping);
    }

    public static flatMap<TInput, TOutput>(indexable: Indexable<TInput>, mapping: (value: TInput) => JavascriptIterable<TOutput>): Iterable<TOutput>
    {
        return Iterable.flatMap<TInput, TOutput>(indexable, mapping);
    }

    public where(condition: (value: T) => (boolean | SyncResult<boolean>)): Iterable<T>
    {
        return Indexable.where(this, condition);
    }

    public static where<T>(indexable: Indexable<T>, condition: (value: T) => (boolean | SyncResult<boolean>)): Iterable<T>
    {
        return Iterable.where(indexable, condition);
    }

    public instanceOf<TOutput extends T>(typeOrTypeCheck: Type<TOutput> | ((value: T) => value is TOutput)): Iterable<TOutput>
    {
        return Indexable.instanceOf(this, typeOrTypeCheck);
    }

    public static instanceOf<TInput, TOutput extends TInput>(indexable: Indexable<TInput>, typeOrTypeCheck: Type<TOutput> | ((value: TInput) => value is TOutput)): Iterable<TOutput>
    {
        return Iterable.instanceOf(indexable, typeOrTypeCheck);
    }

    public first(condition?: ((value: T) => (boolean | SyncResult<boolean>)) | undefined): SyncResult<T>
    {
        return Indexable.first(this, condition);
    }

    public static first<T>(indexable: Indexable<T>, condition?: (value: T) => (boolean | SyncResult<boolean>)): SyncResult<T>
    {
        let result: SyncResult<T>;
        if (condition)
        {
            result = Iterable.first(indexable, condition);
        }
        else
        {
            if (indexable.any().await())
            {
                result = indexable.get(0);
            }
            else
            {
                result = SyncResult.error(new EmptyError());
            }
        }
        return result;
    }

    public last(condition?: ((value: T) => (boolean | SyncResult<boolean>)) | undefined): SyncResult<T>
    {
        return Indexable.last(this, condition);
    }

    public static last<T>(indexable: Indexable<T>, condition?: (value: T) => (boolean | SyncResult<boolean>)): SyncResult<T>
    {
        let result: SyncResult<T>;
        if (condition)
        {
            result = Iterable.last(indexable, condition);
        }
        else
        {
            const count: number = indexable.getCount().await();
            if (count > 0)
            {
                result = indexable.get(count - 1);
            }
            else
            {
                result = SyncResult.error(new EmptyError());
            }
        }
        return result;
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
        return Indexable.contains(this, value, equalFunctions);
    }

    public static contains<T>(indexable: Indexable<T>, value: T, equalFunctions?: EqualFunctions): SyncResult<boolean>
    {
        return Iterable.contains(indexable, value, equalFunctions);
    }
}