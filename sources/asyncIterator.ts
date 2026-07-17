import { AsyncIteratorToJavascriptAsyncIteratorAdapter } from "./asyncIteratorToJavascriptAsyncIteratorAdapter.js";
import { AsyncResult } from "./asyncResult.js";
import { Comparable } from "./comparable.js";
import { EmptyError } from "./emptyError.js";
import { JavascriptAsyncIterator } from "./javascript.js";
import { JavascriptAsyncIteratorToAsyncIteratorAdapter } from "./javascriptAsyncIteratorToAsyncIteratorAdapter.js";
import { MapAsyncIterator } from "./mapAsyncIterator.js";
import { NotFoundError } from "./notFoundError.js";
import { PreCondition } from "./preCondition.js";
import { SkipAsyncIterator } from "./skipAsyncIterator.js";
import { TakeAsyncIterator } from "./takeAsyncIterator.js";
import { instanceOfType, isJavascriptAsyncIterator, isUndefinedOrNull, Type } from "./types.js";
import { WhereAsyncIterator } from "./whereAsyncIterator.js";

/**
 * A type that can be used to asynchronously iterate over a collection.
 */
export abstract class AsyncIterator<T>
{
    public static create<T>(iterator: JavascriptAsyncIterator<T>): AsyncIterator<T>
    {
        return JavascriptAsyncIteratorToAsyncIteratorAdapter.create(iterator);
    }

    /**
     * Move to the next value in the collection. Return whether this {@link AsyncIterator} points to
     * a value after the move.
     */
    public abstract next(): AsyncResult<boolean>;

    /**
     * Get whether this {@link AsyncIterator} has started iterating over the values in the collection.
     */
    public abstract hasStarted(): boolean;

    /**
     * Get whether this {@link AsyncIterator} currently points at a value in the collection.
     */
    public abstract hasCurrent(): boolean;

    /**
     * Get the value that this {@link AsyncIterator} points to.
     */
    public abstract getCurrent(): T;

    /**
     * Move to the first value if this {@link AsyncIterator} hasn't started yet.
     * @returns This object for method chaining.
     */
    public start(): AsyncResult<this>
    {
        return AsyncIterator.start(this);
    }

    /**
     * Move the provided {@link AsyncIterator} to its first value if it hasn't started yet.
     */
    public static start<T, TIterator extends AsyncIterator<T>>(iterator: TIterator): AsyncResult<TIterator>
    {
        PreCondition.assertNotUndefinedAndNotNull(iterator, "iterator");

        return AsyncResult.create(async () =>
        {
            if (!iterator.hasStarted())
            {
                await iterator.next();
            }
            return iterator;
        });
    }

    /**
     * Get the current value from this {@link AsyncIterator} and advance this {@link AsyncIterator} to the
     * next value.
     */
    public takeCurrent(): AsyncResult<T>
    {
        return AsyncIterator.takeCurrent(this);
    }

    public static takeCurrent<T>(iterator: AsyncIterator<T>): AsyncResult<T>
    {
        PreCondition.assertNotUndefinedAndNotNull(iterator, "iterator");
        PreCondition.assertTrue(iterator.hasCurrent(), "iterator.hasCurrent()");

        return AsyncResult.create(async () =>
        {
            const result: T = iterator.getCurrent();
            await iterator.next();
            return result;
        });
    }

    public [Symbol.asyncIterator](): JavascriptAsyncIterator<T>
    {
        return AsyncIterator[Symbol.asyncIterator](this);
    }

    /**
     * Convert the provided {@link AsyncIterator} to a {@link IteratorToJavascriptIteratorAdapter}.
     * @param iterator The {@link AsyncIterator} to convert.
     */
    public static [Symbol.asyncIterator]<T>(iterator: AsyncIterator<T>): JavascriptAsyncIterator<T>
    {
        PreCondition.assertNotUndefinedAndNotNull(iterator, "iterator");

        return AsyncIteratorToJavascriptAsyncIteratorAdapter.create(iterator);
    }

    /**
     * Get whether this {@link AsyncIterator} contains any values.
     * Note: This may advance the {@link AsyncIterator} to the first value if it hasn't been
     * started yet.
     */
    public any(): AsyncResult<boolean>
    {
        return AsyncIterator.any(this);
    }

    /**
     * Get whether this {@link AsyncIterator} contains any values.
     * Note: This may advance the {@link AsyncIterator} to the first value if it hasn't been
     * started yet.
     */
    public static any<T>(iterator: AsyncIterator<T>): AsyncResult<boolean>
    {
        PreCondition.assertNotUndefinedAndNotNull(iterator, "iterator");

        return AsyncResult.create(async () =>
        {
            await iterator.start();
            return iterator.hasCurrent();
        });

    }

