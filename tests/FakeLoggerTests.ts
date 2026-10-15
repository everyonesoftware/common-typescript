import { FakeLog, FakeLogger, Iterable, JavascriptIterable, LogLevel, PreConditionError } from "../sources/index.js";
import { Test } from "./test.js";
import { TestRunner } from "./testRunner.js";

export function test(runner: TestRunner): void
{
    runner.testFile("FakeLogger.ts", () =>
    {
        runner.testType("FakeLogger", () =>
        {
            runner.testFunction("create()", (test: Test) =>
            {
                const logger: FakeLogger = FakeLogger.create();
                test.assertNotUndefinedAndNotNull(logger);
                test.assertEqual(Iterable.create([]), logger.getLogs());
            });

            runner.testFunction("log()", () =>
            {
                function logMessageLevelErrorTest(message: string, logLevel: LogLevel | undefined, expected: Error): void
                {
                    runner.test(`with ${runner.andList([message, logLevel])}`, (test: Test) =>
                    {
                        const logger: FakeLogger = FakeLogger.create();

                        test.assertThrows(() => logger.log(message, logLevel), expected);

                        test.assertEqual(Iterable.create([]), logger.getLogs());
                    });
                }

                logMessageLevelErrorTest(undefined!, undefined, new PreConditionError({
                    expression: "message",
                    expectedString: "not undefined and not null",
                    actualString: "undefined",
                }));
                logMessageLevelErrorTest(null!, undefined, new PreConditionError({
                    expression: "message",
                    expectedString: "not undefined and not null",
                    actualString: "null",
                }));
                logMessageLevelErrorTest("", undefined, new PreConditionError({
                    expression: "message",
                    expectedString: "not empty",
                    actualString: `""`,
                }));

                function logMessageLevelTest(message: string, logLevel: LogLevel | undefined, expected: JavascriptIterable<FakeLog>): void
                {
                    runner.test(`with ${runner.andList([message, logLevel])}`, (test: Test) =>
                    {
                        const logger: FakeLogger = FakeLogger.create();

                        logger.log(message, logLevel);

                        test.assertEqual(Iterable.create(expected), logger.getLogs());
                    });
                }

                logMessageLevelTest("a", undefined, [FakeLog.create(LogLevel.Info, "a")]);
                logMessageLevelTest("b", null!, [FakeLog.create(LogLevel.Info, "b")]);
                logMessageLevelTest("c", LogLevel.Debug, [FakeLog.create(LogLevel.Debug, "c")]);

                function logLevelMessageErrorTest(logLevel: LogLevel, message: string, expected: Error): void
                {
                    runner.test(`with ${runner.andList([logLevel, message])}`, (test: Test) =>
                    {
                        const logger: FakeLogger = FakeLogger.create();

                        test.assertThrows(() => logger.log(logLevel, message), expected);

                        test.assertEqual(Iterable.create([]), logger.getLogs());
                    });
                }

                logLevelMessageErrorTest(undefined!, undefined!, new PreConditionError({
                    expression: "message",
                    expectedString: "not undefined and not null",
                    actualString: "undefined",
                }));
                logLevelMessageErrorTest(null!, undefined!, new PreConditionError({
                    expression: "message",
                    expectedString: "not undefined and not null",
                    actualString: "null",
                }));
                logLevelMessageErrorTest(LogLevel.Debug, undefined!, new PreConditionError({
                    expression: "message",
                    expectedString: "not undefined and not null",
                    actualString: "undefined",
                }));
                logLevelMessageErrorTest(LogLevel.Debug, null!, new PreConditionError({
                    expression: "message",
                    expectedString: "not undefined and not null",
                    actualString: "null",
                }));
                logLevelMessageErrorTest(LogLevel.Debug, "", new PreConditionError({
                    expression: "message",
                    expectedString: "not empty",
                    actualString: `""`,
                }));

                function logLevelMessageTest(logLevel: LogLevel, message: string, expected: JavascriptIterable<FakeLog>): void
                {
                    runner.test(`with ${runner.andList([logLevel, message])}`, (test: Test) =>
                    {
                        const logger: FakeLogger = FakeLogger.create();

                        logger.log(logLevel, message);

                        test.assertEqual(Iterable.create(expected), logger.getLogs());
                    });
                }

                logLevelMessageTest(LogLevel.Info, "a", [FakeLog.create(LogLevel.Info, "a")]);
                logLevelMessageTest(LogLevel.Warning, "b", [FakeLog.create(LogLevel.Warning, "b")]);
            });
        });
    });
}