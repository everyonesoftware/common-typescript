import { CharacterWriteStream } from "../sources/characterWriteStream";
import { CurrentProcess } from "../sources/currentProcess";
import { Iterable } from "../sources/iterable";
import { JavascriptIterable } from "../sources/javascript";
import { List } from "../sources/list";
import { NodeJSCharacterWriteStream } from "../sources/nodeJSCharacterWriteStream";
import { PreCondition } from "../sources/preCondition";
import { getName, getParameterCount, isBoolean, isFunction, isJavascriptIterable, isString, Type } from "../sources/types";
import { AssertTest } from "./assertTest";
import { FailedTest } from "./failedTest";
import { SkippedTest } from "./skippedTest";
import { Test } from "./test";
import { TestAction, TestActionType } from "./testAction";
import { TestRunner } from "./testRunner";
import { TestSkip } from "./testSkip";
import { AsyncResult, IndentedCharacterWriteStream } from "../sources";
import { ConsoleTestRunnerStyle, ConsoleTestRunnerUI } from "./ConsoleTestRunnerUI";
import { ANSIStyles } from "../sources/ANSIStyles";

export type ConsoleTestFunction = (runner: ConsoleTestRunner) => (void | Promise<void>);
export type ConsoleTestFunctionContainer = { test: ConsoleTestFunction };

export class ConsoleTestRunner implements TestRunner
{
    private writeStream: CharacterWriteStream;

    private readonly testActions: List<TestAction>;
    private testActionInsertIndex: number;
    private currentTestAction: TestAction | undefined;
    private currentTest: Test | undefined;

    private passedTestCount: number;
    private readonly skippedTests: List<SkippedTest>;
    private readonly testFailures: List<FailedTest>;

    private readonly ui: ConsoleTestRunnerUI;

    public constructor(ui?: ConsoleTestRunnerUI)
    {
        this.writeStream = IndentedCharacterWriteStream.create(NodeJSCharacterWriteStream.create(process.stdout));

        this.testActions = List.create();
        this.testActionInsertIndex = 0;

        this.passedTestCount = 0;
        this.skippedTests = List.create();
        this.testFailures = List.create();

        this.ui = ui || ConsoleTestRunnerUI.tree();
        this.ui.setWriteStream(this.writeStream);
    }

    public static create(ui?: ConsoleTestRunnerUI): ConsoleTestRunner
    {
        return new ConsoleTestRunner(ui);
    }

    public static run(testFunction: ConsoleTestFunction | ConsoleTestFunctionContainer): Promise<void>;
    public static run(testFunctions: JavascriptIterable<ConsoleTestFunction | ConsoleTestFunctionContainer>): Promise<void>;
    static run(testFunctionOrTestFunctions: ConsoleTestFunction | ConsoleTestFunctionContainer | JavascriptIterable<ConsoleTestFunction | ConsoleTestFunctionContainer>): Promise<void>
    {
        let testFunction: ConsoleTestFunction;
        if (isFunction(testFunctionOrTestFunctions))
        {
            testFunction = testFunctionOrTestFunctions;
        }
        else if (!isJavascriptIterable(testFunctionOrTestFunctions))
        {
            testFunction = testFunctionOrTestFunctions.test;
        }
        else
        {
            const testFunctions: JavascriptIterable<ConsoleTestFunction | ConsoleTestFunctionContainer> = testFunctionOrTestFunctions;
            testFunction = async (runner: ConsoleTestRunner) =>
            {
                for (const testFunction of testFunctions)
                {
                    if (isFunction(testFunction))
                    {
                        await testFunction(runner);
                    }
                    else
                    {
                        await testFunction.test(runner);
                    }
                }
            };
        }

        return CurrentProcess.run(async (currentProcess: CurrentProcess) =>
        {
            const runner: ConsoleTestRunner = ConsoleTestRunner.create()
                .setWriteStream(currentProcess.getOutputWriteStream())
                .setStyles({
                    file: t => ANSIStyles.blue(t),
                    function: t => ANSIStyles.blue(t),
                    type: t => ANSIStyles.blue(t),
                    group: t => ANSIStyles.blue(t),
                    passed: t => ANSIStyles.green(`✓ ${t}`),
                    skipped: t => ANSIStyles.yellow(`◌ ${t}`),
                    failed: t => ANSIStyles.red(`✗ ${t}`),
                });

            await testFunction(runner);

            await runner.runAsync();

            await runner.printSummary();
        });
    }

