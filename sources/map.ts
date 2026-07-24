import { Comparer } from "./comparer.js";
import { EqualFunctions } from "./equalFunctions.js";
import { Iterable } from "./iterable.js";
import { Iterator } from "./iterator.js";
import { JavascriptIterable, JavascriptIterator } from "./javascript.js";
import { MutableMap } from "./mutableMap.js";
import { NotFoundError } from "./notFoundError.js";
import { PreCondition } from "./preCondition.js";
import { join } from "./strings.js";
import { SyncResult } from "./syncResult.js";
import { ToStringFunctions } from "./toStringFunctions.js";
import { hasFunction, isUndefinedOrNull, Type } from "./types.js";

/**
 * Get whether the provided value is {@link Map}.
 * @param value The value to check.
 */
export function isMap(value: unknown): value is Map<unknown, unknown>
{
    return value instanceof Map ||
        (
            hasFunction(value, "containsKey", { parameterCount: 1 }) &&
            hasFunction(value, "get", { parameterCount: 1 }) &&
            hasFunction(value, "set", { parameterCount: 2 }) &&
            hasFunction(value, "iterateKeys", { parameterCount: 0 }) &&
            hasFunction(value, "iterateValues", { parameterCount: 0 })
        );
}

/**
 * An entry within a {@link Map}.
 */
export interface MapEntry<TKey, TValue>
{
    /**
     * The key of the {@link MapEntry}.
     */
    readonly key: TKey,
    /**
     * The value of the {@link MapEntry}.
     */
    readonly value: TValue,
}

/**
 * A type that maps {@link TKey} values to {@link TValue} values.
 */
export abstract class Map<TKey, TValue> implements Iterable<MapEntry<TKey, TValue>>
{
    /**
     * Create a new instance of the default {@link MutableMap} implementation.
     */
    public static create<TKey, TValue>(): MutableMap<TKey, TValue>
    {
        return MutableMap.create();
    }

    /**
     * Iterate over the entries in this {@link Map}.
     */
    public abstract iterate(): Iterator<MapEntry<TKey, TValue>>;

    public any(): SyncResult<boolean>
    {
        return Map.any(this);
    }

    public static any<TKey,TValue>(map: Map<TKey,TValue>): SyncResult<boolean>
    {
        return Iterable.any(map);
    }

    public toArray(): SyncResult<MapEntry<TKey, TValue>[]>
    {
        return Map.toArray(this);
    }

    public static toArray<TKey,TValue>(map: Map<TKey,TValue>): SyncResult<MapEntry<TKey,TValue>[]>
    {
        return Iterable.toArray(map);
    }

    public equals(right: Iterable<MapEntry<TKey, TValue>>, equalFunctions?: EqualFunctions): SyncResult<boolean>
    {
        return Map.equals(this, right, equalFunctions);
    }

    public static equals<TKey, TValue>(left: Map<TKey, TValue>, right: Iterable<MapEntry<TKey, TValue>>, equalFunctions?: EqualFunctions): SyncResult<boolean>
    {
        return SyncResult.create(() =>
        {
            if (isUndefinedOrNull(equalFunctions))
            {
                equalFunctions = EqualFunctions.create();
            }

            let result: boolean | undefined = Comparer.equalSameUndefinedNull(left, right);
            if (result === undefined)
            {
                result = true;
                for (const entry of right)
                {
                    result = left.get(entry.key)
                        .then((value: TValue) => equalFunctions!.areEqual(value, entry.value).await())
                        .catch(() => false)
                        .await();
                    if (result === false)
                    {
                        break;
                    }
                }
            }
            return result;
        });
    }

    /**
     * Get the {@link String} representation of this {@link Map}.
     */
    public toString(toStringFunctions?: ToStringFunctions): string
    {
        return Map.toString(this, toStringFunctions);
    }

    /**
     * Get the {@link String} representation of the provided {@link Map}.
     */
    public static toString<TKey, TValue>(map: Map<TKey, TValue>, toStringFunctions?: ToStringFunctions): string
    {
        PreCondition.assertNotUndefinedAndNotNull(map, "iterable");

        if (!toStringFunctions)
        {
            toStringFunctions = ToStringFunctions.create();
        }
        return `{${join(",", map.map((entry: MapEntry<unknown, unknown>) => `${toStringFunctions.toString(entry.key)}:${toStringFunctions.toString(entry.value)}`))}}`;
    }

    public concatenate(...toConcatenate: JavascriptIterable<MapEntry<TKey, TValue>>[]): Iterable<MapEntry<TKey, TValue>>
    {
        return Map.concatenate(this, ...toConcatenate);
    }

    public static concatenate<TKey,TValue>(map: Map<TKey,TValue>, ...toConcatenate: JavascriptIterable<MapEntry<TKey, TValue>>[]): Iterable<MapEntry<TKey, TValue>>
    {
        return Iterable.concatenate(map, ...toConcatenate);
    }

    public map<TOutput>(mapping: (value: MapEntry<TKey, TValue>) => (TOutput | SyncResult<TOutput>)): Iterable<TOutput>
    {
        return Map.map(this, mapping);
    }

    public static map<TKey,TValue,TOutput>(map: Map<TKey,TValue>, mapping: (value: MapEntry<TKey,TValue>) => (TOutput | SyncResult<TOutput>)): Iterable<TOutput>
    {
        return Iterable.map(map, mapping);
    }

