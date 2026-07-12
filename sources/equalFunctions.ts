import { Comparer } from "./comparer.js";
import { Iterable } from "./iterable.js";
import { isMap, Map } from "./map.js";
import { PreCondition } from "./preCondition.js";
import { SyncResult } from "./syncResult.js";
import { getPropertyNames, hasProperty, isBoolean, isJavascriptIterable, isObject, isString } from "./types.js";

/**
 * A collection of {@link Function}s that can be used to determine if two values are equal.
 */
export class EqualFunctions
{
    private readonly equalFunctions: ((left: unknown, right: unknown) => (boolean | SyncResult<boolean> | undefined))[];

    private constructor()
    {
        this.equalFunctions = [];
    }

    public static create(): EqualFunctions
    {
        return new EqualFunctions();
    }

    private defaultEqualFunction(left: unknown, right: unknown): SyncResult<boolean>
    {
        return SyncResult.create(() =>
        {
            let result: boolean | undefined = Comparer.equalSameUndefinedNull(left, right);
            if (result === undefined)
            {
                result = false;

                if (isMap(left))
                {
                    if (isMap(right))
                    {
                        result = Map.equals(left, right, this).await();
                    }
                }
                else if (isJavascriptIterable(left) && !isString(left))
                {
                    if (isJavascriptIterable(right) && !isString(right) && !isMap(right))
                    {
                        result = Iterable.equals(left, right, this).await();
                    }
                }
                else if (isObject(left))
                {
                    if (isObject(right))
                    {
                        result = true;

                        for (const leftPropertyName of getPropertyNames(left))
                        {
                            if (!hasProperty(left, leftPropertyName) || !hasProperty(right, leftPropertyName))
                            {
                                result = false;
                                break;
                            }
                            else
                            {
                                result = this.areEqual(left[leftPropertyName], right[leftPropertyName]).await();
                            }
                        }

                        if (result)
                        {
                            for (const rightPropertyName of getPropertyNames(right))
                            {
                                if (!hasProperty(left, rightPropertyName) || !hasProperty(right, rightPropertyName))
                                {
                                    result = false;
                                    break;
                                }
                                else
                                {
                                    result = this.areEqual(left[rightPropertyName], right[rightPropertyName]).await();
                                }
                            }
                        }
                    }
                }
            }
            return result;
        });
    }

    /**
     * Get whether the provided values are equal based on the registered equal {@link Function}s.
     * @param left The left value in the comparison.
     * @param right The right value in the comparison.
     */
    public areEqual(left: unknown, right: unknown): SyncResult<boolean>
    {
        return SyncResult.create(() =>
        {
            let result: boolean | SyncResult<boolean> | undefined;
            for (const equalFunction of this.equalFunctions)
            {
                result = equalFunction(left, right);
                if (result !== undefined)
                {
                    break;
                }
            }
            if (result === undefined)
            {
                result = this.defaultEqualFunction(left, right);
            }
            return isBoolean(result) ? result : result.await();
        });
    }

    public add(equalFunction: (left: unknown, right: unknown) => (boolean | undefined)): this
    {
        PreCondition.assertNotUndefinedAndNotNull(equalFunction, "equalFunction");

        this.equalFunctions.unshift(equalFunction);

        return this;
    }
}