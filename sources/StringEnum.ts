import { ConflictError } from "./ConflictError.js";
import { Iterable } from "./iterable.js";
import { JavascriptIterable } from "./javascript.js";
import { List } from "./list.js";
import { MutableMap } from "./mutableMap.js";
import { PreCondition } from "./preCondition.js";
import { escapeAndQuote } from "./strings.js";
import { SyncResult } from "./syncResult.js";

/**
 * A collection of enum values that can be fetched using string names and aliases.
 */
export class StringEnum<T>
{
    private readonly valueName: string;
    private readonly enumName: string;
    private readonly values: List<T>;
    private readonly nameToValueMap: MutableMap<string,T>;

    private constructor(enumName: string, valueName: string)
    {
        PreCondition.assertNotEmpty(enumName, "enumName");
        PreCondition.assertNotEmpty(valueName, "valueName");

        this.enumName = enumName;
        this.valueName = valueName;
        this.values = List.create();
        this.nameToValueMap = MutableMap.create();
    }

    /**
     * Create a new {@link StringEnum} collection.
     */
    public static create<T>(enumName: string, valueName: string): StringEnum<T>
    {
        return new StringEnum<T>(enumName, valueName);
    }

    /**
     * Get the unique key that will be used for the provided name or alias.
     * @param nameOrAlias The name or alias to get the key for.
     */
    private getKey(nameOrAlias: string): string
    {
        PreCondition.assertNotEmpty(nameOrAlias, "nameOrAlias");

        return nameOrAlias.toLowerCase();
    }

    /**
     * Add the provided value to this {@link StringEnum} collection.
     * @param value The value to add to this {@link StringEnum} collection.
     */
    public add(value: T, names: JavascriptIterable<string>): this
    {
        PreCondition.assertNotUndefinedAndNotNull(value, "value");

        for (const name of names)
        {
            const key: string = this.getKey(name);

            if (this.nameToValueMap.containsKey(key).await())
            {
                throw new ConflictError(`A ${this.valueName} with the name ${escapeAndQuote(name)} already exists in this ${this.enumName} collection.`);
            }
            this.nameToValueMap.set(key, value);
        }
        this.values.add(value);

        return this;
    }

    /**
     * Get the {@link StringEnumValue} that is associated with the provided text.
     * @param text The text to get the associated {@link StringEnumValue} for.
     */
    public parse(text: string): SyncResult<T>
    {
        PreCondition.assertNotEmpty(text, "text");

        const key: string = this.getKey(text);
        return this.nameToValueMap.get(key);
    }

    /**
     * Get the values that exist in this {@link StringEnum}.
     */
    public getValues(): Iterable<T>
    {
        return this.values;
    }
}