    /**
     * Get the number of values in this {@link AsyncIterator}.
     * Note: This will consume all of the values in this {@link AsyncIterator}.
     */
    public getCount(): AsyncResult<number>
    {
        return AsyncIterator.getCount(this);
    }

    /**
     * Get the number of values in the provided {@link AsyncIterator}.
     * Note: This will consume all of the values in the provided {@link AsyncIterator}.
     */
    public static getCount<T>(iterator: AsyncIterator<T>): AsyncResult<number>
    {
        PreCondition.assertNotUndefinedAndNotNull(iterator, "iterator");

        return AsyncResult.create(async () =>
        {
            let result: number = 0;
            if (iterator.hasCurrent())
            {
                result++;
            }
            while (await iterator.next())
            {
                result++;
            }
            return result;
        });
    }

    /**
     * Get all of the remaining values in this {@link AsyncIterator} in a {@link T} {@link Array}.
     */
    public toArray(): AsyncResult<T[]>
    {
        return AsyncIterator.toArray(this);
    }

    /**
     * Get all of the remaining values in the provided {@link AsyncIterator} in a {@link T}
     * {@link Array}.
     */
    public static toArray<T>(iterator: AsyncIterator<T>): AsyncResult<T[]>
    {
        PreCondition.assertNotUndefinedAndNotNull(iterator, "iterator");

        return AsyncResult.create(async () =>
        {
            const result: T[] = [];

            if (iterator.hasCurrent())
            {
                result.push(iterator.getCurrent());
            }
            while (await iterator.next())
            {
                result.push(iterator.getCurrent());
            }

            return result;
        });
    }

    /**
     * Get an {@link AsyncIterator} that will only return values that match the provided condition.
     * @param condition The condition to run against each of the values in this {@link AsyncIterator}.
     */
    public where(condition: (value: T) => (boolean | PromiseLike<boolean>)): AsyncIterator<T>
    {
        return AsyncIterator.where(this, condition);
    }

    public static where<T>(iterator: AsyncIterator<T>, condition: (value: T) => (boolean | PromiseLike<boolean>)): AsyncIterator<T>
    {
        PreCondition.assertNotUndefinedAndNotNull(iterator, "iterator");
        PreCondition.assertNotUndefinedAndNotNull(condition, "condition");

        return WhereAsyncIterator.create(iterator, condition);
    }

    /**
     * Get a {@link MapIterator} that will map all {@link T} values from this {@link AsyncIterator} to
     * {@link TOutput} values.
     * @param mapping The mapping that maps {@link T} values to {@link TOutput} values.
     */
    public map<TOutput>(mapping: (value: T) => (TOutput | PromiseLike<TOutput>)): AsyncIterator<TOutput>
    {
        return AsyncIterator.map(this, mapping);
    }

    public static map<T, TOutput>(iterator: AsyncIterator<T>, mapping: (value: T) => (TOutput | PromiseLike<TOutput>)): AsyncIterator<TOutput>
    {
        PreCondition.assertNotUndefinedAndNotNull(iterator, "iterator");
        PreCondition.assertNotUndefinedAndNotNull(mapping, "mapping");

        return MapAsyncIterator.create(iterator, mapping);
    }

    /**
     * Get an {@link AsyncIterator} that will filter this {@link AsyncIterator} to only the values that are
     * instances of {@link U} based on the provided type check {@link Function}.
     * @param typeCheck The {@link Function} that will be used to determine if values are of type
     * {@link U}.
     */
    public whereInstanceOf<U extends T>(typeCheck: (value: T) => value is U): AsyncIterator<U>
    {
        return AsyncIterator.whereInstanceOf(this, typeCheck);
    }

    public static whereInstanceOf<T, U extends T>(iterator: AsyncIterator<T>, typeCheck: (value: T) => value is U): AsyncIterator<U>
    {
        PreCondition.assertNotUndefinedAndNotNull(typeCheck, "typeCheck");

        return iterator.where(typeCheck)
            .map((value: T) => value as U);
    }

    /**
     * Get an {@link AsyncIterator} that will filter this {@link AsyncIterator} to only the values that are
     * instances of the provided {@link Type}.
     * @param type The type of values to return from the new {@link AsyncIterator}.
     */
    public whereInstanceOfType<U extends T>(type: Type<U>): AsyncIterator<U>
    {
        return AsyncIterator.whereInstanceOfType(this, type);
    }

    public static whereInstanceOfType<T, U extends T>(iterator: AsyncIterator<T>, type: Type<U>): AsyncIterator<U>
    {
        PreCondition.assertNotUndefinedAndNotNull(type, "type");

        return iterator.whereInstanceOf((value: T) => instanceOfType(value, type));
    }

