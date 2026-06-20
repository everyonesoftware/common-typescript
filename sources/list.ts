import { EqualFunctions } from "./equalFunctions";
import { Indexable } from "./Indexable";
import { Iterable } from "./iterable";
import { Iterator } from "./iterator";
import { JavascriptIterable, JavascriptIterator } from "./javascript";
import { JavascriptArrayList } from "./javascriptArrayList";
import { MutableIndexable } from "./MutableIndexable";
import { NotFoundError } from "./notFoundError";
import { PreCondition } from "./preCondition";
import { SyncResult } from "./syncResult";
import { ToStringFunctions } from "./toStringFunctions";
import { isUndefinedOrNull, Type } from "./types";

export abstract class List<T> implements MutableIndexable<T>
{
    // List cannot extend Iterable because List is the default implementation of List.

    public static create<T>(values?: JavascriptIterable<T>): List<T>
    {
        return JavascriptArrayList.create(values);
    }

    /**
     * Add the provided value to the end of this {@link List}.
     * @param value The value to add.
     */
    public add(value: T): this
    {
        return List.add(this, value);
    }

    /**
     * Add the provided value to the provided {@link List}.
     * @param list The {@link List} to add the value to.
     * @param value The value to add.
     */
    public static add<T, TList extends List<T>>(list: TList, value: T): TList
    {
        PreCondition.assertNotUndefinedAndNotNull(list, "list");

        return list.insert(list.getCount().await(), value);
    }

    /**
     * Add the provided values to the end of this {@link List}.
     * @param values The values to add.
     */
    public addAll(values: JavascriptIterable<T>): this
    {
        return List.addAll(this, values);
    }

    /**
     * Add the provided values to the end of the provided {@link List}.
     * @param list The {@link List} to add the values to.
     * @param values The values to add.
     */
    public static addAll<T, TList extends List<T>>(list: TList, values: JavascriptIterable<T>): TList
    {
        PreCondition.assertNotUndefinedAndNotNull(list, "list");
        PreCondition.assertNotUndefinedAndNotNull(values, "values");

        return list.insertAll(list.getCount().await(), values);
    }

    /**
     * Insert the value at the index in this {@link List}.
     * @param index The index to insert the value at.
     * @param value The value to insert.
     */
    public abstract insert(index: number, value: T): this;

    /**
     * Insert the values at the index in this {@link List}.
     * @param index The index to insert the values at.
     * @param values The values to insert.
     */
    public insertAll(index: number, values: JavascriptIterable<T>): this
    {
        return List.insertAll(this, index, values);
    }

    /**
     * Insert the values at the index in this {@link List}.
     * @param list The list to insert the values into.
     * @param index The index to insert the values at.
     * @param values The values to insert.
     */
    public static insertAll<T, TList extends List<T>>(list: TList, index: number, values: JavascriptIterable<T>): TList
    {
        PreCondition.assertNotUndefinedAndNotNull(list, "list");
        PreCondition.assertInsertIndex(index, list.getCount().await(), "index");
        PreCondition.assertNotUndefinedAndNotNull(values, "values");

        let insertIndex: number = index;
        for (const value of values)
        {
            list.insert(insertIndex, value);
            insertIndex++;
        }
        return list;
    }

    /**
     * Attempt to remove the first instance of the provided value from this {@link List}. Return
     * whether the removed value.
     * @param value The value to remove.
     */
    public remove(value: T, equalFunctions?: EqualFunctions): SyncResult<T>
    {
        return List.remove(this, value, equalFunctions);
    }

    public static remove<T>(list: List<T>, value: T, equalFunctions?: EqualFunctions): SyncResult<T>
    {
        PreCondition.assertNotUndefinedAndNotNull(list, "list");

        if (isUndefinedOrNull(equalFunctions))
        {
            equalFunctions = EqualFunctions.create();
        }

        return SyncResult.create(() =>
        {
            let foundValue: boolean = false;
            let result: T | undefined;

            const count: number = list.getCount().await();
            for (let i = 0; i < count; i++)
            {
                const currentValue: T = list.get(i).await();
                if (equalFunctions.areEqual(value, currentValue).await())
                {
                    result = currentValue;
                    list.removeAt(i).await();
                    foundValue = true;
                    break;
                }
            }

            if (!foundValue)
            {
                const toStringFunctions: ToStringFunctions = ToStringFunctions.create();
                throw new NotFoundError(`Could not find the value to remove: ${toStringFunctions.toString(value)}`);
            }

            return result!;
        });
    }

    /**
     * Remove and return the value in this {@link List} at the provided index.
     * @param index The index to remove a value from.
     */
    public abstract removeAt(index: number): SyncResult<T>;

    /**
     * Remove the first value in this {@link List}.
     */
    public removeFirst(): SyncResult<T>
    {
        return List.removeFirst(this);
    }

    public static removeFirst<T, TList extends List<T>>(list: TList): SyncResult<T>
    {
        PreCondition.assertNotEmpty(list, "list");

        return list.removeAt(0);
    }

    /**
     * Remove the last value in this {@link List}.
     */
    public removeLast(): SyncResult<T>
    {
        return List.removeLast(this);
    }

