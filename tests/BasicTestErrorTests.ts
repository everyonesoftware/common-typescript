import { PreConditionError } from "../sources/index.js";
import { BasicTestError } from "./BasicTestError.js";
import { Test } from "./test.js";
import { TestRunner } from "./testRunner.js";

export function test(runner: TestRunner): void
{
    runner.testFile("BasicTestError.ts", () =>
    {
        runner.testType("BasicTestError", () =>
        {
            runner.testFunction("create()", () =>
            {
                function createErrorTest(error: unknown, expected: Error): void
                {
                    runner.test(`with ${runner.toString(error)}`, (test: Test) =>
                    {
                        test.assertThrows(() => BasicTestError.create(error), expected);
                    });
                }

                createErrorTest(undefined, new PreConditionError(
                    "Expression: error",
                    "Expected: not undefined and not null",
                    "Actual: undefined",
                ));
                createErrorTest(null, new PreConditionError(
                    "Expression: error",
                    "Expected: not undefined and not null",
                    "Actual: null",
                ));

                runner.test(`with ${runner.toString("hello there")}`, (test: Test) =>
                {
                    const testError: BasicTestError = BasicTestError.create("hello there");
                    test.assertNotUndefinedAndNotNull(testError);
                    test.assertEqual("hello there", testError.getError());
                    test.assertEqual("hello there", testError.getErrorString());
                });

                runner.test(`with ${runner.toString(20)}`, (test: Test) =>
                {
                    const testError: BasicTestError = BasicTestError.create(20);
                    test.assertNotUndefinedAndNotNull(testError);
                    test.assertEqual(20, testError.getError());
                    test.assertEqual("20", testError.getErrorString());
                });

                runner.test(`with generic Error`, (test: Test) =>
                {
                    const error: Error = new Error("I'm an error!");
                    const testError: BasicTestError = BasicTestError.create(error);
                    test.assertNotUndefinedAndNotNull(testError);
                    test.assertSame(error, testError.getError());

                    const errorString: string = testError.getErrorString();
                    test.assertTrue(errorString.includes("Error: I'm an error!"));
                    test.assertTrue(errorString.includes("tests/BasicTestErrorTests.ts:"));
                    test.assertTrue(errorString.includes("tests/consoleTestRunner.ts:"));
                });

                runner.test(`with TypeError`, (test: Test) =>
                {
                    const error: TypeError = new TypeError("Oops! Type error!");
                    const testError: BasicTestError = BasicTestError.create(error);
                    test.assertNotUndefinedAndNotNull(testError);
                    test.assertSame(error, testError.getError());

                    const errorString: string = testError.getErrorString();
                    test.assertTrue(errorString.includes("TypeError: Oops! Type error!"));
                    test.assertTrue(errorString.includes("tests/BasicTestErrorTests.ts:"));
                    test.assertTrue(errorString.includes("tests/consoleTestRunner.ts:"));
                });

                runner.test(`with test failure error`, (test: Test) =>
                {
                    let testError: BasicTestError | undefined;
                    try
                    {
                        test.assertEqual(1, 2);
                    }
                    catch (error)
                    {
                        testError = BasicTestError.create(error);
                    }
                    test.assertNotUndefinedAndNotNull(testError);

                    const errorString: string = testError.getErrorString();
                    test.assertTrue(errorString.includes("AssertionError [ERR_ASSERTION]: Expected values to be strictly deep-equal:"));
                    test.assertTrue(errorString.includes("1 !== 2"));
                    test.assertTrue(errorString.includes("tests/BasicTestErrorTests.ts:"));
                    test.assertTrue(errorString.includes("tests/consoleTestRunner.ts:"));
                });
            });

            runner.testFunction("removeNonProjectPaths()", () =>
            {
                runner.test("with 'node:internal' file reference in stack trace", (test: Test) =>
                {
                    const errorStringLines: string[] = [
                        "AssertionError [ERR_ASSERTION]: Expected values to be strictly deep-equal:",
                        "",
                        "  5 !== 6",
                        "",
                        "      at _AssertTest.assertEqual (file:///C:/my/code/common-typescript/tests/assertTest.ts:76:16)",
                        "      at file:///C:/my/code/common-typescript/tests/BasicTestErrorTests.ts:97:26",
                        "      at file:///C:/my/code/common-typescript/tests/consoleTestRunner.ts:498:31",
                        "      at processTicksAndRejections (node:internal/process/task_queues:104:5)",
                        "      at _TestAction.action (file:///C:/my/code/common-typescript/tests/consoleTestRunner.ts:178:17)",
                        "      at _ConsoleTestRunner.runAsync (file:///C:/my/code/common-typescript/tests/consoleTestRunner.ts:531:17)",
                        "      at file:///C:/my/code/common-typescript/tests/consoleTestRunner.ts:112:13",
                        "      at _CurrentProcess.run (file:///C:/my/code/common-typescript/sources/currentProcess.ts:39:43)",
                        "      at tests (file:///C:/my/code/common-typescript/tests/tests.ts:60:5)",
                    ];
                    const currentFolderPath: string = "C:/my/code/";

                    const expectedLines: string[] = [
                        "AssertionError [ERR_ASSERTION]: Expected values to be strictly deep-equal:",
                        "",
                        "  5 !== 6",
                        "",
                        "      at _AssertTest.assertEqual (file:///C:/my/code/common-typescript/tests/assertTest.ts:76:16)",
                        "      at file:///C:/my/code/common-typescript/tests/BasicTestErrorTests.ts:97:26",
                        "      at file:///C:/my/code/common-typescript/tests/consoleTestRunner.ts:498:31",
                        "      at _TestAction.action (file:///C:/my/code/common-typescript/tests/consoleTestRunner.ts:178:17)",
                        "      at _ConsoleTestRunner.runAsync (file:///C:/my/code/common-typescript/tests/consoleTestRunner.ts:531:17)",
                        "      at file:///C:/my/code/common-typescript/tests/consoleTestRunner.ts:112:13",
                        "      at _CurrentProcess.run (file:///C:/my/code/common-typescript/sources/currentProcess.ts:39:43)",
                        "      at tests (file:///C:/my/code/common-typescript/tests/tests.ts:60:5)",
                    ];

                    const result: string = BasicTestError.removeNonProjectPaths(errorStringLines.join("\n"), currentFolderPath);
                    test.assertEqual(expectedLines, result.split("\n"));
                });

                runner.test("with Windows file paths and 'node_modules' references in stack trace", (test: Test) =>
                {
                    const errorStringLines: string[] = [
                        "AssertionError [ERR_ASSERTION]: Expected values to be strictly deep-equal:",
                        "",
                        "  1 !== 2",
                        "",
                        "      at _AssertTest.assertEqual (C:\\my\\code\\cli-typescript\\node_modules\\@everyonesoftware\\common\\tests\\assertTest.ts:76:16)",
                        "      at C:\\my\\code\\cli-typescript\\tests\\mainTests.ts:9:18",
                        "      at C:\\my\\code\\cli-typescript\\node_modules\\@everyonesoftware\\common\\tests\\consoleTestRunner.ts:498:31",
                        "      at processTicksAndRejections (node:internal/process/task_queues:104:5)",
                        "      at _TestAction.action (C:\\my\\code\\cli-typescript\\node_modules\\@everyonesoftware\\common\\tests\\consoleTestRunner.ts:178:17)",
                        "      at _ConsoleTestRunner.runAsync (C:\\my\\code\\cli-typescript\\node_modules\\@everyonesoftware\\common\\tests\\consoleTestRunner.ts:531:17)",
                        "      at C:\\my\\code\\cli-typescript\\node_modules\\@everyonesoftware\\common\\tests\\consoleTestRunner.ts:112:13",
                        "      at _CurrentProcess.run (C:\\my\\code\\cli-typescript\\node_modules\\@everyonesoftware\\common\\sources\\currentProcess.ts:39:43)",
                        "      at test2 (C:\\my\\code\\cli-typescript\\tests\\tests.ts:6:5)",
                    ];
                    const currentFolderPath: string = "C:/my/code/cli-typescript/";

                    const expectedLines: string[] = [
                        "AssertionError [ERR_ASSERTION]: Expected values to be strictly deep-equal:",
                        "",
                        "  1 !== 2",
                        "",
                        "      at C:\\my\\code\\cli-typescript\\tests\\mainTests.ts:9:18",
                        "      at test2 (C:\\my\\code\\cli-typescript\\tests\\tests.ts:6:5)",
                    ];

                    const result: string = BasicTestError.removeNonProjectPaths(errorStringLines.join("\n"), currentFolderPath);
                    test.assertEqual(expectedLines, result.split("\n"));
                });
            });

            runner.testFunction("makeFilePathsRelative()", () =>
            {
                runner.test("with 'file:///' URLs and a 'node:internal' path", (test: Test) =>
                {
                    const errorStringLines: string[] = [
                        "AssertionError [ERR_ASSERTION]: Expected values to be strictly deep-equal:",
                        "",
                        "  5 !== 6",
                        "",
                        "      at _AssertTest.assertEqual (file:///C:/my/code/common-typescript/tests/assertTest.ts:76:16)",
                        "      at file:///C:/my/code/common-typescript/tests/BasicTestErrorTests.ts:97:26",
                        "      at file:///C:/my/code/common-typescript/tests/consoleTestRunner.ts:498:31",
                        "      at processTicksAndRejections (node:internal/process/task_queues:104:5)",
                        "      at _TestAction.action (file:///C:/my/code/common-typescript/tests/consoleTestRunner.ts:178:17)",
                        "      at _ConsoleTestRunner.runAsync (file:///C:/my/code/common-typescript/tests/consoleTestRunner.ts:531:17)",
                        "      at file:///C:/my/code/common-typescript/tests/consoleTestRunner.ts:112:13",
                        "      at _CurrentProcess.run (file:///C:/my/code/common-typescript/sources/currentProcess.ts:39:43)",
                        "      at tests (file:///C:/my/code/common-typescript/tests/tests.ts:60:5)",
                    ];
                    const currentFolderPath: string = "C:/my/code/common-typescript/";

                    const expectedLines: string[] = [
                        "AssertionError [ERR_ASSERTION]: Expected values to be strictly deep-equal:",
                        "",
                        "  5 !== 6",
                        "",
                        "      at _AssertTest.assertEqual (tests/assertTest.ts:76:16)",
                        "      at tests/BasicTestErrorTests.ts:97:26",
                        "      at tests/consoleTestRunner.ts:498:31",
                        "      at processTicksAndRejections (node:internal/process/task_queues:104:5)",
                        "      at _TestAction.action (tests/consoleTestRunner.ts:178:17)",
                        "      at _ConsoleTestRunner.runAsync (tests/consoleTestRunner.ts:531:17)",
                        "      at tests/consoleTestRunner.ts:112:13",
                        "      at _CurrentProcess.run (sources/currentProcess.ts:39:43)",
                        "      at tests (tests/tests.ts:60:5)",
                    ];

                    const result: string = BasicTestError.makeFilePathsRelative(errorStringLines.join("\n"), currentFolderPath);
                    test.assertEqual(expectedLines, result.split("\n"));
                });

                runner.test("with Windows absolute file paths and a 'node:internal' path", (test: Test) =>
                {
                    const errorStringLines: string[] = [
                        "AssertionError [ERR_ASSERTION]: Expected values to be strictly deep-equal:",
                        "",
                        "  5 !== 6",
                        "",
                        "      at _AssertTest.assertEqual (C:/my/code/common-typescript/tests/assertTest.ts:76:16)",
                        "      at C:/my/code/common-typescript/tests/BasicTestErrorTests.ts:97:26",
                        "      at C:/my/code/common-typescript/tests/consoleTestRunner.ts:498:31",
                        "      at processTicksAndRejections (node:internal/process/task_queues:104:5)",
                        "      at _TestAction.action (C:/my/code/common-typescript/tests/consoleTestRunner.ts:178:17)",
                        "      at _ConsoleTestRunner.runAsync (C:/my/code/common-typescript/tests/consoleTestRunner.ts:531:17)",
                        "      at C:/my/code/common-typescript/tests/consoleTestRunner.ts:112:13",
                        "      at _CurrentProcess.run (C:/my/code/common-typescript/sources/currentProcess.ts:39:43)",
                        "      at tests (C:/my/code/common-typescript/tests/tests.ts:60:5)",
                    ];
                    const currentFolderPath: string = "C:/my/code/common-typescript/";

                    const expectedLines: string[] = [
                        "AssertionError [ERR_ASSERTION]: Expected values to be strictly deep-equal:",
                        "",
                        "  5 !== 6",
                        "",
                        "      at _AssertTest.assertEqual (tests/assertTest.ts:76:16)",
                        "      at tests/BasicTestErrorTests.ts:97:26",
                        "      at tests/consoleTestRunner.ts:498:31",
                        "      at processTicksAndRejections (node:internal/process/task_queues:104:5)",
                        "      at _TestAction.action (tests/consoleTestRunner.ts:178:17)",
                        "      at _ConsoleTestRunner.runAsync (tests/consoleTestRunner.ts:531:17)",
                        "      at tests/consoleTestRunner.ts:112:13",
                        "      at _CurrentProcess.run (sources/currentProcess.ts:39:43)",
                        "      at tests (tests/tests.ts:60:5)",
                    ];

                    const result: string = BasicTestError.makeFilePathsRelative(errorStringLines.join("\n"), currentFolderPath);
                    test.assertEqual(expectedLines, result.split("\n"));
                });

                runner.test("with Unix absolute file paths and a 'node:internal' path", (test: Test) =>
                {
                    const errorStringLines: string[] = [
                        "AssertionError [ERR_ASSERTION]: Expected values to be strictly deep-equal:",
                        "",
                        "  5 !== 6",
                        "",
                        "      at _AssertTest.assertEqual (/my/code/common-typescript/tests/assertTest.ts:76:16)",
                        "      at /my/code/common-typescript/tests/BasicTestErrorTests.ts:97:26",
                        "      at /my/code/common-typescript/tests/consoleTestRunner.ts:498:31",
                        "      at processTicksAndRejections (node:internal/process/task_queues:104:5)",
                        "      at _TestAction.action (/my/code/common-typescript/tests/consoleTestRunner.ts:178:17)",
                        "      at _ConsoleTestRunner.runAsync (/my/code/common-typescript/tests/consoleTestRunner.ts:531:17)",
                        "      at /my/code/common-typescript/tests/consoleTestRunner.ts:112:13",
                        "      at _CurrentProcess.run (/my/code/common-typescript/sources/currentProcess.ts:39:43)",
                        "      at tests (/my/code/common-typescript/tests/tests.ts:60:5)",
                    ];
                    const currentFolderPath: string = "/my/code/common-typescript/";

                    const expectedLines: string[] = [
                        "AssertionError [ERR_ASSERTION]: Expected values to be strictly deep-equal:",
                        "",
                        "  5 !== 6",
                        "",
                        "      at _AssertTest.assertEqual (tests/assertTest.ts:76:16)",
                        "      at tests/BasicTestErrorTests.ts:97:26",
                        "      at tests/consoleTestRunner.ts:498:31",
                        "      at processTicksAndRejections (node:internal/process/task_queues:104:5)",
                        "      at _TestAction.action (tests/consoleTestRunner.ts:178:17)",
                        "      at _ConsoleTestRunner.runAsync (tests/consoleTestRunner.ts:531:17)",
                        "      at tests/consoleTestRunner.ts:112:13",
                        "      at _CurrentProcess.run (sources/currentProcess.ts:39:43)",
                        "      at tests (tests/tests.ts:60:5)",
                    ];

                    const result: string = BasicTestError.makeFilePathsRelative(errorStringLines.join("\n"), currentFolderPath);
                    test.assertEqual(expectedLines, result.split("\n"));
                });
            });
        });
    });
}