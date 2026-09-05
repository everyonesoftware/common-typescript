import { isUndefinedOrNull, NotFoundError, PreConditionError, Temperature, TemperatureToStringOptions, TemperatureUnits } from "../sources/index.js";
import { Test } from "./test.js";
import { TestRunner } from "./testRunner.js";

export function test(runner: TestRunner): void
{
    runner.testFile("Temperature.ts", () =>
    {
        runner.testType("Temperature", () =>
        {
            runner.testFunction("create()", () =>
            {
                function createErrorTest(value: number, units: TemperatureUnits | string, expected: Error): void
                {
                    runner.test(`with ${runner.andList([value, units])}`, (test: Test) =>
                    {
                        test.assertThrows(() => Temperature.create(value, units), expected);
                    });
                }

                createErrorTest(undefined!, TemperatureUnits.Fahrenheit, new PreConditionError(
                    "Expression: value",
                    "Expected:   not undefined and not null",
                    "Actual:     undefined",
                ));
                createErrorTest(null!, TemperatureUnits.Fahrenheit, new PreConditionError(
                    "Expression: value",
                    "Expected:   not undefined and not null",
                    "Actual:     null",
                ));
                createErrorTest(5, undefined!, new PreConditionError(
                    "Expression: units",
                    "Expected:   not undefined and not null",
                    "Actual:     undefined",
                ));
                createErrorTest(5, null!, new PreConditionError(
                    "Expression: units",
                    "Expected:   not undefined and not null",
                    "Actual:     null",
                ));
                createErrorTest(5, "apples", new NotFoundError("No TemperatureUnits found for: \"apples\""));

                function createTest(value: number, units: TemperatureUnits): void
                {
                    runner.test(`with ${runner.andList([value, units])}`, (test: Test) =>
                    {
                        const temperature: Temperature = Temperature.create(value, units);
                        test.assertNotUndefinedAndNotNull(temperature);
                        test.assertEqual(value, temperature.getValue());
                        test.assertEqual(units, temperature.getUnits());
                    });
                }

                createTest(0, TemperatureUnits.Fahrenheit);
            });

            runner.testFunction("fahrenheit()", () =>
            {
                function fahrenheitErrorTest(value: number, expected: Error): void
                {
                    runner.test(`with ${runner.toString(value)}`, (test: Test) =>
                    {
                        test.assertThrows(() => Temperature.fahrenheit(value), expected);
                    });
                }

                fahrenheitErrorTest(undefined!, new PreConditionError(
                    "Expression: value",
                    "Expected:   not undefined and not null",
                    "Actual:     undefined",
                ));
                fahrenheitErrorTest(null!, new PreConditionError(
                    "Expression: value",
                    "Expected:   not undefined and not null",
                    "Actual:     null",
                ));

                function createTest(value: number): void
                {
                    runner.test(`with ${runner.toString(value)}`, (test: Test) =>
                    {
                        const temperature: Temperature = Temperature.fahrenheit(value);
                        test.assertNotUndefinedAndNotNull(temperature);
                        test.assertEqual(value, temperature.getValue());
                        test.assertEqual(TemperatureUnits.Fahrenheit, temperature.getUnits());
                    });
                }

                createTest(0);
                createTest(32);
                createTest(100);
                createTest(212);
                createTest(-20);
            });

            runner.testFunction("celsius()", () =>
            {
                function celsiusErrorTest(value: number, expected: Error): void
                {
                    runner.test(`with ${runner.toString(value)}`, (test: Test) =>
                    {
                        test.assertThrows(() => Temperature.celsius(value), expected);
                    });
                }

                celsiusErrorTest(undefined!, new PreConditionError(
                    "Expression: value",
                    "Expected:   not undefined and not null",
                    "Actual:     undefined",
                ));
                celsiusErrorTest(null!, new PreConditionError(
                    "Expression: value",
                    "Expected:   not undefined and not null",
                    "Actual:     null",
                ));

                function createTest(value: number): void
                {
                    runner.test(`with ${runner.toString(value)}`, (test: Test) =>
                    {
                        const temperature: Temperature = Temperature.celsius(value);
                        test.assertNotUndefinedAndNotNull(temperature);
                        test.assertEqual(value, temperature.getValue());
                        test.assertEqual(TemperatureUnits.Celsius, temperature.getUnits());
                    });
                }

                createTest(0);
                createTest(32);
                createTest(100);
                createTest(212);
                createTest(-20);
            });

            runner.testFunction("kelvin()", () =>
            {
                function kelvinErrorTest(value: number, expected: Error): void
                {
                    runner.test(`with ${runner.toString(value)}`, (test: Test) =>
                    {
                        test.assertThrows(() => Temperature.kelvin(value), expected);
                    });
                }

                kelvinErrorTest(undefined!, new PreConditionError(
                    "Expression: value",
                    "Expected:   not undefined and not null",
                    "Actual:     undefined",
                ));
                kelvinErrorTest(null!, new PreConditionError(
                    "Expression: value",
                    "Expected:   not undefined and not null",
                    "Actual:     null",
                ));

                function createTest(value: number): void
                {
                    runner.test(`with ${runner.toString(value)}`, (test: Test) =>
                    {
                        const temperature: Temperature = Temperature.kelvin(value);
                        test.assertNotUndefinedAndNotNull(temperature);
                        test.assertEqual(value, temperature.getValue());
                        test.assertEqual(TemperatureUnits.Kelvin, temperature.getUnits());
                    });
                }

                createTest(0);
                createTest(32);
                createTest(100);
                createTest(212);
                createTest(-20);
            });

            runner.testFunction("rankine()", () =>
            {
                function rankineErrorTest(value: number, expected: Error): void
                {
                    runner.test(`with ${runner.toString(value)}`, (test: Test) =>
                    {
                        test.assertThrows(() => Temperature.rankine(value), expected);
                    });
                }

                rankineErrorTest(undefined!, new PreConditionError(
                    "Expression: value",
                    "Expected:   not undefined and not null",
                    "Actual:     undefined",
                ));
                rankineErrorTest(null!, new PreConditionError(
                    "Expression: value",
                    "Expected:   not undefined and not null",
                    "Actual:     null",
                ));

                function createTest(value: number): void
                {
                    runner.test(`with ${runner.toString(value)}`, (test: Test) =>
                    {
                        const temperature: Temperature = Temperature.rankine(value);
                        test.assertNotUndefinedAndNotNull(temperature);
                        test.assertEqual(value, temperature.getValue());
                        test.assertEqual(TemperatureUnits.Rankine, temperature.getUnits());
                    });
                }

                createTest(0);
                createTest(32);
                createTest(100);
                createTest(212);
                createTest(-20);
            });

            runner.testFunction("convertTo()", () =>
            {
                function convertToErrorTest(temperature: Temperature, units: TemperatureUnits, expected: Error): void
                {
                    runner.test(`with ${runner.andList([temperature, units])}`, (test: Test) =>
                    {
                        test.assertThrows(() => temperature.convertTo(units).await(), expected);
                    });
                }

                convertToErrorTest(Temperature.celsius(0), undefined!, new PreConditionError(
                    "Expression: units",
                    "Expected:   not undefined and not null",
                    "Actual:     undefined",
                ));
                convertToErrorTest(Temperature.celsius(0), null!, new PreConditionError(
                    "Expression: units",
                    "Expected:   not undefined and not null",
                    "Actual:     null",
                ));

                function convertToTest(temperature: Temperature, units: TemperatureUnits, expectedConvertedValue: number, marginOfError?: number): void
                {
                    runner.test(`with ${runner.andList([temperature, units])}`, (test: Test) =>
                    {
                        const converted: Temperature = temperature.convertTo(units).await();
                        test.assertNotUndefinedAndNotNull(converted);
                        test.assertEqual(units, converted.getUnits());

                        const expected: Temperature = Temperature.create(expectedConvertedValue, units);
                        test.assertTrue(expected.equals(converted, marginOfError), `${expected} === ${converted}${isUndefinedOrNull(marginOfError) ? "" : ` (+-${marginOfError})`}`);
                    });
                }

                convertToTest(Temperature.fahrenheit(32), TemperatureUnits.Fahrenheit, 32);
                convertToTest(Temperature.fahrenheit(32), TemperatureUnits.Celsius, 0);
                convertToTest(Temperature.fahrenheit(32), TemperatureUnits.Kelvin, 273.15);
                convertToTest(Temperature.fahrenheit(32), TemperatureUnits.Rankine, 491.67);

                convertToTest(Temperature.celsius(100), TemperatureUnits.Celsius, 100);
                convertToTest(Temperature.celsius(100), TemperatureUnits.Fahrenheit, 212);
                convertToTest(Temperature.celsius(100), TemperatureUnits.Kelvin, 373.15);
                convertToTest(Temperature.celsius(100), TemperatureUnits.Rankine, 671.67, 0.00001);

                convertToTest(Temperature.kelvin(200), TemperatureUnits.Celsius, -73.15, 0.00001);
                convertToTest(Temperature.kelvin(200), TemperatureUnits.Fahrenheit, -99.67, 0.00001);
                convertToTest(Temperature.kelvin(200), TemperatureUnits.Kelvin, 200);
                convertToTest(Temperature.kelvin(200), TemperatureUnits.Rankine, 360);

                convertToTest(Temperature.rankine(300), TemperatureUnits.Celsius, -106.48333, 0.00001);
                convertToTest(Temperature.rankine(300), TemperatureUnits.Fahrenheit, -159.67, 0.00001);
                convertToTest(Temperature.rankine(300), TemperatureUnits.Kelvin, 166.66, 0.01);
                convertToTest(Temperature.rankine(300), TemperatureUnits.Rankine, 300);
            });

            runner.testFunction("toString()", () =>
            {
                function toStringTest(temperature: Temperature, expected: string): void
                {
                    runner.test(`with ${temperature}`, (test: Test) =>
                    {
                        test.assertEqual(expected, temperature.toString());
                    });
                }

                toStringTest(Temperature.fahrenheit(50), "50°F");

                function toStringWithOptionsTest(temperature: Temperature, options: TemperatureToStringOptions, expected: string): void
                {
                    runner.test(`with ${runner.toString([temperature, options])}`, (test: Test) =>
                    {
                        test.assertEqual(expected, temperature.toString(options));
                    });
                }

                toStringWithOptionsTest(Temperature.fahrenheit(50), {}, "50°F");
                toStringWithOptionsTest(Temperature.fahrenheit(50), { fractionDigits: 2 }, "50.00°F");
            });
        });
    });
}