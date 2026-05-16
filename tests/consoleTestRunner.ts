import { PromiseAsyncResult } from "../sources/promiseAsyncResult";
import { CharacterWriteStream } from "../sources/characterWriteStream";
import { CurrentProcess } from "../sources/currentProcess";
import { Iterable } from "../sources/iterable";
import { JavascriptIterable } from "../sources/javascript";
import { List } from "../sources/list";
import { NodeJSCharacterWriteStream } from "../sources/nodeJSCharacterWriteStream";
import { PreCondition } from "../sources/preCondition";
import { join } from "../sources/strings";
import { isFunction, isJavascriptIterable, isPromise } from "../sources/types";
import { AssertTest } from "./assertTest";
import { FailedTest } from "./failedTest";
import { SkippedTest } from "./skippedTest";
import { Test } from "./test";
import { TestAction } from "./testAction";
import { TestRunner } from "./testRunner";
import { TestSkip } from "./testSkip";

export type ConsoleTestFunction = (runner: ConsoleTestRunner) => (void | Promise<void>);
export type ConsoleTestFunctionContainer = { test: ConsoleTestFunction };

export class ConsoleTestRunner extends TestRunner
{
    private writeStream: CharacterWriteStream;

    private readonly pendingActions: List<TestAction>;
    private pendingActionsInsertIndex: number;
    private currentTestAction: TestAction | undefined;
    private currentTest: Test | undefined;

    private passedTestCount: number;
    private readonly skippedTests: List<SkippedTest>;
    private readonly testFailures: List<FailedTest>;

    public constructor()
    {
        super();

        this.writeStream = NodeJSCharacterWriteStream.create(process.stdout);

        this.pendingActions = List.create();
        this.pendingActionsInsertIndex = 0;

        this.passedTestCount = 0;
        this.skippedTests = List.create();
        this.testFailures = List.create();
    }

