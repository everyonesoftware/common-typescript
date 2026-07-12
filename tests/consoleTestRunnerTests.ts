import { AssertionError } from "assert";

import { InMemoryCharacterWriteStream } from "../sources/inMemoryCharacterWriteStream.js";
import { Iterable } from "../sources/iterable.js";
import { List } from "../sources/list.js";
import { PreConditionError } from "../sources/preConditionError.js";
import { WhereIterable } from "../sources/whereIterable.js";
import { ConsoleTestRunner } from "./consoleTestRunner.js";
import { FailedTest } from "./failedTest.js";
import { SkippedTest } from "./skippedTest.js";
import { Test } from "./test.js";
import { TestAction } from "./testAction.js";
import { TestRunner } from "./testRunner.js";
import * as testRunnerTests from "./testRunnerTests.js";
import { TestError } from "./TestError.js";

interface RunnerStats
{
    testActionCount: number;
    testActionInsertIndex: number;
    passed: number;
    skipped: number;
    failed: number;
}

function assertRunnerStats(test: Test, runner: ConsoleTestRunner, stats: RunnerStats): void
{
    test.assertEqual(stats.testActionCount, runner.getTestActionCount(), "Wrong pending TestActions count");
    test.assertEqual(stats.testActionInsertIndex, runner.getTestActionInsertIndex(), "Wrong pending TestActions insert index");
    test.assertEqual(stats.passed, runner.getPassedTestCount(), "Wrong passed test count");
    test.assertEqual(stats.skipped, runner.getSkippedTestCount(), "Wrong skipped test count");
    test.assertEqual(stats.failed, runner.getFailedTestCount(), "Wrong failed test count");
}

