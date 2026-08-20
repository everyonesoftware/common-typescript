import { AsyncResult } from "./asyncResult.js";
import { PreCondition } from "./preCondition.js";

/**
 * An object that can be asynchronously disposed.
 */
export abstract class AsyncDisposable
{
    /**
     * Create a new {@link AsyncDisposable} that will run the provided function when it is disposed.
     * @param disposeFunction The function that will be invoked when the new {@link AsyncDisposable}
     * is disposed.
     */
    public static create(disposeFunction: () => (unknown | Promise<unknown>)): AsyncDisposable
    {
        return BasicAsyncDisposable.create(disposeFunction);
    }

    /**
     * Run the dispose function if it hasn't already been run. Returns whether this is the first
     * invocation of the dispose() function.
     */
    public abstract dispose(): AsyncResult<boolean>;

    /**
     * Get whether this {@link AsyncDisposable} has already been disposed.
     */
    public abstract isDisposed(): boolean;
}

class BasicAsyncDisposable extends AsyncDisposable
{
    private readonly disposeFunction: () => (unknown | Promise<unknown>);
    private disposed: boolean;

    protected constructor(disposeFunction: () => (unknown | Promise<unknown>))
    {
        PreCondition.assertNotUndefinedAndNotNull(disposeFunction, "disposeFunction");

        super();

        this.disposeFunction = disposeFunction;
        this.disposed = false;
    }

    public static create(disposeFunction: () => (unknown | Promise<unknown>)): BasicAsyncDisposable
    {
        return new BasicAsyncDisposable(disposeFunction);
    }

    public dispose(): AsyncResult<boolean>
    {
        return AsyncResult.create(async () =>
        {
            const result: boolean = !this.disposed;
            if (result)
            {
                try
                {
                    await this.disposeFunction();
                }
                finally
                {
                    this.disposed = true;
                }
            }
            return result;
        });
    }

    public isDisposed(): boolean
    {
        return this.disposed;
    }
}