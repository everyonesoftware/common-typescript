import { Condition } from "../sources/condition.js";
import { JavascriptIterable } from "../sources/javascript.js";
import { MutableCondition } from "../sources/mutableCondition.js";
import { PreConditionError } from "../sources/preConditionError.js";
import { join } from "../sources/strings.js";
import { Test } from "./test.js";
import { TestRunner } from "./testRunner.js";

export function test(runner: TestRunner): void
{
    runner.testFile("condition.ts", () =>
    {
        runner.testType("Condition", () =>
        {
            runner.testFunction("create()", (test: Test) =>
            {
                const condition: MutableCondition = Condition.create();
                test.assertNotUndefinedAndNotNull(condition);
                test.assertThrows(() => condition.assertFalse(true),
                    new Error([
                        "Expected: false",
                        "Actual:   true",
                    ].join("\n")));
            });

            runner.testFunction("assertUndefined(unknown,string?,string?)", () =>
            {
                runner.test("with undefined", () =>
                {
                    const condition: MutableCondition = Condition.create();
                    condition.assertUndefined(undefined, "fake-expression", "fake-message");
                });

                function assertUndefinedErrorTest(value: unknown, expected: Error): void
                {
                    runner.test(`with ${runner.toString(value)}`, (test: Test) =>
                    {
                        const condition: MutableCondition = Condition.create();
                        test.assertThrows(() => condition.assertUndefined(value), expected);
                    });
                }

                assertUndefinedErrorTest(
                    null,
                    new Error(join("\n", [
                        "Expected: undefined",
                        "Actual:   null",
                    ])));
                assertUndefinedErrorTest(
                    "",
                    new Error(join("\n", [
                        "Expected: undefined",
                        "Actual:   \"\"",
                    ])));
                assertUndefinedErrorTest(
                    50,
                    new Error(join("\n", [
                        "Expected: undefined",
                        "Actual:   50",
                    ])));
            });

            runner.testFunction("assertNotUndefinedAndNotNull<T>(undefined|null|T,string?,string?)", () =>
            {
                runner.test("with undefined", (test: Test) =>
                {
                    const condition: MutableCondition = Condition.create();
                    test.assertThrows(() => condition.assertNotUndefinedAndNotNull(undefined),
                        new Error([
                            "Expected: not undefined and not null",
                            "Actual:   undefined",
                        ].join("\n")));
                });

                runner.test("with null", (test: Test) =>
                {
                    const condition: MutableCondition = Condition.create();
                    test.assertThrows(() => condition.assertNotUndefinedAndNotNull(null),
                        new Error([
                            "Expected: not undefined and not null",
                            "Actual:   null",
                        ].join("\n")));
                });

                runner.test("with not undefined and not null", (test: Test) =>
                {
                    function valueCreator(): string | undefined
                    {
                        return "hello";
                    }

                    const condition: MutableCondition = Condition.create();
                    const value: string | undefined = valueCreator();
                    condition.assertNotUndefinedAndNotNull(value);
                    test.assertEqual(value.substring(1, 3), "el");
                });

                runner.test("with undefined and expression", (test: Test) =>
                {
                    const condition: MutableCondition = Condition.create();
                    test.assertThrows(() => condition.assertNotUndefinedAndNotNull(undefined, "fake-expression"),
                        new Error([
                            "Expression: fake-expression",
                            "Expected:   not undefined and not null",
                            "Actual:     undefined"
                        ].join("\n")));
                });

                runner.test("with null, expression, and message", (test: Test) =>
                {
                    const condition: MutableCondition = Condition.create();
                    test.assertThrows(() => condition.assertNotUndefinedAndNotNull(null, "fake-expression", "fake-message"),
                        new Error([
                            "Message:    fake-message",
                            "Expression: fake-expression",
                            "Expected:   not undefined and not null",
                            "Actual:     null"
                        ].join("\n")));
                });
            });

            runner.testFunction("assertTrue(boolean)", () =>
            {
                runner.test("with false", (test: Test) =>
                {
                    const condition: MutableCondition = Condition.create();
                    test.assertThrows(() => condition.assertTrue(false),
                        new Error([
                            "Expected: true",
                            "Actual:   false",
                        ].join("\n")));
                });

                runner.test("with true", (test: Test) =>
                {
                    function valueCreator(): boolean { return true; }
                    const condition: MutableCondition = Condition.create();
                    const value: boolean = valueCreator();
                    condition.assertTrue(value);
                    test.assertTrue(value);
                });
            });

            runner.testFunction("assertFalse(boolean)", () =>
            {
                runner.test("with true", (test: Test) =>
                {
                    const condition: MutableCondition = Condition.create();
                    test.assertThrows(() => condition.assertFalse(true),
                        new Error([
                            "Expected: false",
                            "Actual:   true",
                        ].join("\n")));
                });

                runner.test("with false", (test: Test) =>
                {
                    function valueCreator(): boolean { return false; }
                    const condition: MutableCondition = Condition.create();
                    const value: boolean = valueCreator();
                    condition.assertFalse(value);
                    test.assertFalse(value);
                });
            });

            runner.testFunction("assertSame<T>(T,T,string?,string?)", () =>
            {
                function assertSameErrorTest<T>(expected: T, actual: T, expression: string | undefined, message: string | undefined, expectedError: Error): void
                {
                    runner.test(`with ${runner.andList([expected, actual, expression, message])}`, (test: Test) =>
                    {
                        const condition: MutableCondition = Condition.create();
                        test.assertThrows(() => condition.assertSame(expected, actual, expression, message), expectedError);
                    });
                }
                
                assertSameErrorTest(
                    undefined,
                    null,
                    "fake-expression",
                    "fake-message",
                    new Error(join("\n", [
                        "Message:    fake-message",
                        "Expression: fake-expression",
                        "Expected:   undefined",
                        "Actual:     null",
                    ])));
                assertSameErrorTest(
                    3,
                    4,
                    "fake-expression",
                    "fake-message",
                    new Error(join("\n", [
                        "Message:    fake-message",
                        "Expression: fake-expression",
                        "Expected:   3",
                        "Actual:     4",
                    ])));
                assertSameErrorTest(
                    {},
                    {},
                    "fake-expression",
                    "fake-message",
                    new Error(join("\n", [
                        "Message:    fake-message",
                        "Expression: fake-expression",
                        "Expected:   {}",
                        "Actual:     {}",
                    ])));
                assertSameErrorTest(
                    { "a": "b" },
                    { "a": "b" },
                    "fake-expression",
                    "fake-message",
                    new Error(join("\n", [
                        "Message:    fake-message",
                        "Expression: fake-expression",
                        "Expected:   {\"a\":\"b\"}",
                        "Actual:     {\"a\":\"b\"}",
                    ])));
                assertSameErrorTest(
                    [],
                    [],
                    "fake-expression",
                    "fake-message",
                    new Error(join("\n", [
                        "Message:    fake-message",
                        "Expression: fake-expression",
                        "Expected:   []",
                        "Actual:     []",
                    ])));

                function assertSameTest<T>(expected: T, actual: T, expression: string | undefined, message: string | undefined): void
                {
                    runner.test(`with ${runner.andList([expected, actual, expression, message])}`, (_test: Test) =>
                    {
                        const condition: MutableCondition = Condition.create();
                        condition.assertSame(expected, actual, expression, message);
                    });
                }

                assertSameTest(undefined, undefined, "fake-expression", "fake-message");
                assertSameTest(null, null, "fake-expression", "fake-message");
                assertSameTest(0, 0, "fake-expression", "fake-message");
                assertSameTest(10, 10, "fake-expression", "fake-message");
                assertSameTest(true, true, "fake-expression", "fake-message");
                assertSameTest("abc", "abc", "fake-expression", "fake-message");
                
                const o = {};
                assertSameTest(o, o, "fake-expression", "fake-message");
            });

            runner.testFunction("assertNotSame<T>(T,T,string?,string?)", () =>
            {
                function assertNotSameErrorTest<T>(expected: T, actual: T, expression: string | undefined, message: string | undefined, expectedError: Error): void
                {
                    runner.test(`with ${runner.andList([expected, actual, expression, message])}`, (test: Test) =>
                    {
                        const condition: MutableCondition = Condition.create();
                        test.assertThrows(() => condition.assertNotSame(expected, actual, expression, message), expectedError);
                    });
                }

                assertNotSameErrorTest(
                    undefined,
                    undefined,
                    "fake-expression",
                    "fake-message",
                    new Error(join("\n", [
                        "Message:    fake-message",
                        "Expression: fake-expression",
                        "Expected:   not undefined",
                        "Actual:     undefined",
                    ])));
                assertNotSameErrorTest(
                    null,
                    null,
                    "fake-expression",
                    "fake-message",
                    new Error(join("\n", [
                        "Message:    fake-message",
                        "Expression: fake-expression",
                        "Expected:   not null",
                        "Actual:     null",
                    ])));
                assertNotSameErrorTest(
                    0,
                    0,
                    "fake-expression",
                    "fake-message",
                    new Error(join("\n", [
                        "Message:    fake-message",
                        "Expression: fake-expression",
                        "Expected:   not 0",
                        "Actual:     0",
                    ])));
                assertNotSameErrorTest(
                    10,
                    10,
                    "fake-expression",
                    "fake-message",
                    new Error(join("\n", [
                        "Message:    fake-message",
                        "Expression: fake-expression",
                        "Expected:   not 10",
                        "Actual:     10",
                    ])));
                assertNotSameErrorTest(
                    true,
                    true,
                    "fake-expression",
                    "fake-message",
                    new Error(join("\n", [
                        "Message:    fake-message",
                        "Expression: fake-expression",
                        "Expected:   not true",
                        "Actual:     true",
                    ])));
                assertNotSameErrorTest(
                    "abc",
                    "abc",
                    "fake-expression",
                    "fake-message",
                    new Error(join("\n", [
                        "Message:    fake-message",
                        "Expression: fake-expression",
                        "Expected:   not \"abc\"",
                        "Actual:     \"abc\"",
                    ])));
                
                const o = {};
                assertNotSameErrorTest(
                    o,
                    o,
                    "fake-expression",
                    "fake-message",
                    new Error(join("\n", [
                        "Message:    fake-message",
                        "Expression: fake-expression",
                        "Expected:   not {}",
                        "Actual:     {}",
                    ])));

                function assertNotSameTest<T>(expected: T, actual: T, expression: string | undefined, message: string | undefined): void
                {
                    runner.test(`with ${runner.andList([expected, actual, expression, message])}`, (_test: Test) =>
                    {
                        const condition: MutableCondition = Condition.create();
                        condition.assertNotSame(expected, actual, expression, message);
                    });
                }

                assertNotSameTest(undefined, null, "fake-expression", "fake-message");
                assertNotSameTest(false, true, "fake-expression", "fake-message");
                assertNotSameTest(1, 2, "fake-expression", "fake-message");
                assertNotSameTest({}, {}, "fake-expression", "fake-message");
                assertNotSameTest({ "a": "b" }, { "a": "b" }, "fake-expression", "fake-message");
                assertNotSameTest([], [], "fake-expression", "fake-message");
            });

            runner.testFunction("assertNotEmpty(string,string?,string?)", () =>
            {
                function assertNotEmptyErrorTest(value: string, expression: string | undefined, message: string | undefined, expectedError: Error): void
                {
                    runner.test(`with ${runner.andList([value, expression, message])}`, (test: Test) =>
                    {
                        const condition: MutableCondition = Condition.create();
                        test.assertThrows(() => condition.assertNotEmpty(value, expression, message), expectedError);
                    });
                }

                assertNotEmptyErrorTest(undefined!, "fake-expression", "fake-message", new Error(join("\n", [
                    "Message:    fake-message",
                    "Expression: fake-expression",
                    "Expected:   not undefined and not null",
                    "Actual:     undefined",
                ])));
                assertNotEmptyErrorTest(null!, "fake-expression", "fake-message", new Error(join("\n", [
                    "Message:    fake-message",
                    "Expression: fake-expression",
                    "Expected:   not undefined and not null",
                    "Actual:     null",
                ])));
                assertNotEmptyErrorTest("", "fake-expression", "fake-message", new Error(join("\n", [
                    "Message:    fake-message",
                    "Expression: fake-expression",
                    "Expected:   not empty",
                    "Actual:     \"\"",
                ])));

                function assertNotEmptyTest(value: string, expression: string | undefined, message: string | undefined): void
                {
                    runner.test(`with ${runner.andList([value, expression, message])}`, (_test: Test) =>
                    {
                        const condition: MutableCondition = Condition.create();
                        condition.assertNotEmpty(value, expression, message);
                    });
                }

                assertNotEmptyTest(" ", "fake-expression", "fake-message");
                assertNotEmptyTest("a", "fake-expression", "fake-message");
            });

            runner.testFunction("assertLessThan(number,number,string?,string?)", () =>
            {
                function assertLessThanErrorTest(value: number, upperBound: number, expression: string | undefined, message: string | undefined, expectedError: Error): void
                {
                    runner.test(`with ${runner.andList([value, upperBound])}`, (test: Test) =>
                    {
                        const condition: MutableCondition = Condition.create();
                        test.assertThrows(() => condition.assertLessThan(value, upperBound, expression, message), expectedError);
                    });
                }

                assertLessThanErrorTest(-1, -1, undefined, undefined, new Error(join("\n", [
                    "Expected: less than -1",
                    "Actual:   -1",
                ])));
                assertLessThanErrorTest(0, 0, undefined, undefined, new Error(join("\n", [
                    "Expected: less than 0",
                    "Actual:   0",
                ])));
                assertLessThanErrorTest(2, 1, undefined, undefined, new Error(join("\n", [
                    "Expected: less than 1",
                    "Actual:   2",
                ])));
                assertLessThanErrorTest(2, 1, "fake-expression", "fake-message", new Error(join("\n", [
                    "Message:    fake-message",
                    "Expression: fake-expression",
                    "Expected:   less than 1",
                    "Actual:     2",
                ])));

                function assertLessThanTest(value: number, upperBound: number, expression?: string, message?: string): void
                {
                    runner.test(`with ${runner.andList([value, upperBound])}`, () =>
                    {
                        const condition: MutableCondition = Condition.create();
                        condition.assertLessThan(value, upperBound, expression, message);
                    });
                }

                assertLessThanTest(-10, -9);
                assertLessThanTest(-1, 0);
                assertLessThanTest(0, 1);
                assertLessThanTest(4, 5);
            });

            runner.testFunction("assertLessThanOrEqualTo(number,number,string?,string?)", () =>
            {
                function assertLessThanOrEqualToErrorTest(value: number, upperBound: number, expression: string | undefined, message: string | undefined, expectedError: Error): void
                {
                    runner.test(`with ${runner.andList([value, upperBound])}`, (test: Test) =>
                    {
                        const condition: MutableCondition = Condition.create();
                        test.assertThrows(() => condition.assertLessThanOrEqualTo(value, upperBound, expression, message), expectedError);
                    });
                }

                assertLessThanOrEqualToErrorTest(2, 1, undefined, undefined, new Error(join("\n", [
                    "Expected: less than or equal to 1",
                    "Actual:   2",
                ])));
                assertLessThanOrEqualToErrorTest(2, 1, "fake-expression", "fake-message", new Error(join("\n", [
                    "Message:    fake-message",
                    "Expression: fake-expression",
                    "Expected:   less than or equal to 1",
                    "Actual:     2",
                ])));

                function assertLessThanOrEqualToTest(value: number, upperBound: number, expression: string | undefined, message: string | undefined): void
                {
                    runner.test(`with ${runner.andList([value, upperBound])}`, () =>
                    {
                        const condition: MutableCondition = Condition.create();
                        condition.assertLessThanOrEqualTo(value, upperBound, expression, message);
                    });
                }

                assertLessThanOrEqualToTest(-10, -9, undefined, undefined);
                assertLessThanOrEqualToTest(-1, 0, undefined, undefined);
                assertLessThanOrEqualToTest(0, 1, undefined, undefined);
                assertLessThanOrEqualToTest(4, 5, undefined, undefined);
                assertLessThanOrEqualToTest(-1, -1, undefined, undefined);
                assertLessThanOrEqualToTest(0, 0, undefined, undefined);
                assertLessThanOrEqualToTest(1, 1, undefined, undefined);
            });

            runner.testFunction("assertGreaterThanOrEqualTo(number,number,string?,string?)", () =>
            {
                function assertGreaterThanOrEqualToErrorTest(value: number, lowerBound: number, expression: string | undefined, message: string | undefined, expectedError: Error): void
                {
                    runner.test(`with ${runner.andList([value, lowerBound])}`, (test: Test) =>
                    {
                        const condition: MutableCondition = Condition.create();
                        test.assertThrows(() => condition.assertGreaterThanOrEqualTo(value, lowerBound, expression, message), expectedError);
                    });
                }

                assertGreaterThanOrEqualToErrorTest(1, 2, undefined, undefined, new Error(join("\n", [
                    "Expected: greater than or equal to 2",
                    "Actual:   1",
                ])));
                assertGreaterThanOrEqualToErrorTest(1, 2, "fake-expression", "fake-message", new Error(join("\n", [
                    "Message:    fake-message",
                    "Expression: fake-expression",
                    "Expected:   greater than or equal to 2",
                    "Actual:     1",
                ])));

                function assertGreaterThanOrEqualToTest(value: number, lowerBound: number, expression?: string, message?: string): void
                {
                    runner.test(`with ${runner.andList([value, lowerBound])}`, (_test: Test) =>
                    {
                        const condition: MutableCondition = Condition.create();
                        condition.assertGreaterThanOrEqualTo(value, lowerBound, expression, message);
                    });
                }

                assertGreaterThanOrEqualToTest(-9, -10);
                assertGreaterThanOrEqualToTest(0, -1);
                assertGreaterThanOrEqualToTest(1, 0);
                assertGreaterThanOrEqualToTest(5, 4);
                assertGreaterThanOrEqualToTest(-1, -1);
                assertGreaterThanOrEqualToTest(0, 0);
                assertGreaterThanOrEqualToTest(1, 1);
            });

            runner.testFunction("assertGreaterThan(number,number,string?,string?)", () =>
            {
                function assertGreaterThanErrorTest(value: number, lowerBound: number, expression: string | undefined, message: string | undefined, expectedError: Error): void
                {
                    runner.test(`with ${runner.andList([value, lowerBound])}`, (test: Test) =>
                    {
                        const condition: MutableCondition = Condition.create();
                        test.assertThrows(() => condition.assertGreaterThan(value, lowerBound, expression, message), expectedError);
                    });
                }

                assertGreaterThanErrorTest(-1, -1, undefined, undefined, new Error(join("\n", [
                    "Expected: greater than -1",
                    "Actual:   -1",
                ])));
                assertGreaterThanErrorTest(0, 0, undefined, undefined, new Error(join("\n", [
                    "Expected: greater than 0",
                    "Actual:   0",
                ])));
                assertGreaterThanErrorTest(1, 2, undefined, undefined, new Error(join("\n", [
                    "Expected: greater than 2",
                    "Actual:   1",
                ])));
                assertGreaterThanErrorTest(1, 2, "fake-expression", "fake-message", new Error(join("\n", [
                    "Message:    fake-message",
                    "Expression: fake-expression",
                    "Expected:   greater than 2",
                    "Actual:     1",
                ])));

                function assertGreaterThanTest(value: number, lowerBound: number, expression?: string, message?: string): void
                {
                    runner.test(`with ${runner.andList([value, lowerBound])}`, (_test: Test) =>
                    {
                        const condition: MutableCondition = Condition.create();
                        condition.assertGreaterThan(value, lowerBound, expression, message);
                    });
                }

                assertGreaterThanTest(-9, -10);
                assertGreaterThanTest(0, -1);
                assertGreaterThanTest(1, 0);
                assertGreaterThanTest(5, 4);
            });

            runner.testFunction("assertBetween(number,number,number,string?,string?)", () =>
            {
                function assertBetweenErrorTest(lowerBound: number, value: number, upperBound: number, expression: string | undefined, message: string | undefined, expectedError: Error): void
                {
                    runner.test(`with ${runner.andList([lowerBound, value, upperBound])}`, (test: Test) =>
                    {
                        const condition: MutableCondition = Condition.create();
                        test.assertThrows(() => condition.assertBetween(lowerBound, value, upperBound, expression, message), expectedError);
                    });
                }

                assertBetweenErrorTest(0, 1, 0, undefined, undefined, new Error(join("\n", [
                    "Expected: 0",
                    "Actual:   1",
                ])));
                assertBetweenErrorTest(0, -1, 0, undefined, undefined, new Error(join("\n", [
                    "Expected: 0",
                    "Actual:   -1",
                ])));
                assertBetweenErrorTest(0, -1, 2, undefined, undefined, new Error(join("\n", [
                    "Expected: between 0 and 2",
                    "Actual:   -1",
                ])));
                assertBetweenErrorTest(0, 3, 2, undefined, undefined, new Error(join("\n", [
                    "Expected: between 0 and 2",
                    "Actual:   3",
                ])));
                assertBetweenErrorTest(5, 3, 2, "fake-expression", "fake-message", new Error(join("\n", [
                    "Expression: lowerBound",
                    "Expected:   less than or equal to 2",
                    "Actual:     5",
                ])));

                function assertBetweenTest(lowerBound: number, value: number, upperBound: number, expression?: string, message?: string): void
                {
                    runner.test(`with ${runner.andList([lowerBound, value, upperBound])}`, () =>
                    {
                        const condition: MutableCondition = Condition.create();
                        condition.assertBetween(lowerBound, value, upperBound, expression, message);
                    });
                }

                assertBetweenTest(-12, -11, -10);
                assertBetweenTest(-1, 0, 1);
                assertBetweenTest(0, 1, 2);
                assertBetweenTest(4, 5, 6);
                assertBetweenTest(0, 0, 0);
                assertBetweenTest(1, 1, 1);
            });

            runner.testFunction("assertAccessIndex(number,number,string?,string?)", () =>
            {
                function assertAccessIndexTest(index: number, count: number, expression?: string, message?: string): void
                {
                    runner.test(`with ${runner.andList([index, count])}`, (_test: Test) =>
                    {
                        const condition: MutableCondition = Condition.create();
                        condition.assertAccessIndex(index, count, expression, message);
                    });
                }

                assertAccessIndexTest(0, 1);
                assertAccessIndexTest(0, 2);
                assertAccessIndexTest(1, 2);

                function assertAccessIndexErrorTest(index: number, count: number, expression: string | undefined, message: string | undefined, expectedError: Error): void
                {
                    runner.test(`with ${runner.andList([index, count])}`, (test: Test) =>
                    {
                        const condition: MutableCondition = Condition.create();
                        test.assertThrows(() => condition.assertAccessIndex(index, count, expression, message), expectedError);
                    });
                }

                assertAccessIndexErrorTest(-1, 0, undefined, undefined, new Error(join("\n", [
                    "Expression: count",
                    "Expected:   greater than or equal to 1",
                    "Actual:     0",
                ])));
                assertAccessIndexErrorTest(0, 0, undefined, undefined, new Error(join("\n", [
                    "Expression: count",
                    "Expected:   greater than or equal to 1",
                    "Actual:     0",
                ])));
                assertAccessIndexErrorTest(1, 0, undefined, undefined, new Error(join("\n", [
                    "Expression: count",
                    "Expected:   greater than or equal to 1",
                    "Actual:     0",
                ])));
                assertAccessIndexErrorTest(-1, 1, undefined, undefined, new Error(join("\n", [
                    "Expected: 0",
                    "Actual:   -1",
                ])));
                assertAccessIndexErrorTest(1, 1, undefined, undefined, new Error(join("\n", [
                    "Expected: 0",
                    "Actual:   1",
                ])));
                assertAccessIndexErrorTest(-1, 2, undefined, undefined, new Error(join("\n", [
                    "Expected: between 0 and 1",
                    "Actual:   -1",
                ])));
                assertAccessIndexErrorTest(1, 1, "fake-expression", "fake-message", new Error(join("\n", [
                    "Message:    fake-message",
                    "Expression: fake-expression",
                    "Expected:   0",
                    "Actual:     1",
                ])));
                assertAccessIndexErrorTest(3, 2, "fake-expression", "fake-message", new Error(join("\n", [
                    "Message:    fake-message",
                    "Expression: fake-expression",
                    "Expected:   between 0 and 1",
                    "Actual:     3",
                ])));
            });

            runner.testFunction("assertInsertIndex(number,number,string?,string?)", () =>
            {
                function assertInsertIndexErrorTest(index: number, count: number, expression: string | undefined, message: string | undefined, expectedError: Error): void
                {
                    runner.test(`with ${runner.andList([index, count])}`, (test: Test) =>
                    {
                        const condition: MutableCondition = Condition.create();
                        test.assertThrows(() => condition.assertInsertIndex(index, count, expression, message), expectedError);
                    });
                }

                assertInsertIndexErrorTest(-1, 0, undefined, undefined, new Error(join("\n", [
                    "Expected: 0",
                    "Actual:   -1",
                ])));
                assertInsertIndexErrorTest(1, 0, undefined, undefined, new Error(join("\n", [
                    "Expected: 0",
                    "Actual:   1",
                ])));
                assertInsertIndexErrorTest(-1, 1, undefined, undefined, new Error(join("\n", [
                    "Expected: between 0 and 1",
                    "Actual:   -1",
                ])));
                assertInsertIndexErrorTest(2, 1, undefined, undefined, new Error(join("\n", [
                    "Expected: between 0 and 1",
                    "Actual:   2",
                ])));
                assertInsertIndexErrorTest(-1, 2, undefined, undefined, new Error(join("\n", [
                    "Expected: between 0 and 2",
                    "Actual:   -1",
                ])));
                assertInsertIndexErrorTest(2, 1, "fake-expression", "fake-message", new Error(join("\n", [
                    "Message:    fake-message",
                    "Expression: fake-expression",
                    "Expected:   between 0 and 1",
                    "Actual:     2",
                ])));
                assertInsertIndexErrorTest(3, 2, "fake-expression", "fake-message", new Error(join("\n", [
                    "Message:    fake-message",
                    "Expression: fake-expression",
                    "Expected:   between 0 and 2",
                    "Actual:     3",
                ])));

                function assertInsertIndexTest(index: number, count: number, expression?: string, message?: string): void
                {
                    runner.test(`with ${runner.andList([index, count])}`, (_test: Test) =>
                    {
                        const condition: MutableCondition = Condition.create();
                        condition.assertInsertIndex(index, count, expression, message);
                    });
                }

                assertInsertIndexTest(0, 0);
                assertInsertIndexTest(0, 1);
                assertInsertIndexTest(1, 1);
                assertInsertIndexTest(0, 2);
                assertInsertIndexTest(1, 2);
                assertInsertIndexTest(2, 2);
            });

            runner.testFunction("assertOneOf<T>(JavascriptIterable<T>,T,string?,string?)", () =>
            {
                function assertOneOfErrorTest<T>(possibilities: JavascriptIterable<T>, value: T, expression: string | undefined, message: string | undefined, expectedError: Error): void
                {
                    runner.test(`with ${runner.andList([possibilities, value, expression, message])}`, (test: Test) =>
                    {
                        const condition: MutableCondition = Condition.create();
                        test.assertThrows(() => condition.assertOneOf(possibilities, value, expression, message), expectedError);
                    });
                }

                assertOneOfErrorTest(
                    undefined!,
                    5,
                    undefined,
                    undefined,
                    new PreConditionError(
                        "Expression: possibilities",
                        "Expected:   not undefined and not null",
                        "Actual:     undefined",
                    ));
                assertOneOfErrorTest(
                    null!,
                    5,
                    undefined,
                    undefined,
                    new PreConditionError(
                        "Expression: possibilities",
                        "Expected:   not undefined and not null",
                        "Actual:     null",
                    ));
                assertOneOfErrorTest(
                    [],
                    5,
                    undefined,
                    undefined,
                    new PreConditionError(
                        "Expected: one of []",
                        "Actual:   5",
                    ));
                assertOneOfErrorTest(
                    [],
                    5,
                    "fake-expression",
                    "fake-message",
                    new PreConditionError(
                        "Message:    fake-message",
                        "Expression: fake-expression",
                        "Expected:   one of []",
                        "Actual:     5",
                    ));
                assertOneOfErrorTest(
                    [1, 2, 3],
                    5,
                    "fake-expression",
                    "fake-message",
                    new PreConditionError(
                        "Message:    fake-message",
                        "Expression: fake-expression",
                        "Expected:   one of [1,2,3]",
                        "Actual:     5",
                    ));

                function assertOneOfTest<T>(possibilities: JavascriptIterable<T>, value: T, expression?: string, message?: string): void
                {
                    runner.test(`with ${runner.andList([possibilities, value, expression, message])}`, (_test: Test) =>
                    {
                        const condition: MutableCondition = Condition.create();
                        condition.assertOneOf(possibilities, value, expression, message);
                    });
                }

                assertOneOfTest([5], 5);
                assertOneOfTest([1, 3, 5, 7], 5);
            });

            runner.testFunction("assertInteger(number,string?,string?)", () =>
            {
                function assertIntegerErrorTest(value: number, expected: Error): void
                {
                    runner.test(`with ${runner.toString(value)}`, (test: Test) =>
                    {
                        const condition: MutableCondition = Condition.create();
                        test.assertThrows(() => condition.assertInteger(value), expected);
                    });
                }

                assertIntegerErrorTest(
                    1.2,
                    new Error(join("\n", [
                        "Expected: integer",
                        "Actual:   1.2",
                    ])));
                assertIntegerErrorTest(
                    NaN,
                    new Error(join("\n", [
                        "Expected: integer",
                        "Actual:   NaN",
                    ])));
                assertIntegerErrorTest(
                    Infinity,
                    new Error(join("\n", [
                        "Expected: integer",
                        "Actual:   Infinity",
                    ])));
                assertIntegerErrorTest(
                    -Infinity,
                    new Error(join("\n", [
                        "Expected: integer",
                        "Actual:   -Infinity",
                    ])));

                function assertIntegerTest(value: number): void
                {
                    runner.test(`with ${value}`, (_test: Test) =>
                    {
                        const condition: MutableCondition = Condition.create();
                        condition.assertInteger(value);
                    });
                }

                assertIntegerTest(-1);
                assertIntegerTest(0);
                assertIntegerTest(1);
            });
        });
    });
}