import { EmptyError } from "./emptyError";
import { EqualFunctions } from "./equalFunctions";
import { JavascriptIterable } from "./javascript";
import { List } from "./list";
import { PreCondition } from "./preCondition";
import { Stack } from "./stack";
import { SyncResult } from "./syncResult";

export class ListStack<T> implements Stack<T>
{
    private readonly list: List<T>;

    private constructor(list?: List<T>)
    {
        this.list = list ?? List.create();
    }

    public static create<T>(list?: List<T>): ListStack<T>
    {
        return new ListStack<T>(list);
    }

    public any(): SyncResult<boolean>
    {
        return this.list.any();
    }

    public getCount(): SyncResult<number>
    {
        return this.list.getCount();
    }

    public add(value: T): SyncResult<void>
    {
        return SyncResult.create(() =>
        {
            this.list.add(value);
        });
    }

    public addAll(values: JavascriptIterable<T>): SyncResult<void>
    {
        PreCondition.assertNotUndefinedAndNotNull(values, "values");

        return SyncResult.create(() =>
        {
            this.list.addAll(values);
        });
    }

    public remove(): SyncResult<T>
    {
        return SyncResult.create(() =>
        {
            if (!this.any().await())
            {
                throw new EmptyError();
            }
            return this.list.removeLast().await();
        });
    }

    public contains(value: T, equalFunctions?: EqualFunctions): SyncResult<boolean>
    {
        return this.list.contains(value, equalFunctions);
    }
}