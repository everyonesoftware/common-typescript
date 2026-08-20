import { AsyncDisposable } from "./AsyncDisposable.js";
import { PreCondition } from "./preCondition.js";
import { SyncResult } from "./syncResult.js";

/**
 * A type that can be configured with a function that will be invoked when the object is disposed.
 */
export abstract class SyncDisposable implements AsyncDisposable
{
    /**
     * Create a new {@link Disposable} that will invoke the provided {@link Function} when it is
     * disposed.
     * @param disposedFunction The function to invoke when the returned {@link Disposable} is
     * disposed.
     */
    public static create(disposedFunction: () => unknown): SyncDisposable
    {
        return BasicSyncDisposable.create(disposedFunction);
    }

    /**
     * Run the dispose function if it hasn't already been run. Returns whether this is the first
     * invocation of the dispose() function.
     */
    public abstract dispose(): SyncResult<boolean>;

    /**
     * Get whether this {@link SyncDisposable} has already been disposed.
     */
    public abstract isDisposed(): boolean;
}

class BasicSyncDisposable extends SyncDisposable
{
    private readonly disposeFunction: () => unknown;
    private disposed: boolean;

    protected constructor(disposeFunction: () => unknown)
    {
        PreCondition.assertNotUndefinedAndNotNull(disposeFunction, "disposeFunction");

        super();

        this.disposeFunction = disposeFunction;
        this.disposed = false;
    }

    public static create(disposeFunction: () => unknown): BasicSyncDisposable
    {
        return new BasicSyncDisposable(disposeFunction);
    }

    public dispose(): SyncResult<boolean>
    {
        return SyncResult.create(() =>
        {
            const result: boolean = !this.disposed;
            if (result)
            {
                try
                {
                    this.disposeFunction();
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