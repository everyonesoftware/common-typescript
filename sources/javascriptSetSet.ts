import { EqualFunctions } from "./equalFunctions.js";
import { Iterable } from "./iterable.js";
import { Iterator } from "./iterator.js";
import { JavascriptIterable, JavascriptIterator, JavascriptSet } from "./javascript.js";
import { NotFoundError } from "./notFoundError.js";
import { Set } from "./set.js";
import { SyncResult } from "./syncResult.js";
import { ToStringFunctions } from "./toStringFunctions.js";
import { Type } from "./types.js";

export class JavascriptSetSet<T> implements Set<T>
{
    private readonly set: JavascriptSet<T>;

    private constructor()
    {
        this.set = new JavascriptSet<T>();
    }

    public static create<T>(initialValues?: JavascriptIterable<T>): JavascriptSetSet<T>
    {
        const result: JavascriptSetSet<T> = new JavascriptSetSet<T>();
        if (initialValues)
        {
            result.addAll(initialValues);
        }
        return result;
    }

    public add(value: T): this
    {
        this.set.add(value);

        return this;
    }

    public addAll(values: JavascriptIterable<T>): this
    {
        return Set.addAll(this, values);
    }

    public remove(value: T): SyncResult<void>
    {
        return SyncResult.create(() =>
        {
            if (!this.set.delete(value))
            {
                throw new NotFoundError(`Could not find ${JSON.stringify(value)}.`);
            }
        });
    }

    public union(values: JavascriptIterable<T>): Set<T>
    {
        return Set.union(this, values);
    }

    public iterate(): Iterator<T>
    {
        return Iterator.create(this.set);
    }

    public toArray(): SyncResult<T[]>
    {
        return Set.toArray(this);
    }

    public any(): SyncResult<boolean>
    {
        return Set.any(this);
    }

    public getCount(): SyncResult<number>
    {
        return SyncResult.value(this.set.size);
    }

    public equals(right: JavascriptIterable<T>, equalFunctions?: EqualFunctions): SyncResult<boolean>
    {
        return Set.equals(this, right, equalFunctions);
    }

    public toString(toStringFunctions?: ToStringFunctions): string
    {
        return Set.toString(this, toStringFunctions);
    }

    public concatenate(...toConcatenate: JavascriptIterable<T>[]): Iterable<T>
    {
        return Set.concatenate(this, ...toConcatenate);
    }

    public map<TOutput>(mapping: (value: T) => TOutput | SyncResult<TOutput>): Iterable<TOutput>
    {
        return Set.map(this, mapping);
    }

    public flatMap<TOutput>(mapping: (value: T) => JavascriptIterable<TOutput>): Iterable<TOutput>
    {
        return Set.flatMap(this, mapping);
    }

    public where(condition: (value: T) => (boolean | SyncResult<boolean>)): Iterable<T>
    {
        return Set.where(this, condition);
    }

    public instanceOf<TOutput extends T>(typeOrTypeCheck: Type<TOutput> | ((value: T) => value is TOutput)): Iterable<TOutput>
    {
        return Set.instanceOf(this, typeOrTypeCheck);
    }

    public first(condition?: ((value: T) => (boolean | SyncResult<boolean>)) | undefined): SyncResult<T>
    {
        return Set.first(this, condition);
    }

    public last(condition?: ((value: T) => (boolean | SyncResult<boolean>)) | undefined): SyncResult<T>
    {
        return Set.last(this, condition);
    }

    public contains(value: T, equalFunctions?: EqualFunctions): SyncResult<boolean>
    {
        return equalFunctions === undefined
            ? SyncResult.value(this.set.has(value))
            : Iterable.contains(this, value, equalFunctions);
    }

    public [Symbol.iterator](): JavascriptIterator<T>
    {
        return Set[Symbol.iterator](this);
    }
}