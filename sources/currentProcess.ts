import { CharacterWriteStream } from "./characterWriteStream.js";
import { Clock } from "./Clock.js";
import { DynamicProperty } from "./DynamicProperty.js";
import { FileSystem } from "./FileSystem.js";
import { Folder } from "./Folder.js";
import { Iterable } from "./iterable.js";
import { JavascriptIterable } from "./javascript.js";
import { Network } from "./network.js";
import { NodeJSCharacterWriteStream } from "./nodeJSCharacterWriteStream.js";
import { NodeJSFileSystem } from "./NodeJSFileSystem.js";
import { Path } from "./Path.js";
import { PreCondition } from "./preCondition.js";
import { ProcessRunner } from "./ProcessRunner.js";
import { Property } from "./property.js";
import { RealClock } from "./RealClock.js";
import { RealNetwork } from "./realNetwork.js";
import { RealProcessRunner } from "./RealProcessRunner.js";
import { isIterable, isNumber, isUndefinedOrNull, toUndefinedNullOrDefinedString } from "./types.js";

/**
 * An object that provides all of the resources that are available to the current process.
 */
export class CurrentProcess
{
    private args: Iterable<string> | undefined;
    private outputWriteStream: CharacterWriteStream | undefined;
    private exitCodeProperty: Property<number> | undefined;
    private network: Network | undefined;
    private clock: Clock | undefined;
    private fileSystem: FileSystem | undefined;
    private currentFolderString: string | undefined;
    private processRunner: ProcessRunner | undefined;

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
        PreCondition.assertUndefined(this.args, "this.args");

        this.args = isIterable<string>(args) ? args : Iterable.create(args);
        return this;
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
        PreCondition.assertUndefined(this.outputWriteStream, "this.outputWriteStream", { toStringFunction: toUndefinedNullOrDefinedString });

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

    public getClock(): Clock
    {
        if (this.clock === undefined)
        {
            this.clock = RealClock.create();
        }
        return this.clock;
    }

    public setClock(clock: Clock): this
    {
        PreCondition.assertUndefined(this.clock, "this.clock");
        PreCondition.assertNotUndefinedAndNotNull(clock, "clock");

        this.clock = clock;

        return this;
    }

    public getFileSystem(): FileSystem
    {
        if (isUndefinedOrNull(this.fileSystem))
        {
            this.fileSystem = NodeJSFileSystem.create();
        }
        return this.fileSystem;
    }

    public setFileSystem(fileSystem: FileSystem): this
    {
        PreCondition.assertUndefined(this.fileSystem, "this.fileSystem", { toStringFunction: toUndefinedNullOrDefinedString });
        PreCondition.assertNotUndefinedAndNotNull(fileSystem, "fileSystem");

        this.fileSystem = fileSystem;

        return this;
    }

    public getCurrentFolderString(): string
    {
        if (isUndefinedOrNull(this.currentFolderString))
        {
            this.currentFolderString = process.cwd();
        }
        return this.currentFolderString;
    }

    public setCurrentFolderString(currentFolderString: string): CurrentProcess
    {
        PreCondition.assertUndefined(this.currentFolderString, "this.currentFolderString");
        PreCondition.assertNotEmpty(currentFolderString, "currentFolderString");

        this.currentFolderString = currentFolderString;

        return this;
    }

    public getCurrentFolderPath(): Path
    {
        return Path.parse(this.getCurrentFolderString()).await();
    }

    public getCurrentFolder(): Folder
    {
        const path: Path = this.getCurrentFolderPath();
        const fileSystem: FileSystem = this.getFileSystem();
        return fileSystem.getFolder(path).await();
    }

    public getProcessRunner(): ProcessRunner
    {
        if (isUndefinedOrNull(this.processRunner))
        {
            this.processRunner = RealProcessRunner.create();
        }
        return this.processRunner;
    }

    public setProcessRunner(processRunner: ProcessRunner): this
    {
        PreCondition.assertNotUndefinedAndNotNull(processRunner, "processRunner");
        PreCondition.assertUndefined(this.processRunner, "this.processRunner", { toStringFunction: toUndefinedNullOrDefinedString });

        this.processRunner = processRunner;

        return this;
    }
}