    public static removeLast<T, TList extends List<T>>(list: TList): SyncResult<T>
    {
        PreCondition.assertNotEmpty(list, "list");

        return list.removeAt(list.getCount().await() - 1);
    }

    public abstract set(index: number, value: T): this;

    public abstract iterate(): Iterator<T>

    public abstract get(index: number): SyncResult<T>;

    public toArray(): SyncResult<T[]>
    {
        return List.toArray(this);
    }

    public static toArray<T>(list: List<T>): SyncResult<T[]>
    {
        return MutableIndexable.toArray(list);
    }

    public any(): SyncResult<boolean>
    {
        return List.any(this);
    }

    public static any<T>(list: List<T>): SyncResult<boolean>
    {
        return MutableIndexable.any(list);
    }

    public getCount(): SyncResult<number>
    {
        return List.getCount(this);
    }

    public static getCount<T>(list: List<T>): SyncResult<number>
    {
        return MutableIndexable.getCount(list);
    }

    public equals(right: JavascriptIterable<T>, equalFunctions?: EqualFunctions): SyncResult<boolean>
    {
        return List.equals(this, right, equalFunctions);
    }

    public static equals<T>(left: List<T>, right: JavascriptIterable<T>, equalFunctions?: EqualFunctions): SyncResult<boolean>
    {
        return MutableIndexable.equals(left, right, equalFunctions);
    }

    public toString(toStringFunctions?: ToStringFunctions): string
    {
        return List.toString(this, toStringFunctions);
    }

    public static toString<T>(list: List<T>, toStringFunctions?: ToStringFunctions): string
    {
        return MutableIndexable.toString(list, toStringFunctions);
    }

    public concatenate(...toConcatenate: JavascriptIterable<T>[]): Iterable<T>
    {
        return List.concatenate(this, ...toConcatenate);
    }

    public static concatenate<T>(list: List<T>, ...toConcatenate: JavascriptIterable<T>[]): Iterable<T>
    {
        return MutableIndexable.concatenate(list, ...toConcatenate);
    }

    public map<TOutput>(mapping: (value: T) => (TOutput | SyncResult<TOutput>)): Iterable<TOutput>
    {
        return List.map<T, TOutput>(this, mapping);
    }

    public static map<TInput, TOutput>(list: List<TInput>, mapping: (value: TInput) => (TOutput | SyncResult<TOutput>)): Iterable<TOutput>
    {
        return MutableIndexable.map<TInput, TOutput>(list, mapping);
    }

    public flatMap<TOutput>(mapping: (value: T) => JavascriptIterable<TOutput>): Iterable<TOutput>
    {
        return List.flatMap(this, mapping);
    }

    public static flatMap<TInput, TOutput>(list: List<TInput>, mapping: (value: TInput) => JavascriptIterable<TOutput>): Iterable<TOutput>
    {
        return MutableIndexable.flatMap<TInput, TOutput>(list, mapping);
    }

    public where(condition: (value: T) => (boolean | SyncResult<boolean>)): Iterable<T>
    {
        return List.where(this, condition);
    }

    public static where<T>(list: List<T>, condition: (value: T) => (boolean | SyncResult<boolean>)): Iterable<T>
    {
        return MutableIndexable.where(list, condition);
    }

    public instanceOf<TOutput extends T>(typeOrTypeCheck: Type<TOutput> | ((value: T) => value is TOutput)): Iterable<TOutput>
    {
        return List.instanceOf(this, typeOrTypeCheck);
    }

    public static instanceOf<TInput, TOutput extends TInput>(list: List<TInput>, typeOrTypeCheck: Type<TOutput> | ((value: TInput) => value is TOutput)): Iterable<TOutput>
    {
        return MutableIndexable.instanceOf(list, typeOrTypeCheck);
    }

    public first(condition?: ((value: T) => (boolean | SyncResult<boolean>)) | undefined): SyncResult<T>
    {
        return List.first(this, condition);
    }

    public static first<T>(list: List<T>, condition?: (value: T) => (boolean | SyncResult<boolean>)): SyncResult<T>
    {
        return MutableIndexable.first(list, condition);
    }

    public last(condition?: ((value: T) => (boolean | SyncResult<boolean>)) | undefined): SyncResult<T>
    {
        return List.last(this, condition);
    }

    public static last<T>(list: List<T>, condition?: (value: T) => (boolean | SyncResult<boolean>)): SyncResult<T>
    {
        return MutableIndexable.last(list, condition);
    }

    public [Symbol.iterator](): JavascriptIterator<T>
    {
        return List[Symbol.iterator](this);
    }

    public static [Symbol.iterator]<T>(list: List<T>): JavascriptIterator<T>
    {
        return Indexable[Symbol.iterator](list);
    }

    public contains(value: T, equalFunctions?: EqualFunctions): SyncResult<boolean>
    {
        return List.contains(this, value, equalFunctions);
    }

    public static contains<T>(list: List<T>, value: T, equalFunctions?: EqualFunctions): SyncResult<boolean>
    {
        return MutableIndexable.contains(list, value, equalFunctions);
    }
}