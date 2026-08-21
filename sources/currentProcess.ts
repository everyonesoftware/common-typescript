import { CharacterWriteStream } from "./characterWriteStream.js";
import { CommandLineParameters } from "./commandLineParameters.js";
import { DynamicProperty } from "./DynamicProperty.js";
import { Iterable } from "./iterable.js";
import { JavascriptIterable } from "./javascript.js";
import { Network } from "./network.js";
import { NodeJSCharacterWriteStream } from "./nodeJSCharacterWriteStream.js";
import { PreCondition } from "./preCondition.js";
import { Property } from "./property.js";
import { RealNetwork } from "./realNetwork.js";
import { isIterable, isNumber, isUndefinedOrNull } from "./types.js";

/**
 * An object that provides all of the resources that are available to the current process.
 */
export class CurrentProcess
{
    private args: Iterable<string> | undefined
    private parameters: CommandLineParameters | undefined;
    private outputWriteStream: CharacterWriteStream | undefined;
    private exitCodeProperty: Property<number> | undefined;
    private network: Network | undefined;

    private constructor()
    {
    }

    public static create(): CurrentProcess
    {
        return new CurrentProcess();
    }

    public static async run(action: (currentProcess: CurrentProcess) => (void | number | Promise<void | number>)): Promise<void>
    {
        PreCondition.assertNotUndefinedAndNotNull(action, "action");

        const currentProcess: CurrentProcess = CurrentProcess.create();
        const exitCode: Property<number> = currentProcess.exitCode();
        try
        {
            const result: void | number = await action(currentProcess);
            if (isNumber(result))
            {
                exitCode.set(result);
            }
        }
        catch (error)
        {
            exitCode.set(-1);

            const writeStream: CharacterWriteStream = currentProcess.getOutputWriteStream();
            if (error instanceof Error && error.stack)
            {
                writeStream.writeLine(error.stack);
            }
            else
            {
                writeStream.writeLine(`${error}`);
            }
        }
    }

    public getArguments(): Iterable<string>
    {
        if (!this.args)
        {
            this.args = Iterable.create(process.argv);
        }
        return this.args;
    }

    public setArguments(args: JavascriptIterable<string>): this
    {
        PreCondition.assertNotUndefinedAndNotNull(args, "args");
        PreCondition.assertUndefined(this.parameters, "this.parameters");

        this.args = isIterable<string>(args) ? args : Iterable.create(args);
        return this;
    }

    public getParameters(): CommandLineParameters
    {
        if (!this.parameters)
        {
            this.parameters = CommandLineParameters.create(this.getArguments());
        }
        return this.parameters;
    }

    public getOutputWriteStream(): CharacterWriteStream
    {
        if (!this.outputWriteStream)
        {
            this.outputWriteStream = NodeJSCharacterWriteStream.create(process.stdout);
        }
        return this.outputWriteStream;
    }

    public setOutputWriteStream(outputWriteStream: CharacterWriteStream): this
    {
        PreCondition.assertNotUndefinedAndNotNull(outputWriteStream, "outputWriteStream");

        this.outputWriteStream = outputWriteStream;

        return this;
    }

    /**
     * Get the exit code {@link Property} for this {@link CurrentProcess}.
     */
    public exitCode(): Property<number>
    {
        if (isUndefinedOrNull(this.exitCodeProperty))
        {
            this.exitCodeProperty = DynamicProperty.create({
                getter: () => process.exitCode as number,
                setter: (value: number) => { process.exitCode = value; },
            });
        }
        return this.exitCodeProperty;
    }

    public getNetwork(): Network
    {
        if (!this.network)
        {
            this.network = RealNetwork.create();
        }
        return this.network;
    }

    public setNetwork(network: Network): this
    {
        PreCondition.assertUndefined(this.network, "this.network");
        PreCondition.assertNotUndefinedAndNotNull(network, "network");

        this.network = network;

        return this;

    }
}