    public setWriteStream(writeStream: CharacterWriteStream): this
    {
        PreCondition.assertNotUndefinedAndNotNull(writeStream, "writeStream");

        this.writeStream = IndentedCharacterWriteStream.create(writeStream);
        this.ui.setWriteStream(this.writeStream);

        return this;
    }

    public setStyle(style: ConsoleTestRunnerStyle, styleFunction: (text: string) => string): this
    {
        this.ui.setStyle(style, styleFunction);

        return this;
    }

    public setStyles(styles: Partial<Record<ConsoleTestRunnerStyle, (text: string) => string>>): this
    {
        this.ui.setStyles(styles);

        return this;
    }

    /**
     * Get the number of {@link TestAction}s that have yet to be executed.
     */
    public getTestActionCount(): number
    {
        return this.testActions.getCount().await();
    }

    /**
     * Get the index in the {@link TestAction} list that new {@link TestAction}s will be
     * inserted at.
     */
    public getTestActionInsertIndex(): number
    {
        return this.testActionInsertIndex;
    }

    private resetTestActionInsertIndex(): void
    {
        this.testActionInsertIndex = 0;
    }

    private insertTestAction(testActionName: string, testActionType: TestActionType, skip: TestSkip | undefined, action: () => (void | Promise<void>))
    {
        const parentTestAction: TestAction | undefined = this.getCurrentTestAction();
        const testAction: TestAction = TestAction.create(parentTestAction, testActionName, testActionType, skip, action);
        this.testActions.insert(this.testActionInsertIndex, testAction);
        this.testActionInsertIndex++;
    }

    /**
     * Get the number of tests that have been skipped.
     */
    public getSkippedTestCount(): number
    {
        return this.skippedTests.getCount().await();
    }

    public getSkippedTests(): Iterable<SkippedTest>
    {
        return this.skippedTests;
    }

    /**
     * Get the number of tests that have passed.
     */
    public getPassedTestCount(): number
    {
        return this.passedTestCount;
    }

    public getFailedTestCount(): number
    {
        return this.testFailures.getCount().await();
    }

    public getFailedTests(): Iterable<FailedTest>
    {
        return this.testFailures;
    }

    /**
     * Get the {@link TestAction} that is currently executing or undefined if no {@link TestAction}
     * is executing.
     */
    public getCurrentTestAction(): TestAction | undefined
    {
        return this.currentTestAction;
    }

    public getCurrentTest(): Test | undefined
    {
        return this.currentTest;
    }

    private assertNoCurrentTest(): void
    {
        if (this.currentTest)
        {
            this.currentTest.fail("Can't start a new test group or a new test while running a test.");
        }
    }

    public beforeTestGroup(testAction: TestAction): AsyncResult<void>
    {
        return this.ui.beforeTestGroup(testAction);
    }

    public afterTestGroup(testAction: TestAction): AsyncResult<void>
    {
        return this.ui.afterTestGroup(testAction);
    }

    public beforeTest(testAction: TestAction): AsyncResult<void>
    {
        return this.ui.beforeTest(testAction);
    }

    public afterPassedTest(testAction: TestAction): AsyncResult<void>
    {
        return AsyncResult.create(async () =>
        {
            await this.ui.afterPassedTest(testAction);
            this.passedTestCount++;
        });
    }

    public afterSkippedTest(testAction: TestAction, skip: TestSkip): AsyncResult<void>
    {
        PreCondition.assertNotUndefinedAndNotNull(testAction, "testAction");

        return AsyncResult.create(async () =>
        {
            await this.ui.afterSkippedTest(testAction, skip);
            this.skippedTests.add(SkippedTest.create(skip, testAction));
        });
    }

    public afterFailedTest(testAction: TestAction, error: unknown): AsyncResult<void>
    {
        PreCondition.assertNotUndefinedAndNotNull(testAction, "testAction");
        PreCondition.assertNotUndefinedAndNotNull(error, "error");

        return AsyncResult.create(async () =>
        {
            await this.ui.afterFailedTest(testAction, error);
            this.testFailures.add(FailedTest.create(testAction, error));
        });
    }

    public andList(values: unknown[] | Iterable<unknown>): string
    {
        return TestRunner.andList(this, values);
    }

    public toString(value: unknown): string
    {
        return TestRunner.toString(this, value);
    }