    public static create(): ConsoleTestRunner
    {
        return new ConsoleTestRunner();
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
                .setWriteStream(currentProcess.getOutputWriteStream());

            await testFunction(runner);

            await runner.runAsync();

            await runner.printSummary();
        });
    }

    public setWriteStream(writeStream: CharacterWriteStream): this
    {
        PreCondition.assertNotUndefinedAndNotNull(writeStream, "writeStream");

        this.writeStream = writeStream;

        return this;
    }

    /**
     * Get the number of {@link TestAction}s that have yet to be executed.
     */
    public getPendingTestActionsCount(): number
    {
        return this.pendingActions.getCount().await();
    }

    /**
     * Get the index in the pending-{@link TestAction} stack that new {@link TestAction}s will be
     * inserted at.
     */
    public getPendingTestActionsInsertIndex(): number
    {
        return this.pendingActionsInsertIndex;
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
        if (this.currentTest !== undefined)
        {
            this.currentTest.fail("Can't start a new test group or a new test while running a test.");
        }
    }

    public beforeTest(fullTestNameParts: JavascriptIterable<string>): PromiseAsyncResult<void>
    {
        return PromiseAsyncResult.create(async () =>
        {
            await this.writeStream.writeString(join(" ", fullTestNameParts));
        });
    }

    public afterPassedTest(): PromiseAsyncResult<void>
    {
        return PromiseAsyncResult.create(async () =>
        {
            await this.writeStream.writeLine(" - Passed");
            this.passedTestCount++;
        });
    }

    public afterSkippedTest(fullTestNameParts: JavascriptIterable<string>, skip: TestSkip | undefined): PromiseAsyncResult<void>
    {
        PreCondition.assertNotEmpty(fullTestNameParts, "fullTestNameParts");
        PreCondition.assertNotUndefinedAndNotNull(skip, "skip");

        return PromiseAsyncResult.create(async () =>
        {
            this.skippedTests.add(SkippedTest.create(skip, fullTestNameParts));
            await this.writeStream.writeLine(" - Skipped");
        });
    }

    public afterFailedTest(fullTestNameParts: JavascriptIterable<string>, error: unknown): PromiseAsyncResult<void>
    {
        PreCondition.assertNotEmpty(fullTestNameParts, "fullTestNameParts");
        PreCondition.assertNotUndefinedAndNotNull(error, "error");

        return PromiseAsyncResult.create(async () =>
        {
            this.testFailures.add(FailedTest.create(fullTestNameParts, error));
            await this.writeStream.writeLine(" - Failed");
        });
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

        this.assertNoCurrentTest();

        this.pendingActions.insert(
            this.pendingActionsInsertIndex,
            TestAction.create(
                this.getCurrentTestAction(),
                testGroupName,
                skip,
                async () =>
                {
                    const previousTestActionInsertIndex: number = this.pendingActionsInsertIndex;
                    this.pendingActionsInsertIndex = this.pendingActions.getCount().await();
                    const currentTestAction: TestAction = this.getCurrentTestAction()!;
                    try
                    {
                        await testAction();
                    }
                    catch (error)
                    {
                        await this.afterFailedTest(currentTestAction.getFullNameParts(), error);
                    }
                    finally
                    {
                        this.pendingActionsInsertIndex = previousTestActionInsertIndex;
                    }
                },
            ),
        );
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

        this.assertNoCurrentTest();

        this.pendingActions.insert(
            this.pendingActionsInsertIndex,
            TestAction.create(
                this.getCurrentTestAction(),
                testName,
                skip,
                async () =>
                {
                    const currentTestAction: TestAction = this.getCurrentTestAction()!;
                    try
                    {
                        await this.beforeTest(currentTestAction.getFullNameParts());
                        if (currentTestAction.shouldSkip())
                        {
                            await this.afterSkippedTest(currentTestAction.getFullNameParts(), currentTestAction.getSkip());
                        }
                        else
                        {
                            this.currentTest = AssertTest.create(testName);
                            try
                            {
                                await testAction(this.currentTest);
                                await this.afterPassedTest();
                            }
                            finally
                            {
                                this.currentTest = undefined;
                            }
                        }
                    }
                    catch (error)
                    {
                        await this.afterFailedTest(currentTestAction.getFullNameParts(), error);
                    }
                },
            ),
        );
    }

    public async runAsync(): Promise<void>
    {
        while (this.pendingActions.any().await())
        {
            this.currentTestAction = this.pendingActions.removeLast().await();
            try
            {
                const result: void | Promise<void> = this.currentTestAction.runAsync();
                if (isPromise(result))
                {
                    await result;
                }
            }
            finally
            {
                this.currentTestAction = undefined;
            }
        }
    }

    public printSummary(): PromiseAsyncResult<void>
    {
        return PromiseAsyncResult.create(async () =>
        {
            await this.writeStream.writeLine();

            const skippedTests: Iterable<SkippedTest> = this.getSkippedTests();
            if (await skippedTests.any())
            {
                await this.writeStream.writeLine(`Skipped Tests:`);
                let counter: number = 0;
                for (const skippedTest of skippedTests)
                {
                    await this.writeStream.writeLine(`${++counter}) ${skippedTest.getFullTestName()}`);
                    const skipMessage: string = skippedTest.getSkipMessage();
                    if (skipMessage)
                    {
                        await this.writeStream.writeLine(`  ${skipMessage}`);
                    }
                }
                await this.writeStream.writeLine();
            }

            const failedTests: Iterable<FailedTest> = this.getFailedTests();
            if (await failedTests.any())
            {
                await this.writeStream.writeLine("Failed Tests:");

                let counter: number = 0;
                for (const failedTest of failedTests)
                {
                    await this.writeStream.writeLine(`${++counter}) ${failedTest.getFullTestName()}`);
                    await this.writeStream.writeLine(`  ${failedTest.getErrorMessage()}`);
                    await this.writeStream.writeLine();
                }
            }

            const passedTestCount: number = this.getPassedTestCount();
            if (passedTestCount > 0)
            {
                await this.writeStream.writeLine(`Passed:  ${passedTestCount}`);
            }

            if (await skippedTests.any())
            {
                await this.writeStream.writeLine(`Skipped: ${skippedTests.getCount().await()}`);
            }

            if (await failedTests.any())
            {
                await this.writeStream.writeLine(`Failed:  ${failedTests.getCount().await()}`);
            }
        });
    }
}