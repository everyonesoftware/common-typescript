import { Comparable } from "./comparable";
import { Comparer } from "./comparer";
import { ConcatenateIterable } from "./concatenateIterable";
import { EqualFunctions } from "./equalFunctions";
import { FlatMapIterable } from "./flatMapIterable";
import { Indexable } from "./Indexable";
import { Iterator } from "./iterator";
import { JavascriptIterable, JavascriptIterator } from "./javascript";
import { MapIterable } from "./mapIterable";
import { PreCondition } from "./preCondition";
import { SyncResult } from "./syncResult";
import { ToStringFunctions } from "./toStringFunctions";
import { instanceOf, isIterable, isUndefinedOrNull, Type } from "./types";
import { WhereIterable } from "./whereIterable";

/**
 * An object that can be iterated over.
 */
export abstract class Iterable<T> implements JavascriptIterable<T>
{
    public static create<T>(values?: JavascriptIterable<T>): Iterable<T>
    {
        return Indexable.create(values);
    }

    /**
     * Iterate over the values in this {@link Iterable}.
     */
    public abstract iterate(): Iterator<T>;

    public [Symbol.iterator](): JavascriptIterator<T>
    {
        return Iterable[Symbol.iterator](this);
    }

    public static [Symbol.iterator]<T>(iterable: Iterable<T>): JavascriptIterator<T>
    {
        PreCondition.assertNotUndefinedAndNotNull(iterable, "iterable");

        return iterable.iterate()[Symbol.iterator]();
    }

    /**
     * Get all of the values in this {@link Iterable} in an {@link Array}.
     */
    public toArray(): SyncResult<T[]>
    {
        return Iterable.toArray(this);
    }

    /**
     * Get all of the values in the provided {@link Iterable} in an {@link Array}.
     */
    public static toArray<T>(iterable: Iterable<T>): SyncResult<T[]>
    {
        PreCondition.assertNotUndefinedAndNotNull(iterable, "iterable");

        return iterable.iterate().toArray();
    }

    /**
     * Get whether this {@link Iterable} contains any values.
     */
    public any(): SyncResult<boolean>
    {
        return Iterable.any(this);
    }

    /**
     * Get whether the provided {@link JavascriptIterable} contains any values.
     */
    public static any<T>(iterable: JavascriptIterable<T>): SyncResult<boolean>
    {
        PreCondition.assertNotUndefinedAndNotNull(iterable, "iterable");

        return Iterator.create(iterable).any();
    }

    /**
     * Get the number of values in this {@link Iterable}.
     */
    public getCount(): SyncResult<number>
    {
        return Iterable.getCount(this);
    }

    /**
     * Get the number of values in the provided {@link Iterable}.
     */
    public static getCount<T>(iterable: Iterable<T>): SyncResult<number>
    {
        return iterable.iterate().getCount();
    }

    /**
     * Get whether this {@link Iterable} is equal to the provided {@link Iterable}.
     * @param right The {@link Iterable} to compare against this {@link Iterable}.
     * @param equalFunctions The optional {@link EqualFunctions} to use to determine if the two
     * {@link Iterable}s are equal.
     */
    public equals(right: JavascriptIterable<T>, equalFunctions?: EqualFunctions): SyncResult<boolean>
    {
        return Iterable.equals(this, right, equalFunctions);
    }

    public static equals<T>(left: JavascriptIterable<T>, right: JavascriptIterable<T>, equalFunctions?: EqualFunctions): SyncResult<boolean>
    {
        return SyncResult.create(() =>
        {
            if (isUndefinedOrNull(equalFunctions))
            {
                equalFunctions = EqualFunctions.create();
            }

            let result: boolean | undefined = Comparer.equalSameUndefinedNull(left, right);
            if (result === undefined)
            {
                result = true;

                const leftIterator: Iterator<T> = Iterator.create(left).start().await();
                const rightIterator: Iterator<T> = Iterator.create(right).start().await();
                while (leftIterator.hasCurrent() && rightIterator.hasCurrent())
                {
                    result = equalFunctions.areEqual(leftIterator.getCurrent(), rightIterator.getCurrent()).await();
                    if (result === false)
                    {
                        break;
                    }
                    else
                    {
                        leftIterator.next().await();
                        rightIterator.next().await();
                    }
                }
                if (result)
                {
                    result = (leftIterator.hasCurrent() === rightIterator.hasCurrent());
                }
            }
            return result;
        });
    }

