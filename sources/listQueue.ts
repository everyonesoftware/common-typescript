import { EmptyError } from "./emptyError.js";
import { EqualFunctions } from "./equalFunctions.js";
import { JavascriptIterable } from "./javascript.js";
import { List } from "./list.js";
import { PreCondition } from "./preCondition.js";
import { Queue } from "./queue.js";
import { SyncResult } from "./syncResult.js";

export class ListQueue<T> implements Queue<T>
{
    private readonly list: List<T>;

    private constructor(list?: List<T>)
    {
        this.list = list ?? List.create();
    }

    public static create<T>(list?: List<T>): ListQueue<T>
    {
        return new ListQueue<T>(list);
    }

    public any(): SyncResult<boolean>
    {
        return this.list.any();
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