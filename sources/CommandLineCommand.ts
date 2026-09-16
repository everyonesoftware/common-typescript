import { AsyncResult } from "./asyncResult.js";
import { CharacterWriteStream } from "./characterWriteStream.js";
import { CommandLineParameter, CommandLineParameterDefaultValues as CommandLineParameterDefaultValue, CommandLineParameterOptions, CommandLineParameterParent } from "./commandLineParameter.js";
import { InMemoryCharacterWriteStream } from "./inMemoryCharacterWriteStream.js";
import { Iterable } from "./iterable.js";
import { JavascriptIterable } from "./javascript.js";
import { List } from "./list.js";
import { NotFoundError } from "./notFoundError.js";
import { PreCondition } from "./preCondition.js";
import { join } from "./strings.js";
import { StringTable } from "./StringTable.js";
import { asIterable, isString, isUndefinedNullOrEmpty, isUndefinedOrNull } from "./types.js";

/**
 * An object that contains {@link CommandLineCommand}s.
 */
export abstract class CommandLineCommandParent
{
    public abstract getFullName(): string;

    /**
     * Get whether any of the provided command name and aliases already exist in this
     * {@link CommandLineCommandParent}.
     * @param commandNameAndAliases The command name and aliases to check.
     */
    public abstract doCommandNameOrAliasesExist(commandNameAndAliases: JavascriptIterable<string>): boolean;

    /**
     * Get the command line arguments that have been provided.
     */
    public abstract getArguments(): Iterable<string> | undefined;

    /**
     * Get the {@link CharacterWriteStream} where the help message will be written to (if needed).
     */
    public abstract getWriteStream(): CharacterWriteStream;
}

export interface CommandLineCommandOptions
{
    /**
     * The name of the {@link CommandLineCommand}.
     */
    readonly name: string;
    /**
     * Aliases that can be used to refer to the {@link CommandLineCommand} without using its full
     * name.
     */
    readonly aliases?: JavascriptIterable<string>;
    /**
     * A description of the {@link CommandLineCommand}.
     */
    readonly description?: string;

    /**
     * The action that will be run when the {@link CommandLineCommand} is invoked.
     * @param command The created {@link CommandLineCommand}.
     */
    readonly action?: () => (void | number | Promise<void | number>);
}

export interface CommandLineCommandProperties extends CommandLineCommandOptions
{
    /**
     * The parent of the new {@link CommandLineCommand}. This object will be used to ensure that
     * each command's name and aliases are unique.
     */
    readonly parent?: CommandLineCommandParent;
    /**
     * The command line arguments that were passed to the application.
     */
    readonly arguments?: JavascriptIterable<string>;
    /**
     * The {@link CharacterWriteStream} where the help message will be written to (if needed).
     */
    readonly writeStream?: CharacterWriteStream;
}

export class CommandLineCommand implements CommandLineCommandParent, CommandLineParameterParent
{
    private readonly name: string;
    private readonly aliases: Iterable<string>;
    private readonly description?: string;
    private readonly parent?: CommandLineCommandParent;
    private readonly arguments?: Iterable<string>;
    private readonly writeStream?: CharacterWriteStream;
    private action?: () => (void | number | Promise<void | number>);

    private readonly subCommands: List<CommandLineCommand>;
    private readonly parameters: List<CommandLineParameter>;

    private constructor(properties: CommandLineCommandProperties)
    {
        PreCondition.assertNotUndefinedAndNotNull(properties, "properties");
        PreCondition.assertNotEmpty(properties.name, "name");
        PreCondition.assertFalse(properties.parent?.doCommandNameOrAliasesExist([properties.name, ...(properties.aliases ?? [])]) === true, "parent?.doAnyCommandNameOrAliasesExist([name, ...aliases]) === true");

        this.name = properties.name;
        this.aliases = asIterable(properties.aliases ?? []);
        this.description = properties.description;
        this.parent = properties.parent;
        this.writeStream = properties.writeStream;
        this.arguments = !isUndefinedOrNull(properties.arguments) ? asIterable(properties.arguments) : undefined;
        this.action = properties.action;

        this.subCommands = List.create();
        this.parameters = List.create();
        this.addParameter({
            name: "help",
            aliases: ["?"],
            description: "Show the command's help menu.",
            defaultValue: {
                notFound: "false",
                valueNotFound: "true",
            },
        });
    }

