import { EqualFunctions } from "./equalFunctions.js";
import { Iterable } from "./iterable.js";
import { Iterator } from "./iterator.js";
import { JavascriptIterable, JavascriptIterator } from "./javascript.js";
import { JavascriptMapMap } from "./javascriptMapMap.js";
import { NotFoundError } from "./notFoundError.js";
import { PreCondition } from "./preCondition.js";
import { SyncResult } from "./syncResult.js";
import { ToStringFunctions } from "./toStringFunctions.js";
import { hasFunction, Type } from "./types.js";
import { isMap, Map, MapEntry } from "./map.js";

/**
 * Get whether the provided value is {@link Map}.
 * @param value The value to check.
 */
export function isMutableMap(value: unknown): value is MutableMap<unknown, unknown>
{
    return value instanceof MutableMap ||
        (
            isMap(value) && 
            hasFunction(value, "set", { parameterCount: 2 }) &&
            hasFunction(value, "getOrSet", { parameterCount: 2 })
        );
}

/**
 * A type that maps {@link TKey} values to {@link TValue} values.
 */
export abstract class MutableMap<TKey, TValue> implements Map<TKey, TValue>
{
    /**
     * Create a new instance of the default {@link Map} implementation.
     */
    public static create<TKey, TValue>(): MutableMap<TKey, TValue>
    {
        return JavascriptMapMap.create();
    }

    /**
     * Iterate over the entries in this {@link MutableMap}.
     */
    public abstract iterate(): Iterator<MapEntry<TKey, TValue>>;

    public any(): SyncResult<boolean>
    {
        return MutableMap.any(this);
    }

    public static any<TKey,TValue>(map: MutableMap<TKey,TValue>): SyncResult<boolean>
    {
        return Map.any(map);
    }

    public toArray(): SyncResult<MapEntry<TKey, TValue>[]>
    {
        return MutableMap.toArray(this);
    }

    public static toArray<TKey,TValue>(map: MutableMap<TKey,TValue>): SyncResult<MapEntry<TKey,TValue>[]>
    {
        return Map.toArray(map);
    }

    public equals(right: Iterable<MapEntry<TKey, TValue>>, equalFunctions?: EqualFunctions): SyncResult<boolean>
    {
        return MutableMap.equals(this, right, equalFunctions);
    }

    public static equals<TKey, TValue>(left: MutableMap<TKey, TValue>, right: Iterable<MapEntry<TKey, TValue>>, equalFunctions?: EqualFunctions): SyncResult<boolean>
    {
        return Map.equals(left, right, equalFunctions);
    }

    /**
     * Get the {@link String} representation of this {@link MutableMap}.
     */
    public toString(toStringFunctions?: ToStringFunctions): string
    {
        return MutableMap.toString(this, toStringFunctions);
    }

    /**
     * Get the {@link String} representation of the provided {@link MutableMap}.
     */
    public static toString<TKey, TValue>(map: MutableMap<TKey, TValue>, toStringFunctions?: ToStringFunctions): string
    {
        return Map.toString(map, toStringFunctions);
    }

    public concatenate(...toConcatenate: JavascriptIterable<MapEntry<TKey, TValue>>[]): Iterable<MapEntry<TKey, TValue>>
    {
        return MutableMap.concatenate(this, ...toConcatenate);
    }

    public static concatenate<TKey,TValue>(map: MutableMap<TKey,TValue>, ...toConcatenate: JavascriptIterable<MapEntry<TKey, TValue>>[]): Iterable<MapEntry<TKey, TValue>>
    {
        return Map.concatenate(map, ...toConcatenate);
    }

    public map<TOutput>(mapping: (value: MapEntry<TKey, TValue>) => (TOutput | SyncResult<TOutput>)): Iterable<TOutput>
    {
        return MutableMap.map(this, mapping);
    }