    /**
     * If the condition function is undefined, then this function will return the first value in
     * this {@link AsyncIterator}. If this condition function is provided, then this function will return
     * the first value that matches the provided condition.
     * @param condition The condition that the returned value must satisfy.
     */
    public first(condition?: (value: T) => boolean): AsyncResult<T>
    {
        return AsyncIterator.first(this, condition);
    }

    /**
     * If the condition function is undefined, then this function will return the first value in
     * the {@link AsyncIterator}. If this condition function is provided, then this function will return
     * the first value that matches the provided condition.
     * @param iterator The {@link AsyncIterator} to get the first value from.
     */
    public static first<T>(iterator: AsyncIterator<T>, condition?: (value: T) => (boolean | PromiseLike<boolean>)): AsyncResult<T>
    {
        PreCondition.assertNotUndefinedAndNotNull(iterator, "iterator");

        return AsyncResult.create(async () =>
        {
            await iterator.start();
            if (isUndefinedOrNull(condition))
            {
                if (!iterator.hasCurrent())
                {
                    throw new EmptyError();
                }
            }
            else
            {
                while (iterator.hasCurrent() && !await condition(iterator.getCurrent()))
                {
                    await iterator.next();
                }

                if (!iterator.hasCurrent())
                {
                    throw new NotFoundError("No value was found in the AsyncIterator that matched the provided condition.");
                }
            }
            return iterator.getCurrent();
        });
    }

    /**
     * If the condition function is undefined, then this function will return the last value in this
     * {@link AsyncIterator}. If this condition function is provided, then this function will return the
     * last value that matches the provided condition.
     * @param condition The condition that the returned value must satisfy.
     */
    public last(condition?: (value: T) => (boolean | PromiseLike<boolean>)): AsyncResult<T>
    {
        return AsyncIterator.last(this, condition);
    }

    /**
     * If the condition function is undefined, then this function will return the last value in the
     * {@link AsyncIterator}. If this condition function is provided, then this function will return the
     * last value that matches the provided condition.
     * @param iterator The {@link AsyncIterator} to get the last value from.
     */
    public static last<T>(iterator: AsyncIterator<T>, condition?: (value: T) => (boolean | PromiseLike<boolean>)): AsyncResult<T>
    {
        PreCondition.assertNotUndefinedAndNotNull(iterator, "iterator");

        return AsyncResult.create(async () =>
        {
            await iterator.start();

            if (!iterator.hasCurrent())
            {
                throw new EmptyError();
            }

            let result: T;
            let found: boolean = false;
            do
            {
                if (!condition || await condition(iterator.getCurrent()))
                {
                    result = iterator.getCurrent();
                    found = true;
                }
            }
            while (await iterator.next());

            if (!found)
            {
                if (!condition)
                {
                    throw new EmptyError();
                }
                else
                {
                    throw new NotFoundError("No value was found in the AsyncIterator that matched the provided condition.");
                }
            }

            return result!;
        });
    }

    /**
     * Find the maximum value in the provided {@link AsyncIterator}.
     * @param iterator The values to find the maximum of.
     */
    public static findMaximum<T extends Comparable<T>>(iterator: JavascriptAsyncIterator<T> | AsyncIterator<T>): AsyncResult<T>
    {
        PreCondition.assertNotUndefinedAndNotNull(iterator, "iterable");

        return AsyncResult.create(async () =>
        {
            if (isJavascriptAsyncIterator(iterator))
            {
                iterator = AsyncIterator.create(iterator as JavascriptAsyncIterator<T>);
            }

            let result: T = await iterator.first()
                .convertError(EmptyError, () => new EmptyError("Can't find the maximum of an empty Iterator."));
            while (await iterator.next())
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
     * Get a new {@link AsyncIterator} that wraps around this {@link AsyncIterator} and only
     * returns a maximum number of values from this {@link AsyncIterator}.
     * @param maximumToTake The maximum number of values to take from this {@link AsyncIterator}.
     */
    public take(maximumToTake: number): AsyncIterator<T>
    {
        return AsyncIterator.take(this, maximumToTake);
    }

    public static take<T>(iterator: AsyncIterator<T>, maximumToTake: number): AsyncIterator<T>
    {
        return TakeAsyncIterator.create(iterator, maximumToTake);
    }

    /**
     * Get a new {@link AsyncIterator} that wraps around this {@link AsyncIterator} and will skip the initial
     * provided number of values before beginning to return values.
     * @param maximumToSkip The maximum number of values to skip from this {@link AsyncIterator}.
     */
    public skip(maximumToSkip: number): AsyncIterator<T>
    {
        return AsyncIterator.skip(this, maximumToSkip);
    }

    public static skip<T>(iterator: AsyncIterator<T>, maximumToSkip: number): AsyncIterator<T>
    {
        return SkipAsyncIterator.create(iterator, maximumToSkip);
    }
}