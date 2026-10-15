import { Iterator } from "./iterator.js";
import { JavascriptIterable, JavascriptIterator } from "./javascript.js";
import { PreCondition } from "./preCondition.js";
import { SyncResult } from "./syncResult.js";

/**
 * An {@link Iterator} that only returns values that match a condition.
 */
export class WhereIterator<TInner, TOuter extends TInner = TInner> implements Iterator<TOuter>
{
    // WhereIterator cannot extend Iterator because their create() functions are different.
    private readonly innerIterator: Iterator<TInner>;
    private started: boolean;
    private readonly condition: (value: TInner) => value is TOuter;

    private constructor(innerIterator: Iterator<TInner>, condition: (value: TInner) => value is TOuter)
    {
        PreCondition.assertNotUndefinedAndNotNull(innerIterator, "innerIterator");
        PreCondition.assertNotUndefinedAndNotNull(condition, "condition");

        this.innerIterator = innerIterator;
        this.started = false;
        this.condition = condition;
    }

    public static create<TInner,TOuter extends TInner>(innerIterator: Iterator<TInner>, condition: (value: TInner) => value is TOuter): WhereIterator<TInner,TOuter>;
    public static create<TInner>(innerIterator: Iterator<TInner>, condition: (value: TInner) => boolean): WhereIterator<TInner>;
    static create<TInner,TOuter extends TInner>(innerIterator: Iterator<TInner>, condition: (value: TInner) => value is TOuter): WhereIterator<TInner,TOuter>
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

    public getCurrent(): TOuter
    {
        PreCondition.assertTrue(this.hasCurrent(), "this.hasCurrent()");

        return this.innerIterator.getCurrent() as TOuter;
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
                if (this.condition(this.getCurrent()))
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
        return Iterator.start<TOuter, this>(this);
    }

    public takeCurrent(): SyncResult<TOuter>
    {
        return Iterator.takeCurrent(this) as SyncResult<TOuter>;
    }

    public any(): SyncResult<boolean>
    {
        return Iterator.any(this);
    }

    public getCount(): SyncResult<number>
    {
        return Iterator.getCount(this);
    }

    public toArray(): SyncResult<TOuter[]>
    {
        return Iterator.toArray(this);
    }
    
    public concatenate(...toConcatenate: JavascriptIterable<TOuter>[]): Iterator<TOuter>
    {
        return Iterator.concatenate(this, ...toConcatenate);
    }

    public where<TOuter2 extends TOuter>(condition: (value: TOuter) => value is TOuter2): Iterator<TOuter2>
    {
        return Iterator.where(this, condition);
    }

    public map<TOuter2>(mapping: (value: TOuter) => (TOuter2 | SyncResult<TOuter2>)): Iterator<TOuter2>
    {
        return Iterator.map(this, mapping);
    }

    public flatMap<TOuter2>(mapping: (value: TOuter) => JavascriptIterable<TOuter2>): Iterator<TOuter2>
    {
        return Iterator.flatMap(this, mapping);
    }

    public first(condition?: (value: TOuter) => boolean): SyncResult<TOuter>
    {
        return Iterator.first(this, condition);
    }

    public last(condition?: (value: TOuter) => boolean): SyncResult<TOuter>
    {
        return Iterator.last(this, condition);
    }

    public take(maximumToTake: number): Iterator<TOuter>
    {
        return Iterator.take(this, maximumToTake);
    }

    public skip(maximumToSkip: number): Iterator<TOuter>
    {
        return Iterator.skip(this, maximumToSkip);
    }

    public [Symbol.iterator](): JavascriptIterator<TOuter>
    {
        return Iterator[Symbol.iterator](this);
    }
}