export function test(runner: TestRunner): void
{
    runner.testFile("consoleTestRunner.ts", () =>
    {
        runner.testType("ConsoleTestRunner", () =>
        {
            testRunnerTests.test2(runner, ConsoleTestRunner.create);

            runner.testFunction("create()", (test: Test) =>
            {
                const writeStream: InMemoryCharacterWriteStream = InMemoryCharacterWriteStream.create();
                const runner2: ConsoleTestRunner = ConsoleTestRunner.create().setWriteStream(writeStream);

                test.assertNotUndefinedAndNotNull(runner2);
                test.assertEqual(0, runner2.getTestActionCount());
                test.assertEqual(0, runner2.getTestActionInsertIndex());
                test.assertUndefined(runner2.getCurrentTestAction());
            });

            runner.testFunction("testFile()", () =>
            {
                runner.test("with no Test argument in testAction", async (test: Test) =>
                {
                    let counter: number = 0;
                    const writeStream = InMemoryCharacterWriteStream.create();
                    const runner2: ConsoleTestRunner = ConsoleTestRunner.create().setWriteStream(writeStream);
                    runner2.testFile("fakeFile.ts", () =>
                    {
                        counter++;
                        const currentTestAction: TestAction | undefined = runner2.getCurrentTestAction();
                        test.assertNotUndefinedAndNotNull(currentTestAction);
                        test.assertUndefined(currentTestAction.getParent());
                        test.assertEqual("fakeFile.ts", currentTestAction.getName());
                    });
                    test.assertEqual(0, counter);
                    assertRunnerStats(test, runner2, {
                        testActionCount: 3,
                        testActionInsertIndex: 3,
                        skipped: 0,
                        passed: 0,
                        failed: 0,
                    });
                    test.assertUndefined(runner2.getCurrentTestAction());

                    for (let i = 0; i < 3; i++)
                    {
                        await runner2.runAsync();

                        test.assertEqual(1, counter);
                        test.assertUndefined(runner2.getCurrentTestAction());
                        assertRunnerStats(test, runner2, {
                            testActionCount: 0,
                            testActionInsertIndex: 0,
                            skipped: 0,
                            passed: 0,
                            failed: 0,
                        });
                        test.assertEqual("", writeStream.getWrittenText());
                    }
                });

                runner.test("with skip, no Test argument in testFile() action, but no tests", async (test: Test) =>
                {
                    let counter: number = 0;
                    const writeStream = InMemoryCharacterWriteStream.create();
                    const runner2: ConsoleTestRunner = ConsoleTestRunner.create().setWriteStream(writeStream);
                    runner2.testFile("fakeFile.ts", runner2.skip(), () =>
                    {
                        counter++;
                    });
                    test.assertEqual(0, counter);
                    test.assertUndefined(runner2.getCurrentTestAction());
                    assertRunnerStats(test, runner2, {
                        testActionCount: 3,
                        testActionInsertIndex: 3,
                        skipped: 0,
                        passed: 0,
                        failed: 0,
                    });
                    test.assertEqual("", writeStream.getWrittenText());

                    for (let i = 0; i < 3; i++)
                    {
                        await runner2.runAsync();

                        test.assertEqual(1, counter);
                        test.assertUndefined(runner2.getCurrentTestAction());
                        assertRunnerStats(test, runner2, {
                            testActionCount: 0,
                            testActionInsertIndex: 0,
                            skipped: 0,
                            passed: 0,
                            failed: 0,
                        });
                        test.assertEqual("", writeStream.getWrittenText());
                    }
                });

                runner.test("with Test argument in testAction", async (test: Test) =>
                {
                    let counter: number = 0;
                    const writeStream: InMemoryCharacterWriteStream = InMemoryCharacterWriteStream.create();
                    const runner2: ConsoleTestRunner = ConsoleTestRunner.create().setWriteStream(writeStream);

                    runner2.testFile("fakeFile.ts", (test2: Test) =>
                    {
                        counter++;

                        const currentTestAction: TestAction | undefined = runner2.getCurrentTestAction();
                        test.assertNotUndefinedAndNotNull(currentTestAction);
                        test.assertUndefined(currentTestAction.getParent());
                        test.assertEqual("fakeFile.ts", currentTestAction.getName());

                        test.assertNotUndefinedAndNotNull(test2);
                        test.assertNotSame(test, test2);
                        test.assertSame(test2, runner2.getCurrentTest());
                    });
                    test.assertEqual(0, counter);
                    test.assertUndefined(runner2.getCurrentTestAction());
                    assertRunnerStats(test, runner2, {
                        testActionCount: 1,
                        testActionInsertIndex: 1,
                        skipped: 0,
                        passed: 0,
                        failed: 0,
                    });

                    for (let i = 0; i < 3; i++)
                    {
                        await runner2.runAsync();

                        test.assertEqual(1, counter);
                        test.assertUndefined(runner2.getCurrentTestAction());
                        assertRunnerStats(test, runner2, {
                            testActionCount: 0,
                            testActionInsertIndex: 0,
                            skipped: 0,
                            passed: 1,
                            failed: 0,
                        });
                    }
                });
            });

            runner.testFunction("testType()", () =>
            {
                runner.test("with Type instead of type name", async (test: Test) =>
                {
                    const writeStream: InMemoryCharacterWriteStream = InMemoryCharacterWriteStream.create();
                    const runner2: ConsoleTestRunner = ConsoleTestRunner.create().setWriteStream(writeStream);

                    runner2.testType(WhereIterable, () =>
                    {
                        const currentTestAction: TestAction | undefined = runner2.getCurrentTestAction();
                        test.assertNotUndefinedAndNotNull(currentTestAction);
                        test.assertEqual("WhereIterable", currentTestAction.getName());
                    });
                    assertRunnerStats(test, runner2, {
                        testActionCount: 3,
                        testActionInsertIndex: 3,
                        skipped: 0,
                        passed: 0,
                        failed: 0,
                    });

                    await runner2.runAsync();
                    assertRunnerStats(test, runner2, {
                        testActionCount: 0,
                        testActionInsertIndex: 0,
                        skipped: 0,
                        passed: 0,
                        failed: 0,
                    });
                });
            });

            runner.testFunction("testFunction()", async (test: Test) =>
            {
                const writeStream: InMemoryCharacterWriteStream = InMemoryCharacterWriteStream.create();
                const runner2: ConsoleTestRunner = ConsoleTestRunner.create().setWriteStream(writeStream);

                runner2.testFunction("fakeFunction()", () =>
                {
                    const currentTestAction: TestAction | undefined = runner2.getCurrentTestAction();
                    test.assertNotUndefinedAndNotNull(currentTestAction);
                    test.assertEqual("fakeFunction()", currentTestAction.getName());
                });
                assertRunnerStats(test, runner2, {
                    testActionCount: 3,
                    testActionInsertIndex: 3,
                    skipped: 0,
                    passed: 0,
                    failed: 0,
                });

                await runner2.runAsync();
                assertRunnerStats(test, runner2, {
                    testActionCount: 0,
                    testActionInsertIndex: 0,
                    skipped: 0,
                    passed: 0,
                    failed: 0,
                });
            });

            runner.testFunction("testGroup()", () =>
            {
                runner.test("normal behavior", async (test: Test) =>
                {
                    const writeStream: InMemoryCharacterWriteStream = InMemoryCharacterWriteStream.create();
                    const runner2: ConsoleTestRunner = ConsoleTestRunner.create().setWriteStream(writeStream);
                    
                    runner2.testGroup("fake group", () =>
                    {
                        const currentTestAction: TestAction | undefined = runner2.getCurrentTestAction();
                        test.assertNotUndefinedAndNotNull(currentTestAction);
                        test.assertEqual("fake group", currentTestAction.getName());
                    });
                    assertRunnerStats(test, runner2, {
                        testActionCount: 3,
                        testActionInsertIndex: 3,
                        skipped: 0,
                        passed: 0,
                        failed: 0,
                    });

                    await runner2.runAsync();
                    assertRunnerStats(test, runner2, {
                        testActionCount: 0,
                        testActionInsertIndex: 0,
                        skipped: 0,
                        passed: 0,
                        failed: 0,
                    });
                });

                runner.test("with skip but no tests", async (test: Test) =>
                {
                    const writeStream: InMemoryCharacterWriteStream = InMemoryCharacterWriteStream.create();
                    const runner2: ConsoleTestRunner = ConsoleTestRunner.create().setWriteStream(writeStream);
                    
                    let counter: number = 0;
                    runner2.testGroup("fake group", runner2.skip(), () =>
                    {
                        counter++;
                    });
                    assertRunnerStats(test, runner2, {
                        testActionCount: 3,
                        testActionInsertIndex: 3,
                        skipped: 0,
                        passed: 0,
                        failed: 0,
                    });
                    test.assertEqual(0, counter);

                    await runner2.runAsync();
                    assertRunnerStats(test, runner2, {
                        testActionCount: 0,
                        testActionInsertIndex: 0,
                        skipped: 0,
                        passed: 0,
                        failed: 0,
                    });
                    test.assertEqual(1, counter);
                });

                runner.test("with skip and one test", async (test: Test) =>
                {
                    const writeStream: InMemoryCharacterWriteStream = InMemoryCharacterWriteStream.create();
                    const runner2: ConsoleTestRunner = ConsoleTestRunner.create().setWriteStream(writeStream);
                    
                    runner2.testGroup("fake-group", runner2.skip("fake-group-skip-message"), () =>
                    {
                        runner2.test("fake-test", (test: Test) =>
                        {
                            test.fail("Shouldn't run test!");
                        });
                    });
                    assertRunnerStats(test, runner2, {
                        testActionCount: 3,
                        testActionInsertIndex: 3,
                        skipped: 0,
                        passed: 0,
                        failed: 0,
                    });

                    await runner2.runAsync();
                    assertRunnerStats(test, runner2, {
                        testActionCount: 0,
                        testActionInsertIndex: 0,
                        skipped: 1,
                        passed: 0,
                        failed: 0,
                    });

                    const skippedTests: Iterable<SkippedTest> = runner2.getSkippedTests();
                    test.assertNotUndefinedAndNotNull(skippedTests);
                    const skippedTest: SkippedTest = await skippedTests.first();
                    test.assertNotUndefinedAndNotNull(skippedTest);
                    test.assertEqual(
                        List.create(["fake-group", "fake-test"]),
                        skippedTest.getTestAction().getFullNameParts(),
                    );
                    test.assertEqual("fake-group-skip-message", skippedTest.getSkipMessage());
                });

                runner.test("with unhandled exception", async (test: Test) =>
                {
                    const writeStream: InMemoryCharacterWriteStream = InMemoryCharacterWriteStream.create();
                    const runner2: ConsoleTestRunner = ConsoleTestRunner.create().setWriteStream(writeStream);
                    
                    runner2.testGroup("fake group", () =>
                    {
                        throw Error("oops!");
                    });
                    assertRunnerStats(test, runner2, {
                        testActionCount: 3,
                        testActionInsertIndex: 3,
                        skipped: 0,
                        passed: 0,
                        failed: 0,
                    });

                    await runner2.runAsync();
                    assertRunnerStats(test, runner2, {
                        testActionCount: 0,
                        testActionInsertIndex: 0,
                        skipped: 0,
                        passed: 0,
                        failed: 1,
                    });
                });
            });

            runner.testFunction("test()", () =>
            {
                runner.test("with no parent", async (test: Test) =>
                {
                    const writeStream: InMemoryCharacterWriteStream = InMemoryCharacterWriteStream.create();
                    const runner2: ConsoleTestRunner = ConsoleTestRunner.create().setWriteStream(writeStream);
                    
                    runner2.test("fake test", (test2: Test) =>
                    {
                        const currentTestAction: TestAction | undefined = runner2.getCurrentTestAction();
                        test.assertNotUndefinedAndNotNull(currentTestAction);
                        test.assertEqual("fake test", currentTestAction.getName());

                        test.assertSame(test2, runner2.getCurrentTest());
                    });
                    assertRunnerStats(test, runner2, {
                        testActionCount: 1,
                        testActionInsertIndex: 1,
                        skipped: 0,
                        passed: 0,
                        failed: 0,
                    });

                    await runner2.runAsync();
                    assertRunnerStats(test, runner2, {
                        testActionCount: 0,
                        testActionInsertIndex: 0,
                        skipped: 0,
                        passed: 1,
                        failed: 0,
                    });
                });

                runner.test("with TestGroup parent", async (test: Test) =>
                {
                    let counter: number = 0;
                    const writeStream: InMemoryCharacterWriteStream = InMemoryCharacterWriteStream.create();
                    const runner2: ConsoleTestRunner = ConsoleTestRunner.create().setWriteStream(writeStream);
                    
                    runner2.testGroup("fake-test-group", () =>
                    {
                        counter++;
                        test.assertEqual(1, counter);

                        const testGroupAction: TestAction | undefined = runner2.getCurrentTestAction();
                        test.assertNotUndefinedAndNotNull(testGroupAction);
                        test.assertEqual("fake-test-group", testGroupAction.getName());

                        runner2.test("fake-test", (test2: Test) =>
                        {
                            counter++;
                            test.assertEqual(2, counter);

                            const testAction: TestAction | undefined = runner2.getCurrentTestAction();
                            test.assertNotUndefinedAndNotNull(testAction);
                            test.assertEqual("fake-test-group fake-test", testAction.getFullName());
                            test.assertEqual("fake-test", testAction.getName());
                            test.assertSame(testGroupAction, testAction.getParent());

                            test.assertSame(test2, runner2.getCurrentTest());
                        });

                        test.assertEqual(1, counter);
                    });
                    test.assertEqual(0, counter);
                    assertRunnerStats(test, runner2, {
                        testActionCount: 3,
                        testActionInsertIndex: 3,
                        skipped: 0,
                        passed: 0,
                        failed: 0,
                    });

                    await runner2.runAsync();
                    test.assertEqual(2, counter);
                    assertRunnerStats(test, runner2, {
                        testActionCount: 0,
                        testActionInsertIndex: 0,
                        skipped: 0,
                        passed: 1,
                        failed: 0,
                    });
                });

                runner.test("with TestGroup grandparent", async (test: Test) =>
                {
                    let counter: number = 0;
                    const writeStream: InMemoryCharacterWriteStream = InMemoryCharacterWriteStream.create();
                    const runner2: ConsoleTestRunner = ConsoleTestRunner.create().setWriteStream(writeStream);
                    runner2.testGroup("fake-test-group-1", () =>
                    {
                        counter++;
                        test.assertEqual(1, counter);

                        const testGroupAction: TestAction | undefined = runner2.getCurrentTestAction();
                        test.assertNotUndefinedAndNotNull(testGroupAction);
                        test.assertEqual("fake-test-group-1", testGroupAction.getFullName());
                        test.assertEqual("fake-test-group-1", testGroupAction.getName());

                        runner2.testGroup("fake-test-group-2", () =>
                        {
                            counter++;
                            test.assertEqual(2, counter);

                            const testGroupAction: TestAction | undefined = runner2.getCurrentTestAction();
                            test.assertNotUndefinedAndNotNull(testGroupAction);
                            test.assertEqual("fake-test-group-1 fake-test-group-2", testGroupAction.getFullName());
                            test.assertEqual("fake-test-group-2", testGroupAction.getName());

                            runner2.test("fake-test", (test2: Test) =>
                            {
                                counter++;
                                test.assertEqual(3, counter);

                                const testAction: TestAction | undefined = runner2.getCurrentTestAction();
                                test.assertNotUndefinedAndNotNull(testAction);
                                test.assertEqual("fake-test-group-1 fake-test-group-2 fake-test", testAction.getFullName());
                                test.assertEqual("fake-test", testAction.getName());
                                test.assertSame(testGroupAction, testAction.getParent());

                                test.assertSame(test2, runner2.getCurrentTest());
                            });

                            test.assertEqual(2, counter);
                        });

                        test.assertEqual(1, counter);
                    });
                    test.assertEqual(0, counter);
                    assertRunnerStats(test, runner2, {
                        testActionCount: 3,
                        testActionInsertIndex: 3,
                        skipped: 0,
                        passed: 0,
                        failed: 0,
                    });

                    await runner2.runAsync();
                    test.assertEqual(3, counter);
                    assertRunnerStats(test, runner2, {
                        testActionCount: 0,
                        testActionInsertIndex: 0,
                        skipped: 0,
                        passed: 1,
                        failed: 0,
                    });
                });

                runner.test("with Test parent", async (test: Test) =>
                {
                    const writeStream: InMemoryCharacterWriteStream = InMemoryCharacterWriteStream.create();
                    const runner2: ConsoleTestRunner = ConsoleTestRunner.create().setWriteStream(writeStream);
                    runner2.test("fake-test-1", () =>
                    {
                        assertRunnerStats(test, runner2, {
                            testActionCount: 0,
                            testActionInsertIndex: 0,
                            skipped: 0,
                            passed: 0,
                            failed: 0,
                        });

                        test.assertThrows(
                            () => runner2.test("fake-test-2", () =>
                            {
                                test.fail("Shouldn't execute inner test since it's inside another test.");
                            }),
                            new AssertionError({
                                message: "Can't start a new test group or a new test while running a test.",
                                operator: "fail",
                            }),
                        );

                        assertRunnerStats(test, runner2, {
                            testActionCount: 0,
                            testActionInsertIndex: 0,
                            skipped: 0,
                            passed: 0,
                            failed: 0,
                        });
                    });
                    assertRunnerStats(test, runner2, {
                        testActionCount: 1,
                        testActionInsertIndex: 1,
                        skipped: 0,
                        passed: 0,
                        failed: 0,
                    });

                    await runner2.runAsync();
                    assertRunnerStats(test, runner2, {
                        testActionCount: 0,
                        testActionInsertIndex: 0,
                        skipped: 0,
                        passed: 1,
                        failed: 0,
                    });
                });

                runner.test("with skip", async (test: Test) =>
                {
                    const writeStream: InMemoryCharacterWriteStream = InMemoryCharacterWriteStream.create();
                    const runner2: ConsoleTestRunner = ConsoleTestRunner.create().setWriteStream(writeStream);

                    runner2.test("fake-test-1", runner2.skip(true, "fake-skip-message"), () =>
                    {
                        test.fail("Should not run test action")
                    });
                    assertRunnerStats(test, runner2, {
                        testActionCount: 1,
                        testActionInsertIndex: 1,
                        skipped: 0,
                        passed: 0,
                        failed: 0,
                    });

                    await runner2.runAsync();
                    assertRunnerStats(test, runner2, {
                        testActionCount: 0,
                        testActionInsertIndex: 0,
                        skipped: 1,
                        passed: 0,
                        failed: 0,
                    });

                    const skippedTests: Iterable<SkippedTest> = runner2.getSkippedTests();
                    test.assertNotUndefinedAndNotNull(skippedTests);
                    test.assertEqual(1, await skippedTests.getCount());
                    const skippedTest: SkippedTest = await skippedTests.first();
                    test.assertNotUndefinedAndNotNull(skippedTest);
                    test.assertEqual(Iterable.create(["fake-test-1"]), skippedTest.getTestAction().getFullNameParts());
                    test.assertEqual("fake-skip-message", skippedTest.getSkipMessage());
                });

                runner.test("with assert failure", async (test: Test) =>
                {
                    const writeStream: InMemoryCharacterWriteStream = InMemoryCharacterWriteStream.create();
                    const runner2: ConsoleTestRunner = ConsoleTestRunner.create().setWriteStream(writeStream);

                    runner2.test("fake-test-1", () =>
                    {
                        test.assertEqual(1, 2);
                    });
                    assertRunnerStats(test, runner2, {
                        testActionCount: 1,
                        testActionInsertIndex: 1,
                        skipped: 0,
                        passed: 0,
                        failed: 0,
                    });

                    await runner2.runAsync();
                    assertRunnerStats(test, runner2, {
                        testActionCount: 0,
                        testActionInsertIndex: 0,
                        skipped: 0,
                        passed: 0,
                        failed: 1,
                    });

                    const failedTests: Iterable<FailedTest> = runner2.getFailedTests();
                    test.assertNotUndefinedAndNotNull(failedTests);
                    test.assertEqual(1, await failedTests.getCount());
                    const failedTest: FailedTest = await failedTests.first();
                    test.assertNotUndefinedAndNotNull(failedTest);
                    test.assertEqual(Iterable.create(["fake-test-1"]), failedTest.getTestAction().getFullNameParts());
                    const testError: TestError = failedTest.getTestError();
                    const errorMessage: string = testError.getErrorString();
                    test.assertTrue(errorMessage.includes("AssertionError [ERR_ASSERTION]: Expected values to be strictly deep-equal:"));
                    test.assertTrue(errorMessage.includes("1 !== 2"));
                });

                runner.test("with unexpected failure", async (test: Test) =>
                {
                    const writeStream: InMemoryCharacterWriteStream = InMemoryCharacterWriteStream.create();
                    const runner2: ConsoleTestRunner = ConsoleTestRunner.create().setWriteStream(writeStream);

                    runner2.test("fake-test-1", () =>
                    {
                        throw new PreConditionError("oops!");
                    });
                    assertRunnerStats(test, runner2, {
                        testActionCount: 1,
                        testActionInsertIndex: 1,
                        skipped: 0,
                        passed: 0,
                        failed: 0,
                    });

                    await runner2.runAsync();
                    assertRunnerStats(test, runner2, {
                        testActionCount: 0,
                        testActionInsertIndex: 0,
                        skipped: 0,
                        passed: 0,
                        failed: 1,
                    });

                    const failedTests: Iterable<FailedTest> = runner2.getFailedTests();
                    test.assertNotUndefinedAndNotNull(failedTests);
                    test.assertEqual(1, await failedTests.getCount());
                    const failedTest: FailedTest = await failedTests.first();
                    test.assertNotUndefinedAndNotNull(failedTest);
                    test.assertEqual(Iterable.create(["fake-test-1"]), failedTest.getTestAction().getFullNameParts());
                    const testError: TestError = failedTest.getTestError();
                    const errorMessage: string = testError.getErrorString();
                    test.assertTrue(errorMessage.includes("Error: oops!"));
                });
            });
        });
    });
}