    public static map<TKey,TValue,TOutput>(map: MutableMap<TKey,TValue>, mapping: (value: MapEntry<TKey,TValue>) => (TOutput | SyncResult<TOutput>)): Iterable<TOutput>
    {
        return Map.map(map, mapping);
    }

    public flatMap<TOutput>(mapping: (value: MapEntry<TKey, TValue>) => JavascriptIterable<TOutput>): Iterable<TOutput>
    {
        return MutableMap.flatMap(this, mapping);
    }

    public static flatMap<TKey,TValue,TOutput>(map: MutableMap<TKey,TValue>, mapping: (value: MapEntry<TKey,TValue>) => JavascriptIterable<TOutput>): Iterable<TOutput>
    {
        return Map.flatMap(map, mapping);
    }

    public where(condition: (value: MapEntry<TKey, TValue>) => (boolean | SyncResult<boolean>)): Iterable<MapEntry<TKey, TValue>>
    {
        return MutableMap.where(this, condition);
    }

    public static where<TKey,TValue>(map: MutableMap<TKey,TValue>, condition: (value: MapEntry<TKey,TValue>) => (boolean | SyncResult<boolean>)): Iterable<MapEntry<TKey,TValue>>
    {
        return Map.where(map, condition);
    }

    public instanceOf<T extends MapEntry<TKey, TValue>>(typeOrTypeCheck: Type<T> | ((value: MapEntry<TKey, TValue>) => value is T)): Iterable<T>
    {
        return MutableMap.instanceOf(this, typeOrTypeCheck);
    }

    public static instanceOf<TKey,TValue,T extends MapEntry<TKey, TValue>>(map: MutableMap<TKey,TValue>, typeOrTypeCheck: Type<T> | ((value: MapEntry<TKey, TValue>) => value is T)): Iterable<T>
    {
        return Map.instanceOf(map, typeOrTypeCheck);
    }

    public [Symbol.iterator](): JavascriptIterator<MapEntry<TKey, TValue>>
    {
        return MutableMap[Symbol.iterator](this);
    }

    public static [Symbol.iterator]<TKey,TValue>(map: MutableMap<TKey,TValue>): JavascriptIterator<MapEntry<TKey,TValue>>
    {
        return Map[Symbol.iterator](map);
    }

    /**
     * Get the number of entries in this {@link MutableMap}.
     */
    public getCount(): SyncResult<number>
    {
        return MutableMap.getCount(this);
    }

    public static getCount<TKey,TValue>(map: MutableMap<TKey,TValue>): SyncResult<number>
    {
        return Map.getCount(map);
    }

    public first(condition?: (entry: MapEntry<TKey,TValue>) => (boolean | SyncResult<boolean>)): SyncResult<MapEntry<TKey, TValue>>
    {
        return MutableMap.first(this, condition);
    }

    public static first<TKey,TValue>(map: MutableMap<TKey,TValue>, condition?: (entry: MapEntry<TKey,TValue>) => (boolean | SyncResult<boolean>)): SyncResult<MapEntry<TKey, TValue>>
    {
        return Map.first(map, condition);
    }

    public last(condition?: (entry: MapEntry<TKey,TValue>) => (boolean | SyncResult<boolean>)): SyncResult<MapEntry<TKey, TValue>>
    {
        return MutableMap.last(this, condition);
    }

    public static last<TKey,TValue>(map: MutableMap<TKey,TValue>, condition?: (entry: MapEntry<TKey,TValue>) => (boolean | SyncResult<boolean>)): SyncResult<MapEntry<TKey, TValue>>
    {
        return Map.last(map, condition);
    }

    /**
     * Get whether this {@link MutableMap} contains the provided key.
     * @param key The key to look for.
     */
    public abstract containsKey(key: TKey): SyncResult<boolean>;

    /**
     * Get the value associated with the provided key.
     * @param key The key of the value to get.
     */
    public abstract get(key: TKey): SyncResult<TValue>;