    public skip(message?: string): TestSkip;
    public skip(shouldSkip: boolean, message?: string): TestSkip;
    skip(messageOrShouldSkip?: string | boolean | undefined, message?: string): TestSkip
    {
        let shouldSkip: boolean;
        if (!isBoolean(messageOrShouldSkip))
        {
            shouldSkip = true;
            message = messageOrShouldSkip;
        }
        else
        {
            shouldSkip = messageOrShouldSkip;
        }
        return TestRunner.skip(this, shouldSkip, message);
    }

    public testFile(fileName: string, testAction: (() => void) | ((test: Test) => void)): void;
    public testFile(fileName: string, skip: TestSkip | undefined, testAction: (() => void) | ((test: Test) => void)): void;
    testFile(fileName: string, skipOrTestAction: TestSkip | ((() => void) | ((test: Test) => void)) | undefined, testAction?: (() => void) | ((test: Test) => void)): void
    {
        PreCondition.assertNotUndefinedAndNotNull(fileName, "fileName");
        PreCondition.assertNotEmpty(fileName, "fileName");
        let skip: TestSkip | undefined;
        if (isFunction(skipOrTestAction))
        {
            PreCondition.assertUndefined(testAction, "testAction");

            skip = undefined;
            testAction = skipOrTestAction;
        }
        else
        {
            skip = skipOrTestAction;
        }
        PreCondition.assertNotUndefinedAndNotNull(testAction, "testAction");

        this.testGroupOrTest(fileName, "file", skip, testAction);
    }

    public testType(typeNameOrType: string | Type<unknown>, testAction: (() => void) | ((test: Test) => void)): void;
    public testType(typeNameOrType: string | Type<unknown>, skip: TestSkip | undefined, testAction: (() => void) | ((test: Test) => void)): void;
    testType(typeNameOrType: string | Type<unknown>, skipOrTestAction: TestSkip | undefined | ((() => void) | ((test: Test) => void)), testAction?: (() => void) | ((test: Test) => void)): void
    {
        PreCondition.assertNotUndefinedAndNotNull(typeNameOrType, "typeNameOrType");
        let typeName: string;
        if (isString(typeNameOrType))
        {
            typeName = typeNameOrType;
        }
        else
        {
            typeName = getName(typeNameOrType);
        }
        PreCondition.assertNotEmpty(typeName, "typeName");

        let skip: TestSkip | undefined;
        if (isFunction(skipOrTestAction))
        {
            PreCondition.assertUndefined(testAction, "testAction");

            skip = undefined;
            testAction = skipOrTestAction;
        }
        else
        {
            skip = skipOrTestAction;
        }
        PreCondition.assertNotUndefinedAndNotNull(testAction, "testAction");

        this.testGroupOrTest(typeName, "type", skip, testAction);
    }

    public testFunction(functionSignature: string, testAction: (() => void) | ((test: Test) => void)): void;
    public testFunction(functionSignature: string, skip: TestSkip | undefined, testAction: (() => void) | ((test: Test) => void)): void;
    testFunction(functionSignature: string, skipOrTestAction: TestSkip | undefined | ((() => void) | ((test: Test) => void)), testAction?: (() => void) | ((test: Test) => void)): void
    {
        PreCondition.assertNotEmpty(functionSignature, "functionSignature");
        let skip: TestSkip | undefined;
        if (isFunction(skipOrTestAction))
        {
            PreCondition.assertUndefined(testAction, "testAction");

            skip = undefined;
            testAction = skipOrTestAction;
        }
        else
        {
            skip = skipOrTestAction;
        }
        PreCondition.assertNotUndefinedAndNotNull(testAction, "testAction");

        this.testGroupOrTest(functionSignature, "function", skip, testAction);
    }

    public testGroup(testGroupName: string, testAction: () => (void | Promise<void>)): void;
    public testGroup(testGroupName: string, skip: TestSkip | undefined, testAction: () => (void | Promise<void>)): void;
    testGroup(testGroupName: string, skipOrTestAction: TestSkip | undefined | (() => (void | Promise<void>)), testAction?: () => (void | Promise<void>)): void
    {
        PreCondition.assertNotUndefinedAndNotNull(testGroupName, "testGroupName");
        PreCondition.assertNotEmpty(testGroupName, "testGroupName");
        let skip: TestSkip | undefined;
        if (isFunction(skipOrTestAction))
        {
            PreCondition.assertUndefined(testAction, "testAction");

            skip = undefined;
            testAction = skipOrTestAction;
        }
        else
        {
            skip = skipOrTestAction;
        }
        PreCondition.assertNotUndefinedAndNotNull(testAction, "testAction");

        this.innerTestGroup(testGroupName, "group", skip, testAction);
    }