    public static create(properties: CommandLineCommandProperties): CommandLineCommand
    {
        return new CommandLineCommand(properties);
    }

    public doCommandNameOrAliasesExist(nameAndAliases: JavascriptIterable<string>): boolean
    {
        const lowerNameAndAliases: Iterable<string> = asIterable(nameAndAliases)
            .map(value => value.toLowerCase());
        const lowerSubCommandNamesAndAliases: Iterable<string> = (this.subCommands ?? Iterable.create())
            .flatMap(subCommand => subCommand.getNameAndAliases())
            .map(value => value.toLowerCase());

        return lowerNameAndAliases.containsAny(lowerSubCommandNamesAndAliases).await();
    }

    public doParameterNameOrAliasesExist(nameAndAliases: JavascriptIterable<string>): boolean
    {
        const lowerNameAndAliases: Iterable<string> = asIterable(nameAndAliases)
            .map(value => value.toLowerCase());
        const lowerParameterNamesAndAliases: Iterable<string> = (this.parameters ?? Iterable.create())
            .flatMap(parameter => parameter.getNameAndAliases())
            .map(value => value.toLowerCase());

        return lowerNameAndAliases.containsAny(lowerParameterNamesAndAliases).await();
    }

    public getName(): string
    {
        return this.name;
    }

    public getFullName(): string
    {
        const name: string = this.getName();
        return isUndefinedOrNull(this.parent) ? name : `${this.parent.getFullName()} ${name}`;
    }

    public getAliases(): Iterable<string>
    {
        return this.aliases;
    }

    public getNameAndAliases(): Iterable<string>
    {
        return CommandLineCommand.getNameAndAliases(this);
    }

    public static getNameAndAliases(command: CommandLineCommand): Iterable<string>
    {
        return Iterable.create<string>([command.getName(), ...command.getAliases()]);
    }

    public getDescription(): string
    {
        return this.description ?? "";
    }

    public addParameter(options: CommandLineParameterOptions): CommandLineParameter;
    public addParameter(name: string, aliases?: JavascriptIterable<string>, description?: string, defaultValue?: CommandLineParameterDefaultValue): CommandLineParameter;
    addParameter(optionsOrName: string | CommandLineParameterOptions, aliases?: JavascriptIterable<string>, description?: string, defaultValue?: CommandLineParameterDefaultValue): CommandLineParameter
    {
        if (isString(optionsOrName))
        {
            optionsOrName = {
                name: optionsOrName,
                aliases,
                description,
                defaultValue,
            };
        }
        const parameter: CommandLineParameter = CommandLineParameter.create({
            ...optionsOrName,
            parent: this,
        });
        // Leave the help parameter in the last spot.
        const parametersCount: number = this.parameters.getCount().await();
        this.parameters.insert(parametersCount === 0 ? 0 : parametersCount - 1, parameter);

        return parameter;
    }

    public getParameters(): Iterable<CommandLineParameter>
    {
        return this.parameters;
    }

    public addCommand(options: CommandLineCommandOptions): CommandLineCommand
    {
        const result: CommandLineCommand = CommandLineCommand.create({ ...options, parent: this });
        this.subCommands.add(result);

        return result;
    }

    public getCommands(): Iterable<CommandLineCommand>
    {
        return this.subCommands;
    }

    public getArguments(): Iterable<string>
    {
        return this.arguments ?? this.parent?.getArguments() ?? Iterable.create();
    }