    /**
     * Get the {@link String} representation of this {@link Iterable}.
     */
    public toString(toStringFunctions?: ToStringFunctions): string
    {
        return Iterable.toString(this, toStringFunctions);
    }

    /**
     * Get the {@link String} representation of the provided {@link Iterable}.
     */
    public static toString<T>(iterable: Iterable<T>, toStringFunctions?: ToStringFunctions): string
    {
        PreCondition.assertNotUndefinedAndNotNull(iterable, "iterable");

        if (isUndefinedOrNull(toStringFunctions))
        {
            toStringFunctions = ToStringFunctions.create();
        }
        return toStringFunctions.toString(iterable);
    }

    public concatenate(...toConcatenate: JavascriptIterable<T>[]): Iterable<T>
    {
        return Iterable.concatenate(this, ...toConcatenate);
    }

    public static concatenate<T>(iterable: Iterable<T>, ...toConcatenate: JavascriptIterable<T>[]): Iterable<T>
    {
        PreCondition.assertNotUndefinedAndNotNull(iterable, "iterator");
        PreCondition.assertNotUndefinedAndNotNull(toConcatenate, "toConcatenate");

        return ConcatenateIterable.create(iterable, ...toConcatenate);
    }

    /**
     * Get a {@link MapIterable} that maps all of the {@link T} values in this {@link Iterable} to
     * {@link TOutput} values.
     * @param mapping The mapping function to use to convert values of type {@link T} to
     * {@link TOutput}.
     */
    public map<TOutput>(mapping: (value: T) => (TOutput | SyncResult<TOutput>)): Iterable<TOutput>
    {
        return Iterable.map(this, mapping);
    }

    /**
     * Get a {@link MapIterable} that maps all of the {@link T} values in the provided
     * {@link Iterable} to {@link TOutput} values.
     * @param mapping The mapping function to use to convert values of type {@link T} to
     * {@link TOutput}.
     */
    public static map<TInput, TOutput>(iterable: Iterable<TInput>, mapping: (value: TInput) => (TOutput | SyncResult<TOutput>)): Iterable<TOutput>
    {
        PreCondition.assertNotUndefinedAndNotNull(iterable, "iterable");
        PreCondition.assertNotUndefinedAndNotNull(mapping, "mapping");

        return MapIterable.create(iterable, mapping);
    }

    public flatMap<TOutput>(mapping: (value: T) => JavascriptIterable<TOutput>): Iterable<TOutput>
    {
        return Iterable.flatMap(this, mapping);
    }

    public static flatMap<T,TOutput>(iterable: Iterable<T>, mapping: (value: T) => JavascriptIterable<TOutput>): Iterable<TOutput>
    {
        return FlatMapIterable.create(iterable, mapping);
    }

    /**
     * Get an {@link Iterable} that contains values from this {@link Iterable} that match the
     * provided condition.
     * @param condition The condition to run against each of the values in this {@link Iterable}.
     */
    public where(condition: (value: T) => (boolean | SyncResult<boolean>)): Iterable<T>
    {
        return Iterable.where(this, condition);
    }

    /**
     * Get an {@link Iterable} that contains values from the provided {@link Iterable} that match
     * the provided condition.
     * @param iterable The {@link Iterable} to get values from.
     * @param condition The condition that the values must match to be contained in the new
     * {@link Iterable}.
     */
    public static where<T>(iterable: JavascriptIterable<T>, condition: (value: T) => (boolean | SyncResult<boolean>)): Iterable<T>
    {
        PreCondition.assertNotUndefinedAndNotNull(iterable, "iterable");
        PreCondition.assertNotUndefinedAndNotNull(condition, "condition");

        if (!isIterable(iterable))
        {
            iterable = Iterable.create(iterable);
        }
        return WhereIterable.create(iterable as Iterable<T>, condition);
    }

