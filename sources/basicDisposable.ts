import { Disposable } from "./disposable.js";
import { PreCondition } from "./preCondition.js";
import { SyncResult } from "./syncResult.js";

/**
 * A {@link Disposable} type that can be configured with a function that will be invoked when the
 * object is disposed.
 */
export class SyncDisposable implements Disposable
{
    private readonly disposedFunction: () => void;
    private disposed: boolean;

    protected constructor(disposedFunction: () => void)
    {
        PreCondition.assertNotUndefinedAndNotNull(disposedFunction, "disposedFunction");

        this.disposedFunction = disposedFunction;
        this.disposed = false;
    }

    /**
     * Create a new {@link Disposable} that will invoke the provided {@link Function} when it is
     * disposed.
     * @param disposedFunction The function to invoke when the returned {@link Disposable} is
     * disposed.
     */
    public static create(disposedFunction: () => void): SyncDisposable
    {
        return new SyncDisposable(disposedFunction);
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
                    this.disposedFunction();
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