    public test(testName: string, testAction: (test: Test) => (void | Promise<void>)): void;
    public test(testName: string, skip: TestSkip | undefined, testAction: (test: Test) => (void | Promise<void>)): void;
    test(testName: string, skipOrTestAction: TestSkip | undefined | ((test: Test) => (void | Promise<void>)), testAction?: (test: Test) => (void | Promise<void>)): void
    {
        PreCondition.assertNotUndefinedAndNotNull(testName, "testName");
        PreCondition.assertNotEmpty(testName, "testName");
        let skip: TestSkip | undefined;
        if (isFunction(skipOrTestAction))
        {
            PreCondition.assertUndefined(testAction, "testAction");

            skip = undefined;
            testAction = skipOrTestAction;
        }
        else
        {
            skip = skipOrTestAction;
        }
        PreCondition.assertNotUndefinedAndNotNull(testAction, "testAction");

        this.innerTest(testName, "test", skip, testAction);
    }

    private innerTestGroup(testGroupName: string, type: TestActionType, skip: TestSkip | undefined, testGroupAction: () => void): void
    {
        PreCondition.assertNotEmpty(testGroupName, "testGroupName");
        PreCondition.assertNotUndefinedAndNotNull(testGroupAction, "testGroupAction");

        this.assertNoCurrentTest();

        this.insertTestAction(
            testGroupName,
            type,
            skip,
            () => this.beforeTestGroup(this.getCurrentTestAction()!),
        )
        this.insertTestAction(
            testGroupName,
            type,
            skip,
            async () =>
            {
                this.resetTestActionInsertIndex();
                try
                {
                    await testGroupAction();
                }
                catch (error)
                {
                    const currentTestGroupAction: TestAction = this.getCurrentTestAction()!;
                    await this.afterFailedTest(currentTestGroupAction, error);
                }
            },
        );
        this.insertTestAction(
            testGroupName,
            type,
            skip,
            () => this.afterTestGroup(this.getCurrentTestAction()!),
        )
    }

    private innerTest(testName: string, testType: TestActionType, skip: TestSkip | undefined, testAction: (test: Test) => void): void
    {
        PreCondition.assertNotEmpty(testName, "testName");
        PreCondition.assertNotUndefinedAndNotNull(testAction, "testAction");

        this.assertNoCurrentTest();

        this.insertTestAction(
            testName,
            testType,
            skip,
            async () =>
            {
                const currentTestAction: TestAction = this.getCurrentTestAction()!;
                try
                {
                    await this.beforeTest(currentTestAction);

                    const skip: TestSkip | undefined = currentTestAction.getSkip();
                    if (skip?.getShouldSkip())
                    {
                        await this.afterSkippedTest(currentTestAction, skip);
                    }
                    else
                    {
                        this.currentTest = AssertTest.create(testName);
                        try
                        {
                            await testAction(this.currentTest);
                        }
                        finally
                        {
                            this.currentTest = undefined;
                        }
                        await this.afterPassedTest(currentTestAction);
                    }
                }
                catch (error)
                {
                    await this.afterFailedTest(currentTestAction, error);
                }
            },
        );
    }

    private testGroupOrTest(name: string, type: TestActionType, skip: TestSkip | undefined, testAction: (() => void) | ((test: Test) => void)): void
    {
        if (getParameterCount(testAction) === 0)
        {
            this.innerTestGroup(name, type, skip, <() => void>testAction);
        }
        else
        {
            this.innerTest(name, type, skip, <(test: Test) => void>testAction);
        }
    }

    public async runAsync(): Promise<void>
    {
        while (this.testActions.any().await())
        {
            this.resetTestActionInsertIndex();

            this.currentTestAction = this.testActions.removeFirst().await();
            try
            {
                await this.currentTestAction.runAsync();
            }
            finally
            {
                this.currentTestAction = undefined;
            }
        }
        this.resetTestActionInsertIndex();
    }

    public printSummary(): AsyncResult<void>
    {
        return this.ui.writeSummary(this.passedTestCount, this.getSkippedTests(), this.getFailedTests());
    }
}