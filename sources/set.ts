import { EqualFunctions } from "./equalFunctions.js";
import { Iterable } from "./iterable.js";
import { Iterator } from "./iterator.js";
import { JavascriptIterable, JavascriptIterator } from "./javascript.js";
import { JavascriptSetSet } from "./javascriptSetSet.js";
import { PreCondition } from "./preCondition.js";
import { SyncResult } from "./syncResult.js";
import { ToStringFunctions } from "./toStringFunctions.js";
import { hasFunction, Type } from "./types.js";

/**
 * Get whether the provided value is a {@link Set}.
 * @param value The value to check.
 */
export function isSet(value: unknown): value is Set<unknown>
{
    return value instanceof Set ||
        (
            hasFunction(value, "add", { parameterCount: 1 }) &&
            hasFunction(value, "addAll", { parameterCount: 1 }) &&
            hasFunction(value, "remove", { parameterCount: 1 })
        );
}

export abstract class Set<T> implements Iterable<T>
{
    public static create<T>(initialValues?: JavascriptIterable<T>): Set<T>
    {
        return JavascriptSetSet.create(initialValues);
    }

    /**
     * Add the provided value to this {@link Set}.
     * @param value The value to add to this {@link Set}.
     */
    public abstract add(value: T): this;

    public addAll(values: JavascriptIterable<T>): this
    {
        return Set.addAll(this, values);
    }

    public static addAll<T, TSet extends Set<T>>(set: TSet, values: JavascriptIterable<T>): TSet
    {
        PreCondition.assertNotUndefinedAndNotNull(set, "set");
        PreCondition.assertNotUndefinedAndNotNull(values, "values");

        for (const value of values)
        {
            set.add(value);
        }
        return set;
    }

    /**
     * Remove the provided value from this {@link Set}. Return a {@link NotFoundError} if the value
     * is not found.
     * @param value The value to remove.
     */
    public abstract remove(value: T): SyncResult<void>;

    public abstract iterate(): Iterator<T>;

    public union(values: JavascriptIterable<T>): Set<T>
    {
        return Set.union(this, values);
    }

    public static union<T>(set: Set<T>, values: JavascriptIterable<T>): Set<T>
    {
        PreCondition.assertNotUndefinedAndNotNull(set, "set");
        PreCondition.assertNotUndefinedAndNotNull(values, "values");

        const result: Set<T> = Set.create();
        result.addAll(set);
        result.addAll(values);
        return result;
    }

    public toArray(): SyncResult<T[]>
    {
        return Set.toArray(this);
    }

    public static toArray<T>(set: Set<T>): SyncResult<T[]>
    {
        return Iterable.toArray(set);
    }

    public any(): SyncResult<boolean>
    {
        return Set.any(this);
    }

    public static any<T>(set: Set<T>): SyncResult<boolean>
    {
        return SyncResult.create(() =>
        {
            return set.getCount().await() > 0;
        });
    }

    public getCount(): SyncResult<number>
    {
        return Set.getCount(this);
    }

    public static getCount<T>(set: Set<T>): SyncResult<number>
    {
        return Iterable.getCount(set);
    }

    public equals(right: JavascriptIterable<T>, equalFunctions?: EqualFunctions): SyncResult<boolean>
    {
        return Set.equals(this, right, equalFunctions);
    }

    public static equals<T>(left: Set<T>, right: JavascriptIterable<T>, equalFunctions?: EqualFunctions): SyncResult<boolean>
    {
        return isSet(right)
            ? Set.equalSet(left, right, equalFunctions)
            : Iterable.equals(left, right, equalFunctions);
    }

    public static equalSet<T>(left: Set<T>, right: Set<T>, equalFunctions?: EqualFunctions): SyncResult<boolean>
    {
        return SyncResult.create(() =>
        {
            let result: boolean = left.getCount().await() === right.getCount().await();
            if (result)
            {
                for (const leftValue of left)
                {
                    if (!right.contains(leftValue, equalFunctions).await())
                    {
                        result = false;
                        break;
                    }
                }
            }
            return result;
        });
    }

