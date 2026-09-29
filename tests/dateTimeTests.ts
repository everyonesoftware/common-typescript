import { DateTime, Duration, ParseError } from "../sources/index.js";
import { Test } from "./test.js";
import { TestRunner } from "./testRunner.js";

export function test(runner: TestRunner): void
{
    runner.testFile("dateTime.ts", () =>
    {
        runner.testType("DateTime", () =>
        {
            runner.testFunction("parse()", () =>
            {
                runner.test(`with "2025-03-14T20:18:30"`, (test: Test) =>
                {
                    const dateTime: DateTime = DateTime.parse("2025-03-14T20:18:30").await();
                    test.assertNotUndefinedAndNotNull(dateTime);
                    test.assertEqual(2025, dateTime.getYear());
                    test.assertEqual(3, dateTime.getMonth());
                    test.assertEqual(14, dateTime.getDay());
                    test.assertEqual(20, dateTime.getHour());
                    test.assertEqual(18, dateTime.getMinute());
                    test.assertEqual(30, dateTime.getSecond());
                    test.assertEqual("2025-03-14", dateTime.toDateString());
                    test.assertEqual("Mar 14", dateTime.toShortDateString());
                    test.assertEqual("2025-03-14T20:18:30.000-07:00", dateTime.toString());
                });

                runner.test(`with "2025-03-14"`, (test: Test) =>
                {
                    const dateTime: DateTime = DateTime.parse("2025-03-14").await();
                    test.assertNotUndefinedAndNotNull(dateTime);
                    test.assertEqual(2025, dateTime.getYear());
                    test.assertEqual(3, dateTime.getMonth());
                    test.assertEqual(14, dateTime.getDay());
                    test.assertEqual(0, dateTime.getHour());
                    test.assertEqual(0, dateTime.getMinute());
                    test.assertEqual(0, dateTime.getSecond());
                    test.assertEqual("2025-03-14", dateTime.toDateString());
                    test.assertEqual("Mar 14", dateTime.toShortDateString());
                    test.assertEqual("2025-03-14T00:00:00.000-07:00", dateTime.toString());
                });

                runner.test(`with "fake-date-time"`, (test: Test) =>
                {
                    test.assertThrows(() => DateTime.parse("fake-date-time").await(), new ParseError(
                        `Unable to parse "fake-date-time" into a DateTime.`,
                    ));
                });
            });

            runner.testFunction("minus()", () =>
            {
                function minusTest(leftText: string, rightText: string, expectedText: string): void
                {
                    runner.test(`with ${runner.andList([leftText, rightText])}`, (test: Test) =>
                    {
                        const left: DateTime = DateTime.parse(leftText).await();
                        const right: DateTime = DateTime.parse(rightText).await();
                        const result: Duration = left.minus(right);
                        test.assertEqual(result.toString(), expectedText);
                    });
                }

                minusTest("2026-09-28", "2026-09-28", "PT0S");
                minusTest("2026-09-28", "2026-09-29", "PT-86400S");
                minusTest("2026-09-28", "2026-10-01", "PT-259200S");
            });
        });
    });
}