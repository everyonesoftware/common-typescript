import { SyncDisposable } from "./basicDisposable";
import { AsyncResult } from "./asyncResult";

/**
 * An object that can be disposed.
 */
export abstract class Disposable
{
    /**
     * Create a new {@link Disposable} that will invoke the provided {@link Function} when it is
     * disposed.
     * @param disposedFunction The function to invoke when the returned {@link Disposable} is
     * disposed.
     */
    public static create(disposedFunction: () => void): SyncDisposable
    {
        return SyncDisposable.create(disposedFunction);
    }

    /**
     * Synchronously clean up any resources that this object is using. This function will return
     * true if this invocation disposed of the object. Subsequent calls to dispose() will return
     * false.
     */
    public abstract dispose(): AsyncResult<boolean>;

    /**
     * Get whether this {@link Disposable} has been disposed yet.
     */
    public abstract isDisposed(): boolean;
}