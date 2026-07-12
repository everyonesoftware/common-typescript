import { AsyncIterator } from "./asyncIterator.js";
import { JavascriptAsyncIterator, JavascriptIteratorResult } from "./javascript.js";
import { PreCondition } from "./preCondition.js";

/**
 * A type that adapts an {@link AsyncIterator} to match a {@link JavascriptAsyncIterator}.
 */
export class AsyncIteratorToJavascriptAsyncIteratorAdapter<T> implements JavascriptAsyncIterator<T>
{
    private readonly iterator: AsyncIterator<T>;
    private hasStarted: boolean;

    private constructor(iterator: AsyncIterator<T>)
    {
        PreCondition.assertNotUndefinedAndNotNull(iterator, "iterator");

        this.iterator = iterator;
        this.hasStarted = false;
    }

    public static create<T>(iterator: AsyncIterator<T>): AsyncIteratorToJavascriptAsyncIteratorAdapter<T>
    {
        return new AsyncIteratorToJavascriptAsyncIteratorAdapter<T>(iterator);
    }
    
    public async next(): Promise<JavascriptIteratorResult<T>>
    {
        if (!this.hasStarted)
        {
            this.hasStarted = true;
            await this.iterator.start();
        }
        else
        {
            await this.iterator.next();
        }

        const result: JavascriptIteratorResult<T> = {
            done: !this.iterator.hasCurrent(),
            value: undefined!,
        };
        if (!result.done)
        {
            result.value = this.iterator.getCurrent();
        }
        return result;
    }
}