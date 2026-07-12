import { Iterator } from "./iterator.js";
import { JavascriptIterable, JavascriptIterator } from "./javascript.js";
import { PreCondition } from "./preCondition.js";
import { SyncResult } from "./syncResult.js";
import { isBoolean, Type } from "./types.js";

/**
 * An {@link Iterator} that only returns values that match a condition.
 */
export class WhereIterator<T> implements Iterator<T>
{
    // WhereIterator cannot extend Iterator because their create() functions are different.
    private readonly innerIterator: Iterator<T>;
    private started: boolean;
    private readonly condition: (value: T) => (boolean | SyncResult<boolean>);

    private constructor(innerIterator: Iterator<T>, condition: (value: T) => (boolean | SyncResult<boolean>))
    {
        PreCondition.assertNotUndefinedAndNotNull(innerIterator, "innerIterator");
        PreCondition.assertNotUndefinedAndNotNull(condition, "condition");

        this.innerIterator = innerIterator;
        this.started = false;
        this.condition = condition;
    }

    public static create<T>(innerIterator: Iterator<T>, condition: (value: T) => (boolean | SyncResult<boolean>)): WhereIterator<T>
    {
        return new WhereIterator(innerIterator, condition);
    }

    public hasStarted(): boolean
    {
        return this.started;
    }

    public hasCurrent(): boolean
    {
        return this.hasStarted() && this.innerIterator.hasCurrent();
    }

    public getCurrent(): T
    {
        PreCondition.assertTrue(this.hasCurrent(), "this.hasCurrent()");

        return this.innerIterator.getCurrent();
    }

    public next(): SyncResult<boolean>
    {
        return SyncResult.create(() =>
        {
            if (!this.hasStarted())
            {
                this.innerIterator.start().await();
                this.started = true;
            }
            else
            {
                this.innerIterator.next().await();
            }

            while (this.hasCurrent())
            {
                const conditionResult: boolean | SyncResult<boolean> = this.condition(this.getCurrent());
                const conditionBoolean: boolean = isBoolean(conditionResult) ? conditionResult : conditionResult.await();
                if (conditionBoolean)
                {
                    break;
                }
                
                this.innerIterator.next().await();
            }
            return this.hasCurrent();
        });
    }

    public start(): SyncResult<this>
    {
        return Iterator.start<T, this>(this);
    }

    public takeCurrent(): SyncResult<T>
    {
        return Iterator.takeCurrent(this);
    }

    public any(): SyncResult<boolean>
    {
        return Iterator.any(this);
    }

    public getCount(): SyncResult<number>
    {
        return Iterator.getCount(this);
    }

    public toArray(): SyncResult<T[]>
    {
        return Iterator.toArray(this);
    }
    
    public concatenate(...toConcatenate: JavascriptIterable<T>[]): Iterator<T>
    {
        return Iterator.concatenate(this, ...toConcatenate);
    }

    public where(condition: (value: T) => boolean): Iterator<T>
    {
        return Iterator.where(this, condition);
    }

    public map<TOutput>(mapping: (value: T) => (TOutput | SyncResult<TOutput>)): Iterator<TOutput>
    {
        return Iterator.map(this, mapping);
    }

    public flatMap<TOutput>(mapping: (value: T) => JavascriptIterable<TOutput>): Iterator<TOutput>
    {
        return Iterator.flatMap(this, mapping);
    }

    public whereInstanceOf<U extends T>(typeCheck: (value: T) => value is U): Iterator<U>
    {
        return Iterator.whereInstanceOf(this, typeCheck);
    }

    public whereInstanceOfType<U extends T>(type: Type<U>): Iterator<U>
    {
        return Iterator.whereInstanceOfType(this, type);
    }

    public first(condition?: (value: T) => boolean): SyncResult<T>
    {
        return Iterator.first(this, condition);
    }

    public last(condition?: (value: T) => boolean): SyncResult<T>
    {
        return Iterator.last(this, condition);
    }

    public take(maximumToTake: number): Iterator<T>
    {
        return Iterator.take(this, maximumToTake);
    }

    public skip(maximumToSkip: number): Iterator<T>
    {
        return Iterator.skip(this, maximumToSkip);
    }

    public [Symbol.iterator](): JavascriptIterator<T>
    {
        return Iterator[Symbol.iterator](this);
    }
}