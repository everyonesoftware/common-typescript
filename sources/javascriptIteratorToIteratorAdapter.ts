import { Iterator } from "./iterator.js";
import { isJavascriptIteratorResultDone, JavascriptIterable, JavascriptIterator, JavascriptIteratorResult } from "./javascript.js";
import { PreCondition } from "./preCondition.js";
import { SyncResult } from "./syncResult.js";
import { isJavascriptIterable, Type } from "./types.js";

export class JavascriptIteratorToIteratorAdapter<T> implements Iterator<T>
{
    private readonly javascriptIterator: JavascriptIterator<T>;
    private javascriptIteratorResult?: JavascriptIteratorResult<T>;

    private constructor(javascriptIterator: JavascriptIterator<T>)
    {
        PreCondition.assertNotUndefinedAndNotNull(javascriptIterator, "javascriptIterator");

        this.javascriptIterator = javascriptIterator;
    }

    public static create<T>(javascriptIterator: JavascriptIterator<T> | JavascriptIterable<T>): JavascriptIteratorToIteratorAdapter<T>
    {
        if (isJavascriptIterable<T>(javascriptIterator))
        {
            javascriptIterator = javascriptIterator[Symbol.iterator]();
        }
        return new JavascriptIteratorToIteratorAdapter(javascriptIterator);
    }

    public next(): SyncResult<boolean>
    {
        return SyncResult.create(() =>
        {
            this.javascriptIteratorResult = this.javascriptIterator.next();
            return this.hasCurrent();
        });
    }

    public hasStarted(): boolean
    {
        return this.javascriptIteratorResult !== undefined;
    }

    public hasCurrent(): boolean
    {
        return !isJavascriptIteratorResultDone(this.javascriptIteratorResult);
    }

    public getCurrent(): T
    {
        PreCondition.assertTrue(this.hasCurrent(), "this.hasCurrent()");

        return this.javascriptIteratorResult!.value;
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

    public map<TOutput>(mapping: (value: T) => (TOutput | SyncResult<TOutput>)): Iterator<TOutput>
    {
        return Iterator.map(this, mapping);
    }

    public flatMap<TOutput>(mapping: (value: T) => JavascriptIterable<TOutput>): Iterator<TOutput>
    {
        return Iterator.flatMap(this, mapping);
    }

    public [Symbol.iterator](): JavascriptIterator<T>
    {
        return Iterator[Symbol.iterator](this);
    }

    public first(condition?: (value: T) => boolean): SyncResult<T>
    {
        return Iterator.first(this, condition);
    }

    public last(): SyncResult<T>
    {
        return Iterator.last(this);
    }

    public where(condition: (value: T) => boolean): Iterator<T>
    {
        return Iterator.where(this, condition);
    }

    public whereInstanceOf<U extends T>(typeCheck: (value: T) => value is U): Iterator<U>
    {
        return Iterator.whereInstanceOf(this, typeCheck);
    }

    public whereInstanceOfType<U extends T>(type: Type<U>): Iterator<U>
    {
        return Iterator.whereInstanceOfType(this, type);
    }

    public take(maximumToTake: number): Iterator<T>
    {
        return Iterator.take(this, maximumToTake);
    }

    public skip(maximumToSkip: number): Iterator<T>
    {
        return Iterator.skip(this, maximumToSkip);
    }
}