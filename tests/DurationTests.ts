import { DateTime, Duration, ParseError, PreConditionError } from "../sources/index.js";
import { Test } from "./test.js";
import { TestRunner } from "./testRunner.js";

export function test(runner: TestRunner): void
{
    runner.testFile("Duration.ts", () =>
    {
        runner.testType("Duration", () =>
        {
            runner.testFunction("parse()", () =>
            {
                function parseErrorTest(text: string, expected: Error): void
                {
                    runner.test(`with ${runner.toString(text)}`, (test: Test) =>
                    {
                        test.assertThrows(() => Duration.parse(text).await(), expected);
                    });
                }

                parseErrorTest(undefined!, new PreConditionError({
                    expression: "text",
                    expected: "not undefined and not null",
                    actual: "undefined",
                }));
                parseErrorTest(null!, new PreConditionError({
                    expression: "text",
                    expected: "not undefined and not null",
                    actual: "null",
                }));
                parseErrorTest("", new PreConditionError({
                    expression: "text",
                    expected: "not empty",
                    actual: `""`,
                }));
                parseErrorTest("cats", new ParseError(`"cats" is not a valid Duration.`));

                function parseTest(text: string, expected?: { years?: number, months?: number, days?: number, hours?: number, minutes?: number, seconds?: number, milliseconds?: number }): void
                {
                    runner.test(`with ${runner.toString(text)}`, (test: Test) =>
                    {
                        const duration: Duration = Duration.parse(text).await();
                        test.assertNotUndefinedAndNotNull(duration);
                        test.assertEqual(duration.getYears(), expected?.years ?? 0);
                        test.assertEqual(duration.getMonths(), expected?.months ?? 0);
                        test.assertEqual(duration.getDays(), expected?.days ?? 0);
                        test.assertEqual(duration.getHours(), expected?.hours ?? 0);
                        test.assertEqual(duration.getMinutes(), expected?.minutes ?? 0);
                        test.assertEqual(duration.getSeconds(), expected?.seconds ?? 0);
                        test.assertEqual(duration.getMilliseconds(), expected?.milliseconds ?? 0);
                    });
                }

                parseTest("PT0S");
                parseTest("PT10S", { seconds: 10 });
                parseTest("P1Y3M7DT2H9M10S", { years: 1, months: 3, days: 7, hours: 2, minutes: 9, seconds: 10 });
            });

            runner.testFunction("toDays()", () =>
            {
                function toDaysTest(durationText: string, expected: number): void
                {
                    runner.test(`with ${runner.toString(durationText)}`, (test: Test) =>
                    {
                        const duration: Duration = Duration.parse(durationText).await();
                        test.assertEqual(duration.toDays(), expected);
                    });
                }

                toDaysTest("PT0S", 0);
                toDaysTest("PT1S", 0.000011574074074074073);
                toDaysTest("PT1M", 0.0006944444444444445);
                toDaysTest("PT12H", 0.5);
                toDaysTest("P1M", 30);
                toDaysTest("P1Y", 365);

                runner.test("with difference between 2 DateTimes", (test: Test) =>
                {
                    const left: DateTime = DateTime.parse("2026-10-01").await();
                    const right: DateTime = DateTime.parse("2026-09-28").await();
                    const duration: Duration = left.minus(right);
                    test.assertEqual(duration.toDays(), 3);
                });
            });
        });
    });
}