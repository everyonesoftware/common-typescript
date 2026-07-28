import { DateTime, Duration, FakeClock, PreConditionError, Timer } from "../sources/index.js";
import { Test } from "./test.js";
import { TestRunner } from "./testRunner.js";

export function test(runner: TestRunner): void
{
    runner.testFile("FakeClock.ts", () =>
    {
        runner.testType("FakeClock", () =>
        {
            runner.testFunction("create()", () =>
            {
                function createErrorTest(currentTime: DateTime, expected: Error): void
                {
                    runner.test(`with ${runner.toString(currentTime)}`, (test: Test) =>
                    {
                        test.assertThrows(() => FakeClock.create(currentTime), expected);
                    });
                }

                createErrorTest(undefined!, new PreConditionError(
                    "Expression: currentTime",
                    "Expected: not undefined and not null",
                    "Actual: undefined",
                ));
                createErrorTest(null!, new PreConditionError(
                    "Expression: currentTime",
                    "Expected: not undefined and not null",
                    "Actual: null",
                ));

                function createTest(currentTime: DateTime): void
                {
                    runner.test(`with ${runner.toString(currentTime)}`, (test: Test) =>
                    {
                        const clock: FakeClock = FakeClock.create(currentTime);
                        test.assertNotUndefinedAndNotNull(clock);
                        test.assertEqual(currentTime, clock.getCurrent());
                    });
                }

                createTest(DateTime.parse("2035-01-02").await());
                createTest(DateTime.parse("1989-12-13").await());
            });

            runner.testFunction("setCurrent()", () =>
            {
                function setCurrentErrorTest(current: DateTime, expected: Error): void
                {
                    runner.test(`with ${runner.toString(current)}`, (test: Test) =>
                    {
                        const initial: DateTime = DateTime.parse("2026-03-12").await();
                        const clock: FakeClock = FakeClock.create(initial);
                        
                        test.assertThrows(() => clock.setCurrent(current), expected);

                        test.assertEqual(clock.getCurrent(), initial);
                    });
                }

                setCurrentErrorTest(undefined!, new PreConditionError(
                    "Expression: currentTime",
                    "Expected: not undefined and not null",
                    "Actual: undefined",
                ));
                setCurrentErrorTest(null!, new PreConditionError(
                    "Expression: currentTime",
                    "Expected: not undefined and not null",
                    "Actual: null",
                ));

                function setCurrentTest(current: DateTime): void
                {
                    runner.test(`with ${runner.toString(current)}`, (test: Test) =>
                    {
                        const initial: DateTime = DateTime.parse("2026-03-12").await();
                        const clock: FakeClock = FakeClock.create(initial);
                        
                        const setCurrentResult: FakeClock = clock.setCurrent(current);

                        test.assertSame(clock, setCurrentResult);
                        test.assertEqual(clock.getCurrent(), current);
                    });
                }

                setCurrentTest(DateTime.parse("2020-03-11").await());
                setCurrentTest(DateTime.parse("2050-11-01").await());
            });

            runner.testFunction("advanceCurrent()", () =>
            {
                function advanceCurrentErrorTest(duration: Duration, expected: Error): void
                {
                    runner.test(`with ${runner.toString(duration)}`, (test: Test) =>
                    {
                        const initial: DateTime = DateTime.parse("2026-03-12").await();
                        const clock: FakeClock = FakeClock.create(initial);
                        
                        test.assertThrows(() => clock.advanceCurrent(duration), expected);

                        test.assertEqual(clock.getCurrent(), initial);
                    });
                }

                advanceCurrentErrorTest(undefined!, new PreConditionError(
                    "Expression: duration",
                    "Expected: not undefined and not null",
                    "Actual: undefined",
                ));
                advanceCurrentErrorTest(null!, new PreConditionError(
                    "Expression: duration",
                    "Expected: not undefined and not null",
                    "Actual: null",
                ));

                function advanceCurrentTest(initial: DateTime, duration: Duration, expected: DateTime): void
                {
                    runner.test(`with ${runner.toString(duration)}`, (test: Test) =>
                    {
                        const clock: FakeClock = FakeClock.create(initial);
                        
                        const advanceCurrentResult: FakeClock = clock.advanceCurrent(duration);

                        test.assertSame(clock, advanceCurrentResult);
                        test.assertEqual(clock.getCurrent(), expected);
                    });
                }

                advanceCurrentTest(DateTime.parse("2020-03-11").await(), Duration.parse("P5D").await(), DateTime.parse("2020-03-16").await());
                advanceCurrentTest(DateTime.parse("2050-11-01").await(), Duration.parse("PT53M").await(), DateTime.parse("2050-11-01T00:53:00").await());
            });

            runner.testFunction("startTimer()", (test: Test) =>
            {
                const initialTime: DateTime = DateTime.parse("2029-07-19T07:30:00").await();
                const clock: FakeClock = FakeClock.create(initialTime);

                const timer: Timer = clock.startTimer();
                test.assertNotUndefinedAndNotNull(timer);
                test.assertEqual(initialTime, timer.getStartTime());
                test.assertEqual(Duration.zero().toSeconds(), timer.getDuration().toSeconds());

                const firstDuration: Duration = Duration.parse("PT21S").await();
                clock.advanceCurrent(firstDuration);
                test.assertEqual(initialTime, timer.getStartTime());
                test.assertEqual(firstDuration.toSeconds(), timer.getDuration().toSeconds());

                const secondDuration: Duration = Duration.parse("PT0.5S").await();
                clock.advanceCurrent(secondDuration);
                test.assertEqual(initialTime, timer.getStartTime());
                test.assertEqual(firstDuration.plus(secondDuration).toSeconds(), timer.getDuration().toSeconds());
            });
        });
    });
}