    public toString(toStringFunctions?: ToStringFunctions): string
    {
        return Set.toString(this, toStringFunctions);
    }

    public static toString<T>(set: Set<T>, toStringFunctions?: ToStringFunctions): string
    {
        return Iterable.toString(set, toStringFunctions);
    }

    public concatenate(...toConcatenate: JavascriptIterable<T>[]): Iterable<T>
    {
        return Set.concatenate(this, ...toConcatenate);
    }

    public static concatenate<T>(set: Set<T>, ...toConcatenate: JavascriptIterable<T>[]): Iterable<T>
    {
        return Iterable.concatenate(set, ...toConcatenate);
    }

    public map<TOutput>(mapping: (value: T) => (TOutput | SyncResult<TOutput>)): Iterable<TOutput>
    {
        return Set.map<T, TOutput>(this, mapping);
    }

    public static map<TInput, TOutput>(set: Set<TInput>, mapping: (value: TInput) => (TOutput | SyncResult<TOutput>)): Iterable<TOutput>
    {
        return Iterable.map<TInput, TOutput>(set, mapping);
    }

    public flatMap<TOutput>(mapping: (value: T) => JavascriptIterable<TOutput>): Iterable<TOutput>
    {
        return Set.flatMap(this, mapping);
    }

    public static flatMap<TInput, TOutput>(set: Set<TInput>, mapping: (value: TInput) => JavascriptIterable<TOutput>): Iterable<TOutput>
    {
        return Iterable.flatMap<TInput, TOutput>(set, mapping);
    }

    public where(condition: (value: T) => (boolean | SyncResult<boolean>)): Iterable<T>
    {
        return Set.where(this, condition);
    }

    public static where<T>(set: Set<T>, condition: (value: T) => (boolean | SyncResult<boolean>)): Iterable<T>
    {
        return Iterable.where(set, condition);
    }

    public instanceOf<TOutput extends T>(typeOrTypeCheck: Type<TOutput> | ((value: T) => value is TOutput)): Iterable<TOutput>
    {
        return Set.instanceOf(this, typeOrTypeCheck);
    }

    public static instanceOf<TInput, TOutput extends TInput>(set: Set<TInput>, typeOrTypeCheck: Type<TOutput> | ((value: TInput) => value is TOutput)): Iterable<TOutput>
    {
        return Iterable.instanceOf(set, typeOrTypeCheck);
    }

    public first(condition?: ((value: T) => (boolean | SyncResult<boolean>)) | undefined): SyncResult<T>
    {
        return Set.first(this, condition);
    }

    public static first<T>(set: Set<T>, condition?: (value: T) => (boolean | SyncResult<boolean>)): SyncResult<T>
    {
        return Iterable.first(set, condition);
    }

    public last(condition?: ((value: T) => (boolean | SyncResult<boolean>)) | undefined): SyncResult<T>
    {
        return Set.last(this, condition);
    }

    public static last<T>(set: Set<T>, condition?: (value: T) => (boolean | SyncResult<boolean>)): SyncResult<T>
    {
        return Iterable.last(set, condition);
    }

    public [Symbol.iterator](): JavascriptIterator<T>
    {
        return Set[Symbol.iterator](this);
    }

    public static [Symbol.iterator]<T>(set: Set<T>): JavascriptIterator<T>
    {
        return Iterable[Symbol.iterator](set);
    }

    public contains(value: T, equalFunctions?: EqualFunctions): SyncResult<boolean>
    {
        return Set.contains(this, value, equalFunctions);
    }

    public static contains<T>(set: Set<T>, value: T, equalFunctions?: EqualFunctions): SyncResult<boolean>
    {
        return Iterable.contains(set, value, equalFunctions);
    }
}