    public getWriteStream(): CharacterWriteStream
    {
        return this.writeStream ?? this.parent?.getWriteStream() ?? InMemoryCharacterWriteStream.create();
    }

    public setAction(action: () => (void | number | Promise<void | number>)): this
    {
        PreCondition.assertUndefined(this.action, "this.action");
        PreCondition.assertNotUndefinedAndNotNull(action, "action");

        this.action = action;

        return this;
    }

    /**
     * If the help parameter's value is true, then write the command's help message to the provided
     * writeStream and return true. If the help parameter's value is false, then do nothing and
     * return false.
     */
    public showHelp(options?: { readonly force?: boolean }): AsyncResult<boolean>
    {
        return AsyncResult.create(async () =>
        {
            const args: Iterable<string> = this.getArguments();

            const parameters: Iterable<CommandLineParameter> = this.getParameters();
            const helpParameter: CommandLineParameter = parameters.last().await();

            const helpValue: boolean = helpParameter.getBooleanValue(args).await() || options?.force === true;
            if (helpValue)
            {
                const writeStream: CharacterWriteStream = this.getWriteStream();
                const topTable: StringTable = StringTable.create()

                let commandString: string = this.getFullName();
                const aliases: Iterable<string> = asIterable(this.getAliases());
                if (aliases.any().await())
                {
                    commandString += ` [${join(",", aliases)}]`;
                }
                topTable.addRow(["Command:", commandString]);

                const description: string = this.getDescription();
                if (!isUndefinedNullOrEmpty(description))
                {
                    topTable.addRow(["Description:", description]);
                }
                await topTable.writeTo(writeStream, { betweenColumns: " " });
                await writeStream.writeLine();

                if (parameters.any().await())
                {
                    await writeStream.writeLine();
                    await writeStream.writeLine("Parameters:");
                    const parameterTable: StringTable = StringTable.create();
                    for (const parameter of parameters)
                    {
                        parameterTable.addRow([
                            `--${parameter.getName()} [${join(",", asIterable(parameter.getAliases()).map(alias => `-${alias}`))}]:`,
                            parameter.getDescription(),
                        ]);
                    }
                    await parameterTable.writeTo(writeStream, { betweenColumns: " " });
                    await writeStream.writeLine();
                }

                const commands: Iterable<CommandLineCommand> = this.getCommands();
                if (commands.any().await())
                {
                    await writeStream.writeLine();
                    await writeStream.writeLine("Commands:");
                    const commandTable: StringTable = StringTable.create();
                    for (const command of commands)
                    {
                        commandTable.addRow([
                            `${command.getName()} [${join(",", command.getAliases())}]:`,
                            command.getDescription(),
                        ]);
                    }
                    await commandTable.writeTo(writeStream, { betweenColumns: " " });
                    await writeStream.writeLine();
                }
            }

            return helpValue;
        });
    }

    public run(): AsyncResult<void | number>
    {
        return AsyncResult.create(async () =>
        {
            let result: void | number = undefined;

            const args: Iterable<string> = this.getArguments();

            let matchingSubCommand: CommandLineCommand | undefined;
            if (args.any().await())
            {
                const firstArgument: string = args.first().await();
                matchingSubCommand = this.getCommands()
                    .first((subCommand: CommandLineCommand) => subCommand.getNameAndAliases().contains(firstArgument).await())
                    .catch(NotFoundError, () => undefined)
                    .await();
                if (matchingSubCommand !== undefined)
                {
                    result = await matchingSubCommand.run();
                }
            }

            if (matchingSubCommand === undefined)
            {
                if (await this.showHelp({ force: isUndefinedOrNull(this.action) }))
                {
                    result = -1;
                }
                else
                {
                    // We only get to this point if there is no --help argument and if there is a
                    // valid action.
                    result = await this.action!();
                }
            }

            return result;
        });
    }
}