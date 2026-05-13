import { EqualFunctions } from "./equalFunctions";
import { Iterable } from "./iterable";
import { Iterator } from "./iterator";
import { JavascriptIterable, JavascriptIterator } from "./javascript";
import { List } from "./list";
import { PreCondition } from "./preCondition";
import { StringIterator } from "./stringIterator";
import { join } from "./strings";
import { SyncResult } from "./syncResult";
import { ToStringFunctions } from "./toStringFunctions";
import { isString, Type } from "./types";

export class CharacterList implements List<string>
{
    private characters: string;

    private constructor(values?: JavascriptIterable<string> | string)
    {
        if (isString(values))
        {
            this.characters = values;
        }
        else if (values)
        {
            this.characters = join("", values);
        }
        else
        {
            this.characters = "";
        }
    }

    public static create(values?: JavascriptIterable<string>): CharacterList
    {
        return new CharacterList(values);
    }

    public getCount(): SyncResult<number>
    {
        return SyncResult.value(this.characters.length);
    }

    public insert(index: number, value: string): this
    {
        PreCondition.assertInsertIndex(index, this.getCount().await(), "index");
        PreCondition.assertCharacter(value, "value");

        if (index === 0)
        {
            this.characters = value + this.characters;
        }
        else if (index === this.getCount().await())
        {
            this.characters += value;
        }
        else
        {
            this.characters = this.characters.slice(0, index) + value + this.characters.slice(index);
        }

        return this;
    }

    public removeAt(index: number): SyncResult<string>
    {
        PreCondition.assertAccessIndex(index, this.getCount().await(), "index");

        const result: string = this.get(index).await();
        this.characters =
            (index === 0 ? "" : this.characters.slice(0, index)) +
            (index === this.getCount().await() - 1 ? "" : this.characters.slice(index + 1));

        return SyncResult.value(result);
    }

    public set(index: number, value: string): this
    {
        PreCondition.assertAccessIndex(index, this.getCount().await(), "index");
        PreCondition.assertCharacter(value, "value");

        this.characters =
            (index === 0 ? "" : this.characters.slice(0, index)) +
            value +
            (index === this.getCount().await() - 1 ? "" : this.characters.slice(index + 1));

        return this;
    }

    public iterate(): Iterator<string>
    {
        return StringIterator.create(this.characters);
    }

    public get(index: number): SyncResult<string>
    {
        PreCondition.assertAccessIndex(index, this.getCount().await(), "index");

        return SyncResult.value(this.characters.charAt(index));
    }

    public add(value: string): this
    {
        return List.add(this, value);
    }

    public addAll(values: JavascriptIterable<string>): this
    {
        return List.addAll(this, values);
    }

    public insertAll(index: number, values: JavascriptIterable<string>): this
    {
        return List.insertAll(this, index, values);
    }

    public remove(value: string, equalFunctions?: EqualFunctions): SyncResult<string>
    {
        return List.remove(this, value, equalFunctions);
    }

    public removeFirst(): SyncResult<string>
    {
        return List.removeFirst(this);
    }

    public removeLast(): SyncResult<string>
    {
        return List.removeLast(this);
    }

    public toArray(): SyncResult<string[]>
    {
        return List.toArray(this);
    }

    public any(): SyncResult<boolean>
    {
        return List.any(this);
    }

    public equals(right: JavascriptIterable<string>, equalFunctions?: EqualFunctions): SyncResult<boolean>
    {
        return List.equals(this, right, equalFunctions);
    }

    public toString(toStringFunctions?: ToStringFunctions): string
    {
        return List.toString(this, toStringFunctions);
    }

    public concatenate(...toConcatenate: JavascriptIterable<string>[]): Iterable<string>
    {
        return List.concatenate(this, ...toConcatenate);
    }

    public map<TOutput>(mapping: (value: string) => TOutput | SyncResult<TOutput>): Iterable<TOutput>
    {
        return List.map(this, mapping);
    }

    public flatMap<TOutput>(mapping: (value: string) => JavascriptIterable<TOutput>): Iterable<TOutput>
    {
        return List.flatMap(this, mapping);
    }

    public where(condition: (value: string) => (boolean | SyncResult<boolean>)): Iterable<string>
    {
        return List.where(this, condition);
    }

    public instanceOf<TOutput extends string>(typeOrTypeCheck: Type<TOutput> | ((value: string) => value is TOutput)): Iterable<TOutput>
    {
        return List.instanceOf(this, typeOrTypeCheck);
    }

    public first(condition?: (value: string) => (boolean | SyncResult<boolean>)): SyncResult<string>
    {
        return List.first(this, condition);
    }

    public last(condition?: (value: string) => (boolean | SyncResult<boolean>)): SyncResult<string>
    {
        return List.last(this, condition);
    }

    public contains(value: string, equalFunctions?: EqualFunctions): SyncResult<boolean>
    {
        return List.contains(this, value, equalFunctions);
    }

    public [Symbol.iterator](): JavascriptIterator<string>
    {
        return List[Symbol.iterator](this);
    }
}