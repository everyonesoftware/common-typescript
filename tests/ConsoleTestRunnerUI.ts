import { Iterable, AsyncResult, CharacterWriteStream, IndentedCharacterWriteStream, List, Map, MutableMap, NotFoundError, PreCondition, Stack } from "../sources";
import { FailedTest } from "./failedTest";
import { SkippedTest } from "./skippedTest";
import { TestAction, TestActionType } from "./testAction";
import { GetErrorStringOptions, TestError } from "./TestError";
import { TestSkip } from "./testSkip";

export type ConsoleTestRunnerStyle = TestActionType | "passed" | "skipped" | "failed";

export abstract class ConsoleTestRunnerUI
{
    private writeStream?: IndentedCharacterWriteStream;
    private readonly styles: MutableMap<ConsoleTestRunnerStyle, (text: string) => string>;
    private getErrorStringOptions?: GetErrorStringOptions;

    protected constructor()
    {
        this.styles = Map.create();
    }

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

        this.writeStream = IndentedCharacterWriteStream.create(writeStream);

        return this;
    }

    public setStyle(style: ConsoleTestRunnerStyle, styleFunction: (text: string) => string): this
    {
        PreCondition.assertNotEmpty(style, "style");
        PreCondition.assertNotUndefinedAndNotNull(styleFunction, "styleFunction");

        this.styles.set(style, styleFunction);

        return this;
    }

    public setStyles(styles: Partial<Record<ConsoleTestRunnerStyle, (text: string) => string>>): this
    {
        PreCondition.assertNotUndefinedAndNotNull(styles, "styles")

        for (const entry of Object.entries(styles))
        {
            this.setStyle(entry[0] as ConsoleTestRunnerStyle, entry[1]);
        }
        return this;
    }

    private applyStyle(style: ConsoleTestRunnerStyle, text: string): string
    {
        PreCondition.assertNotEmpty(style, "style");
        PreCondition.assertNotUndefinedAndNotNull(text, "text");

        const styleFunction: (text: string) => string = this.styles
            .get(style)
            .catch(NotFoundError, () => { return (text: string) => text; })
            .await();
        return styleFunction(text);
    }

    protected addIndentation(): void
    {
        this.writeStream?.addIndentation();
    }

    protected removeIndentation(): void
    {
        this.writeStream?.removeIndentation();
    }

    protected indent(action: () => number | void | PromiseLike<number | void>): AsyncResult<number>
    {
        return this.writeStream?.indent(action) ?? AsyncResult.value(0);
    }

    protected writeString(text: string): AsyncResult<number>
    {
        return this.writeStream?.writeString(text) ?? AsyncResult.value(0);
    }

    protected writeLine(text?: string): AsyncResult<number>
    {
        return this.writeStream?.writeLine(text) ?? AsyncResult.value(0);
    }

    protected writeTestActionName(testAction: TestAction): AsyncResult<number>
    {
        return this.writeString(this.applyStyle(testAction.getType(), testAction.getName()));
    }

    protected writeFullTestActionName(testAction: TestAction): AsyncResult<number>
    {
        return AsyncResult.create(async () =>
        {
            let result: number = 0;

            const testActionStack: Stack<TestAction> = Stack.create();
            let currentTestAction: TestAction | undefined = testAction;
            while (currentTestAction)
            {
                testActionStack.add(currentTestAction);
                currentTestAction = currentTestAction.getParent();
            }

            while (await testActionStack.any())
            {
                currentTestAction = await testActionStack.remove()!;
                if (currentTestAction.getParent())
                {
                    result += await this.writeString(" ");
                }
                result += await this.writeTestActionName(currentTestAction);
            }

            return result;
        });
    }

    public setGetErrorStringOptions(options: GetErrorStringOptions | undefined): this
    {
        this.getErrorStringOptions = options;

        return this;
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
            await this.writeLine(` - ${this.applyStyle("passed", "Passed")}`);
        });
    }

    public afterSkippedTest(testAction: TestAction, skip: TestSkip): AsyncResult<void>
    {
        PreCondition.assertNotUndefinedAndNotNull(testAction, "testAction");
        PreCondition.assertNotUndefinedAndNotNull(skip, "skip");

        return AsyncResult.create(async () =>
        {
            await this.writeLine(` - ${this.applyStyle("skipped", "Skipped")}`);
        });
    }

    public afterFailedTest(currentTestAction: TestAction, error: TestError): AsyncResult<void>
    {
        PreCondition.assertNotUndefinedAndNotNull(currentTestAction, "currentTestAction");
        PreCondition.assertNotUndefinedAndNotNull(error, "error");

        return AsyncResult.create(async () =>
        {
            await this.writeLine(` - ${this.applyStyle("failed", "Failed")}`);
        });
    }

    public writeSummary(passedTestCount: number, skippedTests: Iterable<SkippedTest>, failedTests: Iterable<FailedTest>): AsyncResult<void>
    {
        PreCondition.assertGreaterThanOrEqualTo(passedTestCount, 0, "passedTestCount");
        PreCondition.assertNotUndefinedAndNotNull(skippedTests, "skippedTests");
        PreCondition.assertNotUndefinedAndNotNull(failedTests, "failedTests");

        return AsyncResult.create(async () =>
        {
            await this.writeLine();

            if (await skippedTests.any())
            {
                await this.writeLine(`${this.applyStyle("skipped", "Skipped Tests")}:`);
                let counter: number = 0;
                for (const skippedTest of skippedTests)
                {
                    await this.writeString(`${++counter}) `);
                    await this.writeFullTestActionName(skippedTest.getTestAction());
                    await this.writeLine();

                    const skipMessage: string = skippedTest.getSkipMessage();
                    if (skipMessage)
                    {
                        await this.indent(() => this.writeLine(skipMessage));
                    }
                }
                await this.writeLine();
            }

            if (await failedTests.any())
            {
                await this.writeLine(`${this.applyStyle("failed", "Failed Tests")}:`);

                let counter: number = 0;
                for (const failedTest of failedTests)
                {
                    await this.writeString(`${++counter}) `);
                    await this.writeFullTestActionName(failedTest.getTestAction());
                    await this.writeLine();

                    const testError: TestError = failedTest.getTestError();
                    await this.indent(() => this.writeLine(testError.getErrorString(this.getErrorStringOptions)));
                    await this.writeLine();
                }
            }

            if (passedTestCount > 0)
            {
                await this.writeLine(`${this.applyStyle("passed", "Passed")}:  ${passedTestCount}`);
            }

            if (await skippedTests.any())
            {
                await this.writeLine(`${this.applyStyle("skipped", "Skipped")}: ${skippedTests.getCount().await()}`);
            }

            if (await failedTests.any())
            {
                await this.writeLine(`${this.applyStyle("failed", "Failed")}:  ${failedTests.getCount().await()}`);
            }
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
            await this.writeFullTestActionName(testAction);
        });
    }
}

export class TreeConsoleTestRunnerUI extends ConsoleTestRunnerUI
{
    private testActions: List<TestAction>;
    private testActionWrittenDepth: number;

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
                this.removeIndentation();
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
                await this.writeTestActionName(testGroup);
                await this.writeLine();
                this.addIndentation();
                this.testActionWrittenDepth++;
            }

            await this.writeTestActionName(testAction);
        });
    }
}