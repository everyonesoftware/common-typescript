import { Iterator } from "./iterator.js";
import { JavascriptIterable, JavascriptIterator } from "./javascript.js";
import { List } from "./list.js";
import { PreCondition } from "./preCondition.js";
import { SyncResult } from "./syncResult.js";
import { Type } from "./types.js";

export class ConcatenateIterator<T> implements Iterator<T>
{
    private readonly innerIterators: Iterator<Iterator<T>>;

    private constructor(innerIterators: Iterator<Iterator<T>>)
    {
        PreCondition.assertNotUndefinedAndNotNull(innerIterators, "innerIterators");

        this.innerIterators = innerIterators;
    }

    public static create<T>(...toConcatenate: JavascriptIterable<T>[]): ConcatenateIterator<T>
    {
        PreCondition.assertNotUndefinedAndNotNull(toConcatenate, "toConcatenate");

        const innerIterators: List<Iterator<T>> = List.create();
        for (const value of toConcatenate)
        {
            innerIterators.add(Iterator.create(value));
        }
        return new ConcatenateIterator<T>(innerIterators.iterate());
    }

    public next(): SyncResult<boolean>
    {
        return SyncResult.create(() =>
        {
            let innerIteratorAtBeginning: boolean = false;
            if (!this.innerIterators.hasStarted())
            {
                this.innerIterators.next().await();
                innerIteratorAtBeginning = true;
            }

            while (this.innerIterators.hasCurrent())
            {
                const innerIterator: Iterator<T> = this.innerIterators.getCurrent();
                if (innerIteratorAtBeginning)
                {
                    innerIterator.start().await();
                }
                else
                {
                    innerIterator.next().await();
                }

                if (innerIterator.hasCurrent())
                {
                    break;
                }
                else
                {
                    this.innerIterators.next().await();
                    innerIteratorAtBeginning = true;
                }
            }

            return this.hasCurrent();
        });
    }

    public hasStarted(): boolean
    {
        return this.innerIterators.hasStarted();
    }

    public hasCurrent(): boolean
    {
        return this.innerIterators.hasCurrent();
    }

    public getCurrent(): T
    {
        PreCondition.assertTrue(this.hasCurrent(), "this.hasCurrent()");

        return this.innerIterators.getCurrent().getCurrent();
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

    public where(condition: (value: T) => (boolean | SyncResult<boolean>)): Iterator<T>
    {
        return Iterator.where(this, condition);
    }

    public map<TOutput>(mapping: (value: T) => TOutput | SyncResult<TOutput>): Iterator<TOutput>
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

    public first(condition?: ((value: T) => (boolean | SyncResult<boolean>)) | undefined): SyncResult<T>
    {
        return Iterator.first(this, condition);
    }

    public last(condition?: ((value: T) => (boolean | SyncResult<boolean>)) | undefined): SyncResult<T>
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