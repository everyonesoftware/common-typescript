import { PromiseAsyncResult } from "./promiseAsyncResult.js";
import { AsyncIterator } from "./asyncIterator.js";
import { JavascriptAsyncIterable, JavascriptAsyncIterator, JavascriptIteratorResult } from "./javascript.js";
import { PreCondition } from "./preCondition.js";
import { isJavascriptAsyncIterable, Type } from "./types.js";
import { AsyncIteratorToJavascriptAsyncIteratorAdapter } from "./asyncIteratorToJavascriptAsyncIteratorAdapter.js";

export class JavascriptAsyncIteratorToAsyncIteratorAdapter<T> implements AsyncIterator<T>
{
    private readonly javascriptIterator: JavascriptAsyncIterator<T>;
    private javascriptIteratorResult?: JavascriptIteratorResult<T>;

    private constructor(javascriptIterator: JavascriptAsyncIterator<T>)
    {
        PreCondition.assertNotUndefinedAndNotNull(javascriptIterator, "javascriptIterator");

        this.javascriptIterator = javascriptIterator;
    }

    public static create<T>(javascriptIterator: JavascriptAsyncIterator<T> | JavascriptAsyncIterable<T>): JavascriptAsyncIteratorToAsyncIteratorAdapter<T>
    {
        if (isJavascriptAsyncIterable<T>(javascriptIterator))
        {
            javascriptIterator = javascriptIterator[Symbol.asyncIterator]();
        }
        return new JavascriptAsyncIteratorToAsyncIteratorAdapter(javascriptIterator);
    }

    public next(): PromiseAsyncResult<boolean>
    {
        return PromiseAsyncResult.create(async () =>
        {
            this.javascriptIteratorResult = await this.javascriptIterator.next();
            return this.hasCurrent();
        });
    }

    public hasStarted(): boolean
    {
        return this.javascriptIteratorResult !== undefined;
    }

    public hasCurrent(): boolean
    {
        return this.javascriptIteratorResult?.done === false;
    }

    public getCurrent(): T
    {
        PreCondition.assertTrue(this.hasCurrent(), "this.hasCurrent()");

        return this.javascriptIteratorResult!.value;
    }

    public start(): PromiseAsyncResult<this>
    {
        return AsyncIterator.start<T, this>(this);
    }

    public takeCurrent(): PromiseAsyncResult<T>
    {
        return AsyncIterator.takeCurrent(this);
    }

    public any(): PromiseAsyncResult<boolean>
    {
        return AsyncIterator.any(this);
    }

    public getCount(): PromiseAsyncResult<number>
    {
        return AsyncIterator.getCount(this);
    }

    public toArray(): PromiseAsyncResult<T[]>
    {
        return AsyncIterator.toArray(this);
    }

    public map<TOutput>(mapping: (value: T) => (TOutput | PromiseLike<TOutput>)): AsyncIterator<TOutput>
    {
        return AsyncIterator.map(this, mapping);
    }

    public [Symbol.asyncIterator](): JavascriptAsyncIterator<T>
    {
        return AsyncIterator[Symbol.asyncIterator](this);
    }

    public first(condition?: (value: T) => (boolean | PromiseLike<boolean>)): PromiseAsyncResult<T>
    {
        return AsyncIterator.first(this, condition);
    }

    public last(condition?: (value: T) => (boolean | PromiseLike<boolean>)): PromiseAsyncResult<T>
    {
        return AsyncIterator.last(this, condition);
    }

    public where(condition: (value: T) => (boolean | PromiseLike<boolean>)): AsyncIterator<T>
    {
        return AsyncIterator.where(this, condition);
    }

    public whereInstanceOf<U extends T>(typeCheck: (value: T) => value is U): AsyncIterator<U>
    {
        return AsyncIterator.whereInstanceOf(this, typeCheck);
    }

    public whereInstanceOfType<U extends T>(type: Type<U>): AsyncIterator<U>
    {
        return AsyncIterator.whereInstanceOfType(this, type);
    }

    public take(maximumToTake: number): AsyncIterator<T>
    {
        return AsyncIterator.take(this, maximumToTake);
    }

    public skip(maximumToSkip: number): AsyncIterator<T>
    {
        return AsyncIterator.skip(this, maximumToSkip);
    }
}