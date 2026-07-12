import { Comparable } from "./comparable.js";
import { ConcatenateIterator } from "./concatenateIterator.js";
import { EmptyError } from "./emptyError.js";
import { FlatMapIterator } from "./flatMapIterator.js";
import { IteratorToJavascriptIteratorAdapter } from "./iteratorToJavascriptIteratorAdapter.js";
import { JavascriptIterable, JavascriptIterator } from "./javascript.js";
import { JavascriptIteratorToIteratorAdapter } from "./javascriptIteratorToIteratorAdapter.js";
import { MapIterator } from "./mapIterator.js";
import { NotFoundError } from "./notFoundError.js";
import { PreCondition } from "./preCondition.js";
import { SkipIterator } from "./skipIterator.js";
import { SyncResult } from "./syncResult.js";
import { TakeIterator } from "./takeIterator.js";
import { instanceOfType, isJavascriptIterator, isUndefinedOrNull, Type } from "./types.js";
import { WhereIterator } from "./whereIterator.js";

/**
 * A type that can be used to iterate over a collection.
 */
export abstract class Iterator<T> implements JavascriptIterable<T>
{
    /**
     * Create a new {@link Iterator} that contains the provided values.
     * @param values The values that the new {@link Iterator} will iterate over.
     */
    public static create<T>(values: JavascriptIterator<T> | JavascriptIterable<T>): Iterator<T>
    {
        PreCondition.assertNotUndefinedAndNotNull(values, "values");

        return JavascriptIteratorToIteratorAdapter.create(values);
    }

    /**
     * Move to the next value in the collection. Return whether this {@link Iterator} points to a
     * value after the move.
     */
    public abstract next(): SyncResult<boolean>;

    /**
     * Get whether this {@link Iterator} has started iterating over the values in the collection.
     */
    public abstract hasStarted(): boolean;

    /**
     * Get whether this {@link Iterator} currently points at a value in the collection.
     */
    public abstract hasCurrent(): boolean;

    /**
     * Get the value that this {@link Iterator} points to.
     */
    public abstract getCurrent(): T;

    /**
     * Move to the first value if this {@link Iterator} hasn't started yet.
     * @returns This object for method chaining.
     */
    public start(): SyncResult<this>
    {
        return Iterator.start(this);
    }

    /**
     * Move the provided {@link Iterator} to its first value if it hasn't started yet.
     */
    public static start<T, TIterator extends Iterator<T>>(iterator: TIterator): SyncResult<TIterator>
    {
        PreCondition.assertNotUndefinedAndNotNull(iterator, "iterator");

        return SyncResult.create(() =>
        {
            if (!iterator.hasStarted())
            {
                iterator.next().await();
            }
            return iterator;
        });
    }

    /**
     * Get the current value from this {@link Iterator} and advance this {@link Iterator} to the
     * next value.
     */
    public takeCurrent(): SyncResult<T>
    {
        return Iterator.takeCurrent(this);
    }

    public static takeCurrent<T>(iterator: Iterator<T>): SyncResult<T>
    {
        PreCondition.assertNotUndefinedAndNotNull(iterator, "iterator");
        PreCondition.assertTrue(iterator.hasCurrent(), "iterator.hasCurrent()");

        return SyncResult.create(() =>
        {
            const result: T = iterator.getCurrent();
            iterator.next().await();
            return result;
        });
    }

    public [Symbol.iterator](): JavascriptIterator<T>
    {
        return Iterator[Symbol.iterator](this);
    }

    /**
     * Convert the provided {@link Iterator} to a {@link IteratorToJavascriptIteratorAdapter}.
     * @param iterator The {@link Iterator} to convert.
     */
    public static [Symbol.iterator]<T>(iterator: Iterator<T>): JavascriptIterator<T>
    {
        PreCondition.assertNotUndefinedAndNotNull(iterator, "iterator");

        return IteratorToJavascriptIteratorAdapter.create(iterator);
    }

    /**
     * Get whether this {@link Iterator} contains any values.
     * Note: This may advance the {@link Iterator} to the first value if it hasn't been
     * started yet.
     */
    public any(): SyncResult<boolean>
    {
        return Iterator.any(this);
    }

    /**
     * Get whether this {@link Iterator} contains any values.
     * Note: This may advance the {@link Iterator} to the first value if it hasn't been
     * started yet.
     */
    public static any<T>(iterator: Iterator<T>): SyncResult<boolean>
    {
        PreCondition.assertNotUndefinedAndNotNull(iterator, "iterator");

        return SyncResult.create(() =>
        {
            iterator.start().await();
            return iterator.hasCurrent();
        });

    }

    /**
     * Get the number of values in this {@link Iterator}.
     * Note: This will consume all of the values in this {@link Iterator}.
     */
    public getCount(): SyncResult<number>
    {
        return Iterator.getCount(this);
    }