    public flatMap<TOutput>(mapping: (value: MapEntry<TKey, TValue>) => JavascriptIterable<TOutput>): Iterable<TOutput>
    {
        return Map.flatMap(this, mapping);
    }

    public static flatMap<TKey,TValue,TOutput>(map: Map<TKey,TValue>, mapping: (value: MapEntry<TKey,TValue>) => JavascriptIterable<TOutput>): Iterable<TOutput>
    {
        return Iterable.flatMap(map, mapping);
    } 

    public where(condition: (value: MapEntry<TKey, TValue>) => (boolean | SyncResult<boolean>)): Iterable<MapEntry<TKey, TValue>>
    {
        return Map.where(this, condition);
    }

    public static where<TKey,TValue>(map: Map<TKey,TValue>, condition: (value: MapEntry<TKey,TValue>) => (boolean | SyncResult<boolean>)): Iterable<MapEntry<TKey,TValue>>
    {
        return Iterable.where(map, condition);
    }

    public instanceOf<T extends MapEntry<TKey, TValue>>(typeOrTypeCheck: Type<T> | ((value: MapEntry<TKey, TValue>) => value is T)): Iterable<T>
    {
        return Map.instanceOf(this, typeOrTypeCheck);
    }

    public static instanceOf<TKey,TValue,T extends MapEntry<TKey, TValue>>(map: Map<TKey,TValue>, typeOrTypeCheck: Type<T> | ((value: MapEntry<TKey, TValue>) => value is T)): Iterable<T>
    {
        return Iterable.instanceOf(map, typeOrTypeCheck);
    }

    public [Symbol.iterator](): JavascriptIterator<MapEntry<TKey, TValue>>
    {
        return Map[Symbol.iterator](this);
    }

    public static [Symbol.iterator]<TKey,TValue>(map: Map<TKey,TValue>): JavascriptIterator<MapEntry<TKey,TValue>>
    {
        return Iterable[Symbol.iterator](map);
    }

    /**
     * Get the number of entries in this {@link Map}.
     */
    public getCount(): SyncResult<number>
    {
        return Map.getCount(this);
    }

    public static getCount<TKey,TValue>(map: Map<TKey,TValue>): SyncResult<number>
    {
        return Iterable.getCount(map);
    }

    public first(condition?: (entry: MapEntry<TKey,TValue>) => (boolean | SyncResult<boolean>)): SyncResult<MapEntry<TKey, TValue>>
    {
        return Map.first(this, condition);
    }

    public static first<TKey,TValue>(map: Map<TKey,TValue>, condition?: (entry: MapEntry<TKey,TValue>) => (boolean | SyncResult<boolean>)): SyncResult<MapEntry<TKey, TValue>>
    {
        return Iterable.first(map, condition);
    }

    public last(condition?: (entry: MapEntry<TKey,TValue>) => (boolean | SyncResult<boolean>)): SyncResult<MapEntry<TKey, TValue>>
    {
        return Map.last(this, condition);
    }

    public static last<TKey,TValue>(map: Map<TKey,TValue>, condition?: (entry: MapEntry<TKey,TValue>) => (boolean | SyncResult<boolean>)): SyncResult<MapEntry<TKey, TValue>>
    {
        return Iterable.last(map, condition);
    }

    /**
     * Get whether this {@link Map} contains the provided key.
     * @param key The key to look for.
     */
    public abstract containsKey(key: TKey): SyncResult<boolean>;

    /**
     * Get the value associated with the provided key.
     * @param key The key of the value to get.
     */
    public abstract get(key: TKey): SyncResult<TValue>;

    /**
     * Iterate over the keys in this {@link Map}.
     */
    public iterateKeys(): Iterator<TKey>
    {
        return Map.iterateKeys(this);
    }

    /**
     * Iterate over the keys in the {@link Map}.
     * @param map The map to iterate over.
     */
    public static iterateKeys<TKey, TValue>(map: Map<TKey, TValue>): Iterator<TKey>
    {
        PreCondition.assertNotUndefinedAndNotNull(map, "map");

        return map.iterate().map((entry: MapEntry<TKey, TValue>) => entry.key);
    }

    /**
     * Iterate over the values in this {@link Map}.
     */
    public iterateValues(): Iterator<TValue>
    {
        return Map.iterateValues(this);
    }

    /**
     * Iterate over the keys in the {@link Map}.
     * @param map The map to iterate over.
     */
    public static iterateValues<TKey, TValue>(map: Map<TKey, TValue>): Iterator<TValue>
    {
        PreCondition.assertNotUndefinedAndNotNull(map, "map");

        return map.iterate().map((entry: MapEntry<TKey, TValue>) => entry.value);
    }

    public contains(value: MapEntry<TKey,TValue>, equalFunctions?: EqualFunctions): SyncResult<boolean>
    {
        return Map.contains(this, value, equalFunctions);
    }

    public static contains<TKey,TValue>(map: Map<TKey,TValue>, value: MapEntry<TKey,TValue>, equalFunctions?: EqualFunctions): SyncResult<boolean>
    {
        return SyncResult.create(() =>
        {
            if (!equalFunctions)
            {
                equalFunctions = EqualFunctions.create();
            }

            return map.get(value.key)
                .then(entryValue => equalFunctions!.areEqual(entryValue, value.value).await())
                .catch(NotFoundError, () => false)
                .await();
        });
    }
}