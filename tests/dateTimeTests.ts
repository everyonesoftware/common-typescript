import { DateTime } from "../sources/dateTime";
import { Test } from "./test";
import { TestRunner } from "./testRunner";

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
                    const dateTime: DateTime = DateTime.parse("2025-03-14T20:18:30");
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
                    test.assertEqual("2025-03-14T20:18:30.000-07:00", dateTime.debug);
                });
            });
        });
    });
}