    /**
     * Get the number of values in the provided {@link Iterator}.
     * Note: This will consume all of the values in the provided {@link Iterator}.
     */
    public static getCount<T>(iterator: Iterator<T>): SyncResult<number>
    {
        PreCondition.assertNotUndefinedAndNotNull(iterator, "iterator");

        return SyncResult.create(() =>
        {
            let result: number = 0;
            if (iterator.hasCurrent())
            {
                result++;
            }
            while (iterator.next().await())
            {
                result++;
            }
            return result;
        });
    }

    /**
     * Get all of the remaining values in this {@link Iterator} in a {@link T} {@link Array}.
     */
    public toArray(): SyncResult<T[]>
    {
        return Iterator.toArray(this);
    }

    /**
     * Get all of the remaining values in the provided {@link Iterator} in a {@link T}
     * {@link Array}.
     */
    public static toArray<T>(iterator: Iterator<T>): SyncResult<T[]>
    {
        PreCondition.assertNotUndefinedAndNotNull(iterator, "iterator");

        return SyncResult.create(() =>
        {
            const result: T[] = [];

            iterator.start().await();
            while (iterator.hasCurrent())
            {
                result.push(iterator.takeCurrent().await())
            }

            return result;
        });
    }

    public concatenate(...toConcatenate: JavascriptIterable<T>[]): Iterator<T>
    {
        return Iterator.concatenate(this, ...toConcatenate);
    }

    public static concatenate<T>(iterator: Iterator<T>, ...toConcatenate: JavascriptIterable<T>[]): Iterator<T>
    {
        PreCondition.assertNotUndefinedAndNotNull(iterator, "iterator");
        PreCondition.assertNotUndefinedAndNotNull(toConcatenate, "toConcatenate");

        return ConcatenateIterator.create(iterator, ...toConcatenate);
    }

    /**
     * Get an {@link Iterator} that will only return values that match the provided condition.
     * @param condition The condition to run against each of the values in this {@link Iterator}.
     */
    public where(condition: (value: T) => (boolean | SyncResult<boolean>)): Iterator<T>
    {
        return Iterator.where(this, condition);
    }

    public static where<T>(iterator: Iterator<T>, condition: (value: T) => (boolean | SyncResult<boolean>)): Iterator<T>
    {
        PreCondition.assertNotUndefinedAndNotNull(iterator, "iterator");
        PreCondition.assertNotUndefinedAndNotNull(condition, "condition");

        return WhereIterator.create(iterator, condition);
    }

    /**
     * Get a {@link MapIterator} that will map all {@link T} values from this {@link Iterator} to
     * {@link TOutput} values.
     * @param mapping The mapping that maps {@link T} values to {@link TOutput} values.
     */
    public map<TOutput>(mapping: (value: T) => (TOutput | SyncResult<TOutput>)): Iterator<TOutput>
    {
        return Iterator.map(this, mapping);
    }

    public static map<T, TOutput>(iterator: Iterator<T>, mapping: (value: T) => (TOutput | SyncResult<TOutput>)): Iterator<TOutput>
    {
        PreCondition.assertNotUndefinedAndNotNull(iterator, "iterator");
        PreCondition.assertNotUndefinedAndNotNull(mapping, "mapping");

        return MapIterator.create(iterator, mapping);
    }

    public flatMap<TOutput>(mapping: (value: T) => JavascriptIterable<TOutput>): Iterator<TOutput>
    {
        return Iterator.flatMap(this, mapping);
    }

    public static flatMap<T, TOutput>(iterator: Iterator<T>, mapping: (value: T) => JavascriptIterable<TOutput>): Iterator<TOutput>
    {
        PreCondition.assertNotUndefinedAndNotNull(iterator, "iterator");
        PreCondition.assertNotUndefinedAndNotNull(mapping, "mapping");

        return FlatMapIterator.create(iterator, mapping);
    }

    /**
     * Get an {@link Iterator} that will filter this {@link Iterator} to only the values that are
     * instances of {@link U} based on the provided type check {@link Function}.
     * @param typeCheck The {@link Function} that will be used to determine if values are of type
     * {@link U}.
     */
    public whereInstanceOf<U extends T>(typeCheck: (value: T) => value is U): Iterator<U>
    {
        return Iterator.whereInstanceOf(this, typeCheck);
    }

    public static whereInstanceOf<T, U extends T>(iterator: Iterator<T>, typeCheck: (value: T) => value is U): Iterator<U>
    {
        PreCondition.assertNotUndefinedAndNotNull(typeCheck, "typeCheck");

        return iterator.where(typeCheck)
            .map((value: T) => value as U);
    }

    /**
     * Get an {@link Iterator} that will filter this {@link Iterator} to only the values that are
     * instances of the provided {@link Type}.
     * @param type The type of values to return from the new {@link Iterator}.
     */
    public whereInstanceOfType<U extends T>(type: Type<U>): Iterator<U>
    {
        return Iterator.whereInstanceOfType(this, type);
    }

    public static whereInstanceOfType<T, U extends T>(iterator: Iterator<T>, type: Type<U>): Iterator<U>
    {
        PreCondition.assertNotUndefinedAndNotNull(type, "type");

        return iterator.whereInstanceOf((value: T) => instanceOfType(value, type));
    }

