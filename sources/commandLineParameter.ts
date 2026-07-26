import { CommandLineParameters } from "./commandLineParameters.js";
import { Iterable } from "./iterable.js";
import { JavascriptIterable } from "./javascript.js";
import { List } from "./list.js";
import { PreCondition } from "./preCondition.js";

/**
 * An individual parameter from a {@link CommandLineParameters} object.
 */
export class CommandLineParameter
{
    private readonly owner: CommandLineParameters;
    private readonly name: string;
    private aliases: List<string> | undefined;
    private description: string | undefined;

    private constructor(owner: CommandLineParameters, name: string)
    {
        PreCondition.assertNotUndefinedAndNotNull(owner, "owner");
        PreCondition.assertNotEmpty(name, "name");
        PreCondition.assertFalse(owner.nameOrAliasExists(name), "owner.nameOrAliasExists(name)");

        this.owner = owner;
        this.name = name;
    }

    public static create(owner: CommandLineParameters, name: string): CommandLineParameter;
    public static create(properties: { owner: CommandLineParameters, name: string }): CommandLineParameter;
    static create(ownerOrProperties: CommandLineParameters | { owner: CommandLineParameters, name: string }, name?: string): CommandLineParameter
    {
        let owner: CommandLineParameters;
        if (ownerOrProperties instanceof CommandLineParameters)
        {
            owner = ownerOrProperties;
            name = name!;
        }
        else
        {
            owner = ownerOrProperties.owner;
            name = ownerOrProperties.name;
        }

        return new CommandLineParameter(owner, name);
    }

    /**
     * Get the name of this {@link CommandLineParameter}.
     */
    public getName(): string
    {
        return this.name;
    }

    public getAliases(): Iterable<string>
    {
        return this.aliases ?? Iterable.create();
    }

    private nameOrAliasExists(nameOrAlias: string): boolean
    {
        return this.owner.nameOrAliasExists(nameOrAlias);
    }

    public addAlias(alias: string): this
    {
        PreCondition.assertNotEmpty(alias, "alias");
        PreCondition.assertFalse(this.nameOrAliasExists(alias), "this.nameOrAliasExists(alias)");

        if (this.aliases === undefined)
        {
            this.aliases = List.create();
        }
        this.aliases.add(alias);

        return this;
    }

    public addAliases(aliases: JavascriptIterable<string>): this
    {
        for (const alias of aliases)
        {
            this.addAlias(alias);
        }
        return this;
    }

    public getNameAndAliases(): Iterable<string>
    {
        return List.create<string>()
            .add(this.getName())
            .addAll(this.getAliases());
    }

    public getDescription(): string
    {
        return this.description ?? "";
    }

    public setDescription(description: string): this
    {
        PreCondition.assertNotUndefinedAndNotNull(description, "description");

        this.description = description;

        return this;
    }
}