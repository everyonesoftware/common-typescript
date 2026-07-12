import { EqualFunctions } from "./equalFunctions.js";
import { Iterable } from "./iterable.js";
import { Iterator } from "./iterator.js";
import { JavascriptIterable, JavascriptIterator, JavascriptMap } from "./javascript.js";
import { MapEntry } from "./map.js";
import { MutableMap } from "./mutableMap.js";
import { NotFoundError } from "./notFoundError.js";
import { SyncResult } from "./syncResult.js";
import { ToStringFunctions } from "./toStringFunctions.js";
import { Type } from "./types.js";

export class JavascriptMapMap<TKey,TValue> implements MutableMap<TKey,TValue>
{
    private readonly javascriptMap: JavascriptMap<TKey,TValue>;

    private constructor()
    {
        this.javascriptMap = new JavascriptMap();
    }

    public static create<TKey,TValue>(): JavascriptMapMap<TKey,TValue>
    {
        return new JavascriptMapMap<TKey,TValue>();
    }

    public any(): SyncResult<boolean>
    {
        return SyncResult.value(this.javascriptMap.size > 0);
    }

    public getCount(): SyncResult<number>
    {
        return SyncResult.value(this.javascriptMap.size);
    }

    public containsKey(key: TKey): SyncResult<boolean>
    {
        return SyncResult.value(this.javascriptMap.has(key));
    }

    public get(key: TKey): SyncResult<TValue>
    {
        return this.containsKey(key).await()
            ? SyncResult.value(this.javascriptMap.get(key)!)
            : SyncResult.error(new NotFoundError(`The key ${JSON.stringify(key)} was not found in the map.`));
    }

    public set(key: TKey, value: TValue): this
    {
        this.javascriptMap.set(key, value);

        return this;
    }

    public remove(key: TKey): SyncResult<TValue>
    {
        const value: TValue | undefined = this.javascriptMap.get(key);
        return this.javascriptMap.delete(key)
            ? SyncResult.value(value!)
            : SyncResult.error(new NotFoundError(`The key ${JSON.stringify(key)} was not found in the map.`));
    }

    public iterate(): Iterator<MapEntry<TKey,TValue>>
    {
        return Iterator.create(this.javascriptMap.entries())
            .map((entry: [TKey,TValue]) => { return {key: entry[0], value: entry[1]}; });
    }

    public iterateKeys(): Iterator<TKey>
    {
        return Iterator.create(this.javascriptMap.keys());
    }

    public iterateValues(): Iterator<TValue>
    {
        return Iterator.create(this.javascriptMap.values());
    }

    public toArray(): SyncResult<MapEntry<TKey, TValue>[]>
    {
        return MutableMap.toArray(this);
    }

    public equals(right: Iterable<MapEntry<TKey, TValue>>, equalFunctions?: EqualFunctions): SyncResult<boolean>
    {
        return MutableMap.equals(this, right, equalFunctions);
    }

    public toString(toStringFunctions?: ToStringFunctions): string
    {
        return MutableMap.toString(this, toStringFunctions);
    }

    public concatenate(...toConcatenate: JavascriptIterable<MapEntry<TKey, TValue>>[]): Iterable<MapEntry<TKey, TValue>>
    {
        return MutableMap.concatenate(this, ...toConcatenate);
    }

    public map<TOutput>(mapping: (value: MapEntry<TKey, TValue>) => (TOutput | SyncResult<TOutput>)): Iterable<TOutput>
    {
        return MutableMap.map(this, mapping);
    }

    public flatMap<TOutput>(mapping: (value: MapEntry<TKey, TValue>) => JavascriptIterable<TOutput>): Iterable<TOutput>
    {
        return MutableMap.flatMap(this, mapping);
    }

    public where(condition: (value: MapEntry<TKey, TValue>) => (boolean | SyncResult<boolean>)): Iterable<MapEntry<TKey, TValue>>
    {
        return MutableMap.where(this, condition);
    }

    public instanceOf<T extends MapEntry<TKey, TValue>>(typeOrTypeCheck: Type<T> | ((value: MapEntry<TKey, TValue>) => value is T)): Iterable<T>
    {
        return MutableMap.instanceOf(this, typeOrTypeCheck);
    }

    public first(condition?: ((entry: MapEntry<TKey, TValue>) => (boolean | SyncResult<boolean>)) | undefined): SyncResult<MapEntry<TKey, TValue>>
    {
        return MutableMap.first(this, condition);
    }

    public last(condition?: ((entry: MapEntry<TKey, TValue>) => (boolean | SyncResult<boolean>)) | undefined): SyncResult<MapEntry<TKey, TValue>>
    {
        return MutableMap.last(this, condition);
    }

    public getOrSet(key: TKey, valueCreator: () => TValue | SyncResult<TValue>): SyncResult<TValue>
    {
        return MutableMap.getOrSet(this, key, valueCreator);
    }

    public [Symbol.iterator](): JavascriptIterator<MapEntry<TKey, TValue>>
    {
        return MutableMap[Symbol.iterator](this);
    }

    public contains(value: MapEntry<TKey, TValue>, equalFunctions?: EqualFunctions): SyncResult<boolean>
    {
        return MutableMap.contains(this, value, equalFunctions);
    }
}