import { JavascriptIterable, JavascriptIterator } from "./javascript.js";
import { List } from "./list.js";
import { ListStack } from "./listStack.js";
import { PreCondition } from "./preCondition.js";
import { SearchControl } from "./searchControl.js";
import { Stack } from "./stack.js";
import { Set } from "./set.js";
import { Iterator } from "./iterator.js";
import { SyncResult } from "./syncResult.js";
import { isJavascriptIterable, Type } from "./types.js";

class SearchBreakError extends Error
{
}

class DepthFirstSearch<TVisit,TResult> implements SearchControl<TVisit,TResult>, Iterator<TResult>
{
    private readonly searchAction: (searchControl: SearchControl<TVisit,TResult>, visiting: TVisit) => void;
    private readonly toVisit: ListStack<TVisit>;
    private readonly visited: Set<TVisit>;
    private readonly results: List<TResult>;
    private started: boolean;
    private done: boolean;

    private constructor(initialToVisit: JavascriptIterable<TVisit>, searchAction: (searchControl: SearchControl<TVisit,TResult>, visiting: TVisit) => void)
    {
        PreCondition.assertNotUndefinedAndNotNull(initialToVisit, "initialToVisit");
        PreCondition.assertNotUndefinedAndNotNull(searchAction, "searchAction");

        this.searchAction = searchAction;
        this.toVisit = Stack.create();
        this.toVisit.addAll(initialToVisit).await();
        this.visited = Set.create();
        this.results = List.create();
        this.started = false;
        this.done = false;
    }

    public static create<TVisit,TResult>(initialToVisit: JavascriptIterable<TVisit>, searchAction: (searchControl: SearchControl<TVisit,TResult>, visiting: TVisit) => void): DepthFirstSearch<TVisit,TResult>
    {
        return new DepthFirstSearch(initialToVisit, searchAction);
    }

    public addToVisit(toVisit: TVisit): void
    {
        if (!this.hasVisited(toVisit))
        {
            this.toVisit.add(toVisit);
        }
    }

    public addAllToVisit(values: JavascriptIterable<TVisit>): void
    {
        for (const value of values)
        {
            this.addToVisit(value);
        }
    }

    public hasVisited(toVisit: TVisit): boolean
    {
        return this.visited.contains(toVisit).await();
    }

    public addResult(result: TResult): void
    {
        this.results.add(result);
    }

    public addResults(results: JavascriptIterable<TResult>): void
    {
        this.results.addAll(results);
    }

    public break(): never
    {
        throw new SearchBreakError();
    }

    public next(): SyncResult<boolean>
    {
        return SyncResult.create(() =>
        {
            let result: boolean = false;
            if (!this.done)
            {
                if (!this.started)
                {
                    this.started = true;
                }
                else
                {
                    this.results.removeFirst().await();
                }
                
                while (!this.hasCurrent() && this.toVisit.any().await())
                {
                    const current: TVisit = this.toVisit.remove().await();
                    this.visited.add(current);
                    this.searchAction(this, current);
                }

                result = this.hasCurrent();
                this.done = !result;
            }
            return result;
        });
    }

    public hasStarted(): boolean
    {
        return this.started;
    }

    public hasCurrent(): boolean
    {
        return this.results.any().await();
    }

    public getCurrent(): TResult
    {
        PreCondition.assertTrue(this.hasCurrent(), "this.hasCurrent()");

        return this.results.first().await();
    }

    public start(): SyncResult<this>
    {
        return Iterator.start<TResult,this>(this);
    }

    public takeCurrent(): SyncResult<TResult>
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

    public toArray(): SyncResult<TResult[]>
    {
        return Iterator.toArray(this);
    }

    public concatenate(...toConcatenate: JavascriptIterable<TResult>[]): Iterator<TResult>
    {
        return Iterator.concatenate(this, ...toConcatenate);
    }

    public where(condition: (value: TResult) => (boolean | SyncResult<boolean>)): Iterator<TResult>
    {
        return Iterator.where(this, condition);
    }

    public map<TOutput>(mapping: (value: TResult) => TOutput | SyncResult<TOutput>): Iterator<TOutput>
    {
        return Iterator.map(this, mapping);
    }

    public flatMap<TOutput>(mapping: (value: TResult) => JavascriptIterable<TOutput>): Iterator<TOutput>
    {
        return Iterator.flatMap(this, mapping);
    }

    public whereInstanceOf<U extends TResult>(typeCheck: (value: TResult) => value is U): Iterator<U>
    {
        return Iterator.whereInstanceOf(this, typeCheck);
    }

    public whereInstanceOfType<U extends TResult>(type: Type<U>): Iterator<U>
    {
        return Iterator.whereInstanceOfType(this, type);
    }

    public first(condition?: ((value: TResult) => (boolean | SyncResult<boolean>)) | undefined): SyncResult<TResult>
    {
        return Iterator.first(this, condition);
    }

    public last(condition?: ((value: TResult) => (boolean | SyncResult<boolean>)) | undefined): SyncResult<TResult>
    {
        return Iterator.last(this, condition);
    }

    public take(maximumToTake: number): Iterator<TResult>
    {
        return Iterator.take(this, maximumToTake);
    }

    public skip(maximumToSkip: number): Iterator<TResult>
    {
        return Iterator.skip(this, maximumToSkip);
    }

    public [Symbol.iterator](): JavascriptIterator<TResult>
    {
        return Iterator[Symbol.iterator](this);
    }
}

export function depthFirstSearch<TVisit,TResult>(initialToVisit: JavascriptIterable<TVisit>, searchAction: (searchControl: SearchControl<TVisit,TResult>, current: TVisit) => void): Iterator<TResult>;
export function depthFirstSearch<TVisit,TResult>(parameters: { initialToVisit: JavascriptIterable<TVisit>, searchAction: (searchControl: SearchControl<TVisit,TResult>, current: TVisit) => void }): Iterator<TResult>;
export function depthFirstSearch<TVisit,TResult>(parametersOrInitialToVisit: JavascriptIterable<TVisit> | { initialToVisit: JavascriptIterable<TVisit>, searchAction: (searchControl: SearchControl<TVisit,TResult>, current: TVisit) => void }, searchAction?: (searchControl: SearchControl<TVisit,TResult>, current: TVisit) => void): Iterator<TResult>
{
    let initialToVisit: JavascriptIterable<TVisit>;
    if (isJavascriptIterable(parametersOrInitialToVisit))
    {
        initialToVisit = parametersOrInitialToVisit;
        searchAction = searchAction!;
    }
    else
    {
        PreCondition.assertNotUndefinedAndNotNull(parametersOrInitialToVisit, "parameters");

        initialToVisit = parametersOrInitialToVisit.initialToVisit;
        searchAction = parametersOrInitialToVisit.searchAction;
    }

    PreCondition.assertNotUndefinedAndNotNull(initialToVisit, "initialToVisit");
    PreCondition.assertNotUndefinedAndNotNull(searchAction, "searchAction");

    return DepthFirstSearch.create(initialToVisit, searchAction);
}