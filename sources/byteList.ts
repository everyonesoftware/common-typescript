import { EqualFunctions } from "./equalFunctions.js";
import { Iterable } from "./iterable.js";
import { Iterator } from "./iterator.js";
import { JavascriptIterable, JavascriptIterator } from "./javascript.js";
import { List } from "./list.js";
import { PreCondition } from "./preCondition.js";
import { SyncResult } from "./syncResult.js";
import { ToStringFunctions } from "./toStringFunctions.js";
import { Type } from "./types.js";

/**
 * A {@link List} of bytes.
 */
export class ByteList implements List<number>
{
    private bytes: Uint8Array;
    private count: number;

    private constructor()
    {
        this.bytes = new Uint8Array(0);
        this.count = 0;
    }

    public static create(initialValues?: JavascriptIterable<number>): ByteList
    {
        const result: ByteList = new ByteList();
        if (initialValues)
        {
            result.addAll(initialValues);
        }
        return result;
    }

    public add(value: number): this
    {
        return List.add(this, value);
    }

    public addAll(values: JavascriptIterable<number>): this
    {
        return List.addAll(this, values);
    }

    public insert(index: number, value: number): this
    {
        PreCondition.assertInsertIndex(index, this.getCount().await(), "index");
        PreCondition.assertByte(value, "value");

        if (this.count < this.bytes.length)
        {
            if (index < this.count)
            {
                this.bytes.copyWithin(index + 1, index, this.count);
            }
            this.bytes[index] = value;
        }
        else
        {
            const newCapacity: number = (this.bytes.length * 2) + 1;
            const newBytes: Uint8Array = new Uint8Array(newCapacity);
            if (index > 0)
            {
                newBytes.set(this.bytes.subarray(0, index));
            }
            newBytes[index] = value;
            if (index < this.count)
            {
                newBytes.set(this.bytes.subarray(index), index + 1);
            }
            this.bytes = newBytes;
        }
        this.count++;

        return this;
    }

    public insertAll(index: number, values: JavascriptIterable<number>): this
    {
        return List.insertAll(this, index, values);
    }

    public remove(value: number, equalFunctions?: EqualFunctions): SyncResult<number>
    {
        PreCondition.assertByte(value, "value");

        return List.remove(this, value, equalFunctions);
    }

    public removeAt(index: number): SyncResult<number>
    {
        PreCondition.assertAccessIndex(index, this.count, "index");

        const result: number = this.bytes[index];
        this.bytes.copyWithin(index, index + 1, this.count);
        this.count--;

        return SyncResult.value(result);
    }

    public removeFirst(): SyncResult<number>
    {
        return List.removeFirst(this);
    }

    public removeLast(): SyncResult<number>
    {
        return List.removeLast(this);
    }

    public set(index: number, value: number): this
    {
        PreCondition.assertAccessIndex(index, this.getCount().await(), "index");
        PreCondition.assertByte(value, "value");

        this.bytes[index] = value;

        return this;
    }

    public iterate(): Iterator<number>
    {
        return Iterator.create(this.bytes[Symbol.iterator]().take(this.count));
    }

    public get(index: number): SyncResult<number>
    {
        PreCondition.assertAccessIndex(index, this.getCount().await(), "index");

        return SyncResult.value(this.bytes.at(index)!);
    }

    public toArray(): SyncResult<number[]>
    {
        return List.toArray(this);
    }

    public any(): SyncResult<boolean>
    {
        return this.getCount().then(count => count > 0);
    }

    public getCount(): SyncResult<number>
    {
        return SyncResult.value(this.count);
    }

    public equals(right: JavascriptIterable<number>, equalFunctions?: EqualFunctions): SyncResult<boolean>
    {
        return List.equals(this, right, equalFunctions);
    }

    public toString(toStringFunctions?: ToStringFunctions): string
    {
        return List.toString(this, toStringFunctions);
    }

    public concatenate(...toConcatenate: JavascriptIterable<number>[]): Iterable<number>
    {
        return List.concatenate(this, ...toConcatenate);
    }

    public map<TOutput>(mapping: (value: number) => TOutput | SyncResult<TOutput>): Iterable<TOutput>
    {
        return List.map(this, mapping);
    }

    public flatMap<TOutput>(mapping: (value: number) => JavascriptIterable<TOutput>): Iterable<TOutput>
    {
        return List.flatMap(this, mapping);
    }

    public where(condition: (value: number) => (boolean | SyncResult<boolean>)): Iterable<number>
    {
        return List.where(this, condition);
    }

    public instanceOf<TOutput extends number>(typeOrTypeCheck: Type<TOutput> | ((value: number) => value is TOutput)): Iterable<TOutput>
    {
        return List.instanceOf(this, typeOrTypeCheck);
    }

    public first(condition?: ((value: number) => (boolean | SyncResult<boolean>)) | undefined): SyncResult<number>
    {
        return List.first(this, condition);
    }

    public last(condition?: ((value: number) => (boolean | SyncResult<boolean>)) | undefined): SyncResult<number>
    {
        return List.last(this, condition);
    }

    public contains(value: number, equalFunctions?: EqualFunctions): SyncResult<boolean>
    {
        return List.contains(this, value, equalFunctions);
    }

    public [Symbol.iterator](): JavascriptIterator<number>
    {
        return List[Symbol.iterator](this);
    }
}