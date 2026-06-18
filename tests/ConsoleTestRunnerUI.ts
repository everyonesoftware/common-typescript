import { AsyncResult, CharacterWriteStream, IndentedCharacterWriteStream, List, ListStack, PreCondition, Stack } from "../sources";
import { TestAction } from "./testAction";
import { TestSkip } from "./testSkip";

export abstract class ConsoleTestRunnerUI
{
    private writeStream: CharacterWriteStream | undefined;

    public static flat(): FlatConsoleTestRunnerUI
    {
        return FlatConsoleTestRunnerUI.create();
    }

    public static tree(): TreeConsoleTestRunnerUI
    {
        return TreeConsoleTestRunnerUI.create();
    }

    public setWriteStream(writeStream: CharacterWriteStream): this
    {
        PreCondition.assertNotUndefinedAndNotNull(writeStream, "writeStream");

        this.writeStream = writeStream;

        return this;
    }

    protected writeString(text: string): AsyncResult<number>
    {
        return this.writeStream?.writeString(text) ?? AsyncResult.value(0);
    }

    protected writeLine(text?: string): AsyncResult<number>
    {
        return this.writeStream?.writeLine(text) ?? AsyncResult.value(0);
    }

    public beforeTestGroup(testGroup: TestAction): AsyncResult<void>
    {
        PreCondition.assertNotUndefinedAndNotNull(testGroup, "testGroup");

        return AsyncResult.empty();
    }

    public afterTestGroup(testGroup: TestAction): AsyncResult<void>
    {
        PreCondition.assertNotUndefinedAndNotNull(testGroup, "testGroup");

        return AsyncResult.empty();
    }

    public beforeTest(testAction: TestAction): AsyncResult<void>
    {
        return AsyncResult.empty();
    }

    public afterPassedTest(testAction: TestAction): AsyncResult<void>
    {
        return AsyncResult.create(async () =>
        {
            await this.writeLine(" - Passed");
        });
    }

    public afterSkippedTest(testAction: TestAction, skip: TestSkip): AsyncResult<void>
    {
        PreCondition.assertNotUndefinedAndNotNull(testAction, "testAction");
        PreCondition.assertNotUndefinedAndNotNull(skip, "skip");

        return AsyncResult.create(async () =>
        {
            await this.writeLine(" - Skipped");
        });
    }

    public afterFailedTest(currentTestAction: TestAction, error: unknown): AsyncResult<void>
    {
        PreCondition.assertNotUndefinedAndNotNull(currentTestAction, "currentTestAction");
        PreCondition.assertNotUndefinedAndNotNull(error, "error");

        return AsyncResult.create(async () =>
        {
            await this.writeLine(" - Failed");
        });
    }
}

export class FlatConsoleTestRunnerUI extends ConsoleTestRunnerUI
{
    protected constructor()
    {
        super();
    }

    public static create(): FlatConsoleTestRunnerUI
    {
        return new FlatConsoleTestRunnerUI();
    }

    public beforeTest(testAction: TestAction): AsyncResult<void>
    {
        return AsyncResult.create(async () =>
        {
            await this.writeString(testAction.getFullName());
        });
    }
}

export class TreeConsoleTestRunnerUI extends ConsoleTestRunnerUI
{
    private testActions: List<TestAction>;
    private testActionWrittenDepth: number;

    private indentedWriteStream?: IndentedCharacterWriteStream;

    protected constructor()
    {
        super();

        this.testActions = List.create();
        this.testActionWrittenDepth = 0;
    }

    public static create(): TreeConsoleTestRunnerUI
    {
        return new TreeConsoleTestRunnerUI();
    }

    public setWriteStream(writeStream: CharacterWriteStream): this
    {
        PreCondition.assertNotUndefinedAndNotNull(writeStream, "writeStream");

        this.indentedWriteStream = IndentedCharacterWriteStream.create(writeStream);
        return super.setWriteStream(this.indentedWriteStream);
    }

    public beforeTestGroup(testGroup: TestAction): AsyncResult<void>
    {
        return AsyncResult.create(() =>
        {
            this.testActions.add(testGroup);
        });
    }

    public afterTestGroup(testGroup: TestAction): AsyncResult<void>
    {
        PreCondition.assertNotUndefinedAndNotNull(testGroup, "testGroup");
        PreCondition.assertTrue(this.testActions.any().await(), "this.testActions.any().await()");

        return AsyncResult.create(() =>
        {
             this.testActions.removeLast().await();
             const testActionCount: number = this.testActions.getCount().await();
             if (this.testActionWrittenDepth > testActionCount)
             {
                this.testActionWrittenDepth--;
                this.indentedWriteStream?.removeIndentation();
             }
        });
    }

    public beforeTest(testAction: TestAction): AsyncResult<void>
    {
        PreCondition.assertNotUndefinedAndNotNull(testAction, "testAction");

        return AsyncResult.create(async () =>
        {
            const testActionCount: number = this.testActions.getCount().await();
            while (this.testActionWrittenDepth < testActionCount)
            {
                const testGroup: TestAction = this.testActions.get(this.testActionWrittenDepth).await();
                await this.writeLine(testGroup.getName());
                this.indentedWriteStream?.addIndentation();
                this.testActionWrittenDepth++;
            }

            await this.writeString(testAction.getName());
        });
    }
}