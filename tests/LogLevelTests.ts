import { Iterable, LogLevel, ParseError, PreConditionError } from "../sources/index.js";
import { Test } from "./test.js";
import { TestRunner } from "./testRunner.js";

export function test(runner: TestRunner): void
{
    runner.testFile("LogLevel.ts", () =>
    {
        runner.testType("LogLevel", () =>
        {
            runner.testFunction("parse()", () =>
            {
                function parseErrorTest(value: string, expected: Error): void
                {
                    runner.test(`with ${runner.toString(value)}`, (test: Test) =>
                    {
                        test.assertThrows(() => LogLevel.parse(value).await(), expected);
                    });
                }

                parseErrorTest(undefined!, new PreConditionError(
                    "Expression: value",
                    "Expected:   not undefined and not null",
                    "Actual:     undefined",
                ));
                parseErrorTest(null!, new PreConditionError(
                    "Expression: value",
                    "Expected:   not undefined and not null",
                    "Actual:     null",
                ));
                parseErrorTest("", new ParseError(`Could not parse "" into a LogLevel.`));
                parseErrorTest("apples", new ParseError(`Could not parse "apples" into a LogLevel.`));

                function parseTest(value: string, expected: LogLevel): void
                {
                    runner.test(`with ${runner.toString(value)}`, (test: Test) =>
                    {
                        const logLevel: LogLevel = LogLevel.parse(value).await();
                        test.assertSame(logLevel, expected);
                    });
                }

                parseTest("debug", LogLevel.Debug);
                parseTest("Debug", LogLevel.Debug);
                parseTest("DEBUG", LogLevel.Debug);

                parseTest("info", LogLevel.Info);
                parseTest("Info", LogLevel.Info);
                parseTest("INFO", LogLevel.Info);

                parseTest("warning", LogLevel.Warning);
                parseTest("Warning", LogLevel.Warning);
                parseTest("WARNING", LogLevel.Warning);

                parseTest("error", LogLevel.Error);
                parseTest("Error", LogLevel.Error);
                parseTest("ERROR", LogLevel.Error);
            });

            runner.testFunction("values()", (test: Test) =>
            {
                const logLevels: Iterable<LogLevel> = LogLevel.values();
                test.assertEqual(logLevels, Iterable.create([
                    LogLevel.Debug,
                    LogLevel.Info,
                    LogLevel.Warning,
                    LogLevel.Error,
                ]));
            });
        });
    });
}