    /**
     * Set the key/value association in this {@link MutableMap}.
     * @param key The key associated with the value.
     * @param value The value associated with the key.
     */
    public abstract set(key: TKey, value: TValue): this;

    /**
     * Get the {@link TValue} associated with the provided {@link TKey}. If the provided
     * {@link TKey} doesn't exist in this {@link MutableMap}, then invoke the provided {@link valueCreator}
     * and associate the returned {@link TValue} with the provided {@link TKey}. Then return the new
     * {@link TValue}.
     * @param key The {@link TKey} of the {@link TValue} to get.
     * @param valueCreator The {@link Function} that will be invoked if the {@link TKey} doesn't
     * exist in this {@link MutableMap}.
     */
    public getOrSet(key: TKey, valueCreator: () => (TValue | SyncResult<TValue>)): SyncResult<TValue>
    {
        return MutableMap.getOrSet(this, key, valueCreator);
    }

    /**
     * Get the {@link TValue} associated with the provided {@link TKey}. If the provided
     * {@link TKey} doesn't exist in the {@link MutableMap}, then invoke the provided {@link valueCreator}
     * and associate the returned {@link TValue} with the provided {@link TKey}. Then return the new
     * {@link TValue}.
     * @param key The {@link TKey} of the {@link TValue} to get.
     * @param valueCreator The {@link Function} that will be invoked if the {@link TKey} doesn't
     * exist in this {@link MutableMap}.
     */
    public static getOrSet<TKey, TValue>(map: MutableMap<TKey, TValue>, key: TKey, valueCreator: () => (TValue | SyncResult<TValue>)): SyncResult<TValue>
    {
        PreCondition.assertNotUndefinedAndNotNull(map, "map");
        PreCondition.assertNotUndefinedAndNotNull(valueCreator, "valueCreator");

        return map.get(key)
            .catch(NotFoundError, () =>
            {
                const creatorResult: TValue | SyncResult<TValue> = valueCreator();
                const value: TValue = creatorResult instanceof SyncResult ? creatorResult.await() : creatorResult;
                map.set(key, value);
                return value;
            });
    }

    /**
     * Remove the provided {@link TKey} from this {@link MutableMap}. If the {@link TKey} doesn't exist in
     * this {@link MutableMap}, then return a {@link NotFoundError}. If the {@link TKey} does exist, then
     * return the {@link TValue} that was associated with it.
     * @param key The {@link TKey} to remove from this {@link MutableMap}.
     */
    public abstract remove(key: TKey): SyncResult<TValue>;

    /**
     * Iterate over the keys in this {@link MutableMap}.
     */
    public iterateKeys(): Iterator<TKey>
    {
        return MutableMap.iterateKeys(this);
    }

    /**
     * Iterate over the keys in the {@link MutableMap}.
     * @param map The map to iterate over.
     */
    public static iterateKeys<TKey, TValue>(map: MutableMap<TKey, TValue>): Iterator<TKey>
    {
        return Map.iterateKeys(map);
    }

    /**
     * Iterate over the values in this {@link MutableMap}.
     */
    public iterateValues(): Iterator<TValue>
    {
        return MutableMap.iterateValues(this);
    }

    /**
     * Iterate over the keys in the {@link MutableMap}.
     * @param map The map to iterate over.
     */
    public static iterateValues<TKey, TValue>(map: MutableMap<TKey, TValue>): Iterator<TValue>
    {
        return Map.iterateValues(map);
    }

    public contains(value: MapEntry<TKey,TValue>, equalFunctions?: EqualFunctions): SyncResult<boolean>
    {
        return MutableMap.contains(this, value, equalFunctions);
    }

    public static contains<TKey,TValue>(map: MutableMap<TKey,TValue>, value: MapEntry<TKey,TValue>, equalFunctions?: EqualFunctions): SyncResult<boolean>
    {
        return Map.contains(map, value, equalFunctions);
    }
}