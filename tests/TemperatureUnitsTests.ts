import { NotFoundError } from "../sources/notFoundError.js";
import { PreConditionError } from "../sources/preConditionError.js";
import { TemperatureUnits } from "../sources/TemperatureUnits.js";
import { Test } from "./test.js";
import { TestRunner } from "./testRunner.js";

export function test(runner: TestRunner): void
{
    runner.testFile("TemperatureUnits.ts", () =>
    {
        runner.testType("TemperatureUnits", () =>
        {
            runner.test("Fahrenheit", (test: Test) =>
            {
                const fahrenheit: TemperatureUnits = TemperatureUnits.Fahrenheit;
                test.assertNotUndefinedAndNotNull(fahrenheit);

                test.assertEqual("Fahrenheit", fahrenheit.getName());
                test.assertEqual("Fahrenheit", fahrenheit.toString());
                test.assertEqual("F", fahrenheit.getAbbreviation());
            });

            runner.test("Celsius", (test: Test) =>
            {
                const celsius: TemperatureUnits = TemperatureUnits.Celsius;
                test.assertNotUndefinedAndNotNull(celsius);

                test.assertEqual("Celsius", celsius.getName());
                test.assertEqual("Celsius", celsius.toString());
                test.assertEqual("C", celsius.getAbbreviation());
            });

            runner.test("Kelvin", (test: Test) =>
            {
                const kelvin: TemperatureUnits = TemperatureUnits.Kelvin;
                test.assertNotUndefinedAndNotNull(kelvin);

                test.assertEqual("Kelvin", kelvin.getName());
                test.assertEqual("Kelvin", kelvin.toString());
                test.assertEqual("K", kelvin.getAbbreviation());
            });

            runner.test("Rankine", (test: Test) =>
            {
                const rankine: TemperatureUnits = TemperatureUnits.Rankine;
                test.assertNotUndefinedAndNotNull(rankine);

                test.assertEqual("Rankine", rankine.getName());
                test.assertEqual("Rankine", rankine.toString());
                test.assertEqual("R", rankine.getAbbreviation());
            });

            runner.testFunction("parse()", () =>
            {
                function parseErrorTest(text: string, expected: Error): void
                {
                    runner.test(`with ${runner.toString(text)}`, (test: Test) =>
                    {
                        test.assertThrows(() => TemperatureUnits.parse(text).await(), expected);
                    });
                }

                parseErrorTest(undefined!, new PreConditionError(
                    "Expression: text",
                    "Expected:   not undefined and not null",
                    "Actual:     undefined",
                ));
                parseErrorTest(null!, new PreConditionError(
                    "Expression: text",
                    "Expected:   not undefined and not null",
                    "Actual:     null",
                ));
                parseErrorTest("", new PreConditionError(
                    "Expression: text",
                    "Expected:   not empty",
                    "Actual:     \"\"",
                ));
                parseErrorTest("a", new NotFoundError("No TemperatureUnits found for: \"a\""));
                parseErrorTest("b", new NotFoundError("No TemperatureUnits found for: \"b\""));

                function parseTest(text: string, expected: TemperatureUnits): void
                {
                    runner.test(`with ${runner.toString(text)}`, (test: Test) =>
                    {
                        test.assertSame(expected, TemperatureUnits.parse(text).await());
                    });
                }

                parseTest("Fahrenheit", TemperatureUnits.Fahrenheit);
                parseTest("FAHRENHEIT", TemperatureUnits.Fahrenheit);
                parseTest("fahrenheit", TemperatureUnits.Fahrenheit);
                parseTest("f", TemperatureUnits.Fahrenheit);
                parseTest("F", TemperatureUnits.Fahrenheit);

                parseTest("Celsius", TemperatureUnits.Celsius);
                parseTest("CELSIUS", TemperatureUnits.Celsius);
                parseTest("celsius", TemperatureUnits.Celsius);
                parseTest("c", TemperatureUnits.Celsius);
                parseTest("C", TemperatureUnits.Celsius);

                parseTest("Kelvin", TemperatureUnits.Kelvin);
                parseTest("KELVIN", TemperatureUnits.Kelvin);
                parseTest("kelvin", TemperatureUnits.Kelvin);
                parseTest("k", TemperatureUnits.Kelvin);
                parseTest("K", TemperatureUnits.Kelvin);

                parseTest("Rankine", TemperatureUnits.Rankine);
                parseTest("RANKINE", TemperatureUnits.Rankine);
                parseTest("rankine", TemperatureUnits.Rankine);
                parseTest("r", TemperatureUnits.Rankine);
                parseTest("R", TemperatureUnits.Rankine);
                parseTest("ra", TemperatureUnits.Rankine);
                parseTest("RA", TemperatureUnits.Rankine);
            });
        });
    });
}