import { CommandLineParameter } from "./commandLineParameter.js";
import { orList } from "./english.js";
import { Iterable } from "./iterable.js";
import { JavascriptIterable } from "./javascript.js";
import { List } from "./list.js";
import { NotFoundError } from "./notFoundError.js";
import { PreCondition } from "./preCondition.js";
import { SyncResult } from "./syncResult.js";
import { ToStringFunctions } from "./toStringFunctions.js";
import { isIterable, isString } from "./types.js";

/**
 * A class that can be used to define and interact with an application's command line interface.
 */
export class CommandLineParameters
{
    private readonly args: Iterable<string>;
    private readonly parameters: List<CommandLineParameter>;

    private constructor(argv: JavascriptIterable<string>)
    {
        PreCondition.assertNotUndefinedAndNotNull(argv, "argv");

        this.args = isIterable<string>(argv) ? argv : Iterable.create(argv);
        this.parameters = List.create();
    }

    public static create(args: JavascriptIterable<string>): CommandLineParameters
    {
        return new CommandLineParameters(args)
    }

    public static getArgumentName(arg: string): string | undefined
    {
        return arg[0] === "-"
            ? arg.substring(arg[1] === "-" ? 2 : 1)
            : undefined;
    }

    public getArguments(): Iterable<string>
    {
        return this.args;
    }

    /**
     * Get the value of the first argument that matches one of the provided names. 
     * @param names The possible names to look for.
     */
    public getNamedArgumentStringValue(nameOrNames: string | JavascriptIterable<string>): SyncResult<string>
    {
        PreCondition.assertNotEmpty(nameOrNames, "nameOrNames");

        return SyncResult.create(() =>
        {
            let foundArgName: boolean = false;
            let result: string | undefined;

            if (isString(nameOrNames))
            {
                nameOrNames = [nameOrNames];
            }
            const searchNames: Iterable<string> = Iterable.create(nameOrNames);
            for (const arg of this.args)
            {
                if (!foundArgName)
                {
                    const argName: string | undefined = CommandLineParameters.getArgumentName(arg);
                    foundArgName = !!(argName && searchNames.contains(argName));
                }
                else
                {
                    result = arg;
                    break;
                }
            }

            if (result === undefined)
            {
                const toStringFunctions: ToStringFunctions = ToStringFunctions.create();
                throw new NotFoundError(`No argument found that matches ${orList(searchNames.map(n => toStringFunctions.toString(n)))}.`);
            }

            return result;
        });
    }

    public nameOrAliasExists(nameOrAlias: string)
    {
        PreCondition.assertNotEmpty(nameOrAlias, "nameOrAlias");

        let result: boolean = false;
        for (const parameter of this.parameters)
        {
            if (parameter.getNameAndAliases().contains(nameOrAlias).await())
            {
                result = true;
                break;
            }
        }
        return result;
    }

    public add(name: string): CommandLineParameter
    {
        const result: CommandLineParameter = CommandLineParameter.create({
            owner: this,
            name,
        });
        this.parameters.add(result);

        return result;
    }
}