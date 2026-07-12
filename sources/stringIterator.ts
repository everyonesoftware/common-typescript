import { Iterator } from "./iterator.js";
import { JavascriptIterable, JavascriptIterator } from "./javascript.js";
import { PreCondition } from "./preCondition.js";
import { SyncResult } from "./syncResult.js";
import { Type } from "./types.js";

/**
 * An {@link Iterator} that iterates over the characters in a {@link string}.
 */
export class StringIterator implements Iterator<string>
{
    private readonly value: string;
    private currentIndex: number;
    private started: boolean;

    private constructor(value: string)
    {
        this.value = value;
        this.currentIndex = 0;
        this.started = false;
    }

    public static create(value: string): StringIterator
    {
        PreCondition.assertNotUndefinedAndNotNull(value, "value");

        return new StringIterator(value);
    }

    public getCurrentIndex(): number
    {
        PreCondition.assertTrue(this.hasCurrent(), "this.hasCurrent()");

        return this.currentIndex;
    }

    public next(): SyncResult<boolean>
    {
        return SyncResult.create(() =>
        {
            if (!this.hasStarted())
            {
                this.started = true;
            }
            else if (this.hasCurrent())
            {
                this.currentIndex++;
            }
            return this.hasCurrent();
        });
    }

    public hasStarted(): boolean
    {
        return this.started;
    }

    public hasCurrent(): boolean
    {
        return this.hasStarted() && this.currentIndex < this.value.length;
    }

    public getCurrent(): string
    {
        PreCondition.assertTrue(this.hasCurrent(), "this.hasCurrent()");

        return this.value[this.currentIndex];
    }

    public start(): SyncResult<this>
    {
        return Iterator.start<string, this>(this);
    }

    public takeCurrent(): SyncResult<string>
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

    public toArray(): SyncResult<string[]>
    {
        return Iterator.toArray(this);
    }

    public concatenate(...toConcatenate: JavascriptIterable<string>[]): Iterator<string>
    {
        return Iterator.concatenate(this, ...toConcatenate);
    }

    public map<TOutput>(mapping: (value: string) => (TOutput | SyncResult<TOutput>)): Iterator<TOutput>
    {
        return Iterator.map(this, mapping);
    }

    public flatMap<TOutput>(mapping: (value: string) => JavascriptIterable<TOutput>): Iterator<TOutput>
    {
        return Iterator.flatMap(this, mapping);
    }

    public first(): SyncResult<string>
    {
        return Iterator.first(this);
    }

    public last(): SyncResult<string>
    {
        return Iterator.last(this);
    }

    public where(condition: (value: string) => boolean): Iterator<string>
    {
        return Iterator.where(this, condition);
    }

    public whereInstanceOf<U extends string>(typeCheck: (value: string) => value is U): Iterator<U>
    {
        return Iterator.whereInstanceOf(this, typeCheck);
    }

    public whereInstanceOfType<U extends string>(type: Type<U>): Iterator<U>
    {
        return Iterator.whereInstanceOfType(this, type);
    }

    public take(maximumToTake: number): Iterator<string>
    {
        return Iterator.take(this, maximumToTake);
    }

    public skip(maximumToSkip: number): Iterator<string>
    {
        return Iterator.skip(this, maximumToSkip);
    }

    public [Symbol.iterator](): JavascriptIterator<string>
    {
        return Iterator[Symbol.iterator](this);
    }
}