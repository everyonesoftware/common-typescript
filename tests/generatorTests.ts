import { Generator } from "../sources/generator.js";
import { PreConditionError } from "../sources/preConditionError.js";
import { Test } from "./test.js";
import { TestRunner } from "./testRunner.js";
import { iteratorTests } from "./iteratorTests.js";

export function test(runner: TestRunner): void
{
    runner.testFile("generator.ts", () =>
    {
        runner.testType("Generator<T>", () =>
        {
            iteratorTests(runner, () => Generator.create(() => {}));

            runner.testFunction("create()", () =>
            {
                runner.test("with undefined", (test: Test) =>
                {
                    test.assertThrows(() => Generator.create(undefined!), new PreConditionError(
                        "Expression: generatorAction",
                        "Expected: not undefined and not null",
                        "Actual: undefined",
                    ));
                });

                runner.test("with null", (test: Test) =>
                {
                    test.assertThrows(() => Generator.create(null!), new PreConditionError(
                        "Expression: generatorAction",
                        "Expected: not undefined and not null",
                        "Actual: null",
                    ));
                });

                runner.test("with function that doesn't add any return values or return a value", (test: Test) =>
                {
                    const generator: Generator<void> = Generator.create(() => {});
                    test.assertNotUndefinedAndNotNull(generator);
                    test.assertEqual([], generator.toArray().await());
                });

                runner.test("with function that returns a constant value", (test: Test) =>
                {
                    const generator: Generator<number> = Generator.create(() => 20);
                    test.assertNotUndefinedAndNotNull(generator);
                    test.assertEqual([20, 20, 20, 20], generator.take(4).toArray().await());
                });

                runner.test("with function that returns an incrementing value", (test: Test) =>
                {
                    let value: number = 20;
                    const generator: Generator<number> = Generator.create(() => value++);
                    test.assertNotUndefinedAndNotNull(generator);
                    test.assertEqual([20, 21, 22, 23, 24], generator.take(5).toArray().await());
                });

                runner.test("with function that always adds a return value", (test: Test) =>
                {
                    const generator: Generator<number> = Generator.create(control => control.addValue(20));
                    test.assertNotUndefinedAndNotNull(generator);
                    test.assertEqual([20, 20, 20, 20], generator.take(4).toArray().await());
                });

                runner.test("with function that always adds multiple return values", (test: Test) =>
                {
                    const generator: Generator<number> = Generator.create(control => { control.addValues([20, 21, 22]); });
                    test.assertNotUndefinedAndNotNull(generator);
                    test.assertEqual([20, 21, 22, 20, 21], generator.take(5).toArray().await());
                });

                runner.test("with function that always adds a return value and returns a value", (test: Test) =>
                {
                    const generator: Generator<number> = Generator.create(control =>
                    {
                        control.addValue(20);
                        test.assertTrue(control.hasCurrent());
                        test.assertEqual(20, control.getCurrent());
                        return 21;
                    });
                    test.assertNotUndefinedAndNotNull(generator);
                    test.assertEqual([20, 21, 20, 21, 20], generator.take(5).toArray().await());
                });
            });
        });
    });
}