    /**
     * Get an {@link Iterable} that contains values from this {@link Iterable} that match the
     * provided {@link Type} or type check function.
     * @param typeOrTypeCheck The {@link Type} or type check function that returned values must
     * match.
     */
    public instanceOf<TOutput extends T>(typeOrTypeCheck: Type<TOutput> | ((value: T) => value is TOutput)): Iterable<TOutput>
    {
        return Iterable.instanceOf(this, typeOrTypeCheck);
    }

    /**
     * Get an {@link Iterable} that contains values from the provided {@link Iterable} that match
     * the provided {@link Type} or type check function.
     * @param iterable The {@link Iterable} to get values from.
     * @param typeOrTypeCheck The {@link Type} or type check function that returned values must
     * match.
     */
    public static instanceOf<TInput, TOutput extends TInput>(iterable: JavascriptIterable<TInput>, typeOrTypeCheck: Type<TOutput> | ((value: TInput) => value is TOutput)): Iterable<TOutput>
    {
        PreCondition.assertNotUndefinedAndNotNull(iterable, "iterable");
        PreCondition.assertNotUndefinedAndNotNull(typeOrTypeCheck, "typeOrTypeCheck");

        return Iterable.where(iterable, (value: TInput) => instanceOf(value, typeOrTypeCheck))
            .map((value: TInput) => (value as unknown) as TOutput);
    }

    /**
     * Get the first value in this {@link Iterable}.
     */
    public first(condition?: (value: T) => (boolean | SyncResult<boolean>)): SyncResult<T>
    {
        return Iterable.first(this, condition);
    }

    /**
     * Get the first value from the provided {@link JavascriptIterable}.
     * @param iterable The {@link JavascriptIterable} to get the first value from.
     */
    public static first<T>(iterable: JavascriptIterable<T>, condition?: (value: T) => (boolean | SyncResult<boolean>)): SyncResult<T>
    {
        PreCondition.assertNotUndefinedAndNotNull(iterable, "iterable");

        return Iterator.create(iterable).first(condition);
    }

    /**
     * Get the last value in this {@link Iterable}.
     */
    public last(condition?: (value: T) => (boolean | SyncResult<boolean>)): SyncResult<T>
    {
        return Iterable.last(this, condition);
    }

    /**
     * Get the last value from the provided {@link JavascriptIterable}.
     * @param iterable The {@link JavascriptIterable} to get the last value from.
     */
    public static last<T>(iterable: JavascriptIterable<T>, condition?: (value: T) => (boolean | SyncResult<boolean>)): SyncResult<T>
    {
        PreCondition.assertNotUndefinedAndNotNull(iterable, "iterable");

        return Iterator.create(iterable).last(condition);
    }

    /**
     * Find the maximum value in the provided {@link Iterable}.
     * @param iterable The values to find the maximum of.
     */
    public static findMaximum<T extends Comparable<T>>(iterable: JavascriptIterable<T> | Iterable<T>): SyncResult<T>
    {
        PreCondition.assertNotUndefinedAndNotNull(iterable, "iterable");

        return Iterator.findMaximum(Iterator.create(iterable));
    }

    public contains(value: T, equalFunctions?: EqualFunctions): SyncResult<boolean>
    {
        return Iterable.contains(this, value, equalFunctions);
    }

    public static contains<T>(iterable: Iterable<T>, value: T, equalFunctions?: EqualFunctions): SyncResult<boolean>
    {
        return SyncResult.create(() =>
        {
            if (!equalFunctions)
            {
                equalFunctions = EqualFunctions.create();
            }

            let result: boolean = false;
            for (const iterableValue of iterable)
            {
                if (equalFunctions.areEqual(value, iterableValue).await())
                {
                    result = true;
                    break;
                }
            }
            return result;
        });
    }
}