    /**
     * If the condition function is undefined, then this function will return the first value in
     * this {@link Iterator}. If this condition function is provided, then this function will return
     * the first value that matches the provided condition.
     * @param condition The condition that the returned value must satisfy.
     */
    public first(condition?: (value: T) => (boolean | SyncResult<boolean>)): SyncResult<T>
    {
        return Iterator.first(this, condition);
    }

    /**
     * If the condition function is undefined, then this function will return the first value in
     * the {@link Iterator}. If this condition function is provided, then this function will return
     * the first value that matches the provided condition.
     * @param iterator The {@link Iterator} to get the first value from.
     */
    public static first<T>(iterator: Iterator<T>, condition?: (value: T) => (boolean | SyncResult<boolean>)): SyncResult<T>
    {
        PreCondition.assertNotUndefinedAndNotNull(iterator, "iterator");

        return SyncResult.create(() =>
        {
            iterator.start().await();
            if (isUndefinedOrNull(condition))
            {
                if (!iterator.hasCurrent())
                {
                    throw new EmptyError();
                }
            }
            else
            {
                while (iterator.hasCurrent() && !condition(iterator.getCurrent()))
                {
                    const conditionResult: boolean | SyncResult<boolean> = condition(iterator.getCurrent());
                    const conditionBoolean: boolean = conditionResult instanceof SyncResult ? conditionResult.await() : conditionResult;
                    if (conditionBoolean)
                    {
                        break;
                    }
                    else
                    {
                        iterator.next().await();
                    }
                }

                if (!iterator.hasCurrent())
                {
                    throw new NotFoundError("No value was found in the Iterator that matched the provided condition.");
                }
            }
            return iterator.getCurrent();
        });
    }

    /**
     * If the condition function is undefined, then this function will return the last value in this
     * {@link Iterator}. If this condition function is provided, then this function will return the
     * last value that matches the provided condition.
     * @param condition The condition that the returned value must satisfy.
     */
    public last(condition?: (value: T) => (boolean | SyncResult<boolean>)): SyncResult<T>
    {
        return Iterator.last(this, condition);
    }

    /**
     * If the condition function is undefined, then this function will return the last value in the
     * {@link Iterator}. If this condition function is provided, then this function will return the
     * last value that matches the provided condition.
     * @param iterator The {@link Iterator} to get the last value from.
     */
    public static last<T>(iterator: Iterator<T>, condition?: (value: T) => (boolean | SyncResult<boolean>)): SyncResult<T>
    {
        PreCondition.assertNotUndefinedAndNotNull(iterator, "iterator");

        return SyncResult.create(() =>
        {
            iterator.start().await();

            if (!iterator.hasCurrent())
            {
                throw new EmptyError();
            }

            let result: T;
            let found: boolean = false;
            do
            {
                if (!condition || condition(iterator.getCurrent()))
                {
                    result = iterator.getCurrent();
                    found = true;
                }
            }
            while (iterator.next().await());

            if (!found)
            {
                if (!condition)
                {
                    throw new EmptyError();
                }
                else
                {
                    throw new NotFoundError("No value was found in the Iterator that matched the provided condition.");
                }
            }

            return result!;
        });
    }

    /**
     * Find the maximum value in the provided {@link Iterator}.
     * @param iterator The values to find the maximum of.
     */
    public static findMaximum<T extends Comparable<T>>(iterator: JavascriptIterator<T> | Iterator<T>): SyncResult<T>
    {
        PreCondition.assertNotUndefinedAndNotNull(iterator, "iterable");

        return SyncResult.create(() =>
        {
            if (isJavascriptIterator(iterator))
            {
                iterator = Iterator.create(iterator);
            }

            let result: T = iterator.first()
                .convertError(EmptyError, () => new EmptyError("Can't find the maximum of an empty Iterator."))
                .await();
            while (iterator.next().await())
            {
                const currentValue: T = iterator.getCurrent();
                if (result.lessThan(currentValue))
                {
                    result = currentValue;
                }
            }

            return result;
        });
    }

    /**
     * Get a new {@link Iterator} that wraps around this {@link Iterator} and only
     * returns a maximum number of values from this {@link Iterator}.
     * @param maximumToTake The maximum number of values to take from this {@link Iterator}.
     */
    public take(maximumToTake: number): Iterator<T>
    {
        return Iterator.take(this, maximumToTake);
    }

    public static take<T>(iterator: Iterator<T>, maximumToTake: number): Iterator<T>
    {
        return TakeIterator.create(iterator, maximumToTake);
    }

    /**
     * Get a new {@link Iterator} that wraps around this {@link Iterator} and will skip the initial
     * provided number of values before beginning to return values.
     * @param maximumToSkip The maximum number of values to skip from this {@link Iterator}.
     */
    public skip(maximumToSkip: number): Iterator<T>
    {
        return Iterator.skip(this, maximumToSkip);
    }

    public static skip<T>(iterator: Iterator<T>, maximumToSkip: number): Iterator<T>
    {
        return SkipIterator.create(iterator, maximumToSkip);
    }
}