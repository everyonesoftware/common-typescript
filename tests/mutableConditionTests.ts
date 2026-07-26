

import { EqualFunctions } from "../sources/equalFunctions.js";
import { MutableCondition } from "../sources/mutableCondition.js";
import { PreConditionError } from "../sources/preConditionError.js";
import { join } from "../sources/strings.js";
import { ToStringFunctions } from "../sources/toStringFunctions.js";
import { isNumber, isString } from "../sources/types.js";
import { Test } from "./test.js";
import { TestRunner } from "./testRunner.js";

export function test(runner: TestRunner): void
{
    runner.testFile("mutableCondition.ts", () =>
    {
        runner.testType("MutableCondition", () =>
        {
            runner.testFunction("create()", (test: Test) =>
            {
                const mc: MutableCondition = MutableCondition.create();
                test.assertNotUndefinedAndNotNull(mc);
            });

            runner.testFunction("setToStringFunctions()", () =>
            {
                function setToStringFunctionsErrorTest(testName: string, toStringFunctions: ToStringFunctions, expected: Error): void
                {
                    runner.test(testName, (test: Test) =>
                    {
                        const mc: MutableCondition = MutableCondition.create();
                        test.assertThrows(() => mc.setToStringFunctions(toStringFunctions), expected);
                    });
                }

                setToStringFunctionsErrorTest("with undefined", undefined!, new PreConditionError(
                    "Expression: toStringFunctions",
                    "Expected: not undefined and not null",
                    "Actual: undefined",
                ));
                setToStringFunctionsErrorTest("with null", null!, new PreConditionError(
                    "Expression: toStringFunctions",
                    "Expected: not undefined and not null",
                    "Actual: null",
                ));

                runner.test("with valid value", (test: Test) =>
                {
                    const mc: MutableCondition = MutableCondition.create();
                    test.assertEqual(`"hello"`, mc.toValueString("hello"));

                    mc.setToStringFunctions(
                        ToStringFunctions.create()
                            .add(isString, (value: string) => `---${value}---`),
                    );
                    test.assertEqual(`---hello---`, mc.toValueString("hello"));
                });
            });

            runner.testFunction("setEqualFunctions()", () =>
            {
                function setEqualFunctionsErrorTest(testName: string, equalFunctions: EqualFunctions, expected: Error): void
                {
                    runner.test(testName, (test: Test) =>
                    {
                        const mc: MutableCondition = MutableCondition.create();
                        test.assertThrows(() => mc.setEqualFunctions(equalFunctions), expected);
                    });
                }

                setEqualFunctionsErrorTest("with undefined", undefined!, new PreConditionError(
                    "Expression: equalFunctions",
                    "Expected: not undefined and not null",
                    "Actual: undefined",
                ));
                setEqualFunctionsErrorTest("with null", null!, new PreConditionError(
                    "Expression: equalFunctions",
                    "Expected: not undefined and not null",
                    "Actual: null",
                ));

                runner.test("with valid value", (test: Test) =>
                {
                    const mc: MutableCondition = MutableCondition.create();
                    test.assertFalse(mc.areEqual(3, 5));
                    test.assertFalse(mc.areEqual(3, 4));
                    test.assertTrue(mc.areEqual(4, 4));

                    mc.setEqualFunctions(
                        EqualFunctions.create()
                            .add((left: unknown, right: unknown) =>
                            {
                                return isNumber(left) && isNumber(right)
                                    ? left % 2 === right % 2
                                    : undefined;
                            })
                    )

                    test.assertTrue(mc.areEqual(3, 5));
                    test.assertFalse(mc.areEqual(3, 4));
                    test.assertTrue(mc.areEqual(4, 4));
                });
            });

            runner.testFunction("setCreateErrorFunction()", () =>
            {
                function setCreateErrorFunctionErrorTest(testName: string, createErrorFunction: ((message: string) => Error), expected: Error): void
                {
                    runner.test(testName, (test: Test) =>
                    {
                        const mc: MutableCondition = MutableCondition.create();
                        test.assertThrows(() => mc.setCreateErrorFunction(createErrorFunction), expected);
                    });
                }

                setCreateErrorFunctionErrorTest("with undefined", undefined!, new PreConditionError(
                    "Expression: createErrorFunction",
                    "Expected: not undefined and not null",
                    "Actual: undefined",
                ));
                setCreateErrorFunctionErrorTest("with null", null!, new PreConditionError(
                    "Expression: createErrorFunction",
                    "Expected: not undefined and not null",
                    "Actual: null",
                ));

                runner.test("with valid function", (test: Test) =>
                {
                    const mc: MutableCondition = MutableCondition.create();
                    test.assertThrows(() => mc.assertEqual(1, 2));

                    mc.setCreateErrorFunction((message: string) =>
                    {
                        return Error(`fake '${message}' fake`);
                    });

                    mc.setEqualFunctions(
                        EqualFunctions.create()
                            .add((left: unknown, right: unknown) =>
                            {
                                return isNumber(left) && isNumber(right)
                                    ? left % 2 === right % 2
                                    : undefined;
                            })
                    )

                    test.assertTrue(mc.areEqual(3, 5));
                    test.assertFalse(mc.areEqual(3, 4));
                    test.assertTrue(mc.areEqual(4, 4));
                });
            });

            runner.testFunction("assertUndefined()", () =>
            {
                runner.test("with undefined", (_: Test) =>
                {
                    const mc: MutableCondition = MutableCondition.create();
                    mc.assertUndefined(undefined);
                });

                function assertUndefinedErrorTest(value: unknown, expected: Error): void
                {
                    runner.test(`with ${runner.toString(value)}`, (test: Test) =>
                    {
                        const mc: MutableCondition = MutableCondition.create();
                        test.assertThrows(() => mc.assertUndefined(value), expected);
                    });
                }

                assertUndefinedErrorTest(null, new Error(join("\n", [
                    "Expected: undefined",
                    "Actual: null",
                ])));
                assertUndefinedErrorTest(false, new Error(join("\n", [
                    "Expected: undefined",
                    "Actual: false",
                ])));
                assertUndefinedErrorTest("abc", new Error(join("\n", [
                    "Expected: undefined",
                    "Actual: \"abc\"",
                ])));
            });

            runner.testFunction("assertNotUndefined()", () =>
            {
                runner.test("with undefined", (test: Test) =>
                {
                    const mc: MutableCondition = MutableCondition.create();
                    test.assertThrows(
                        () => mc.assertNotUndefined(undefined),
                        new Error(join("\n", [
                            "Expected: not undefined",
                            "Actual: undefined",
                        ])),
                    );
                });

                function assertNotUndefinedTest(value: unknown): void
                {
                    runner.test(`with ${runner.toString(value)}`, (_: Test) =>
                    {
                        const mc: MutableCondition = MutableCondition.create();
                        mc.assertNotUndefined(value);
                    });
                }

                assertNotUndefinedTest(null);
                assertNotUndefinedTest("");
                assertNotUndefinedTest(false);
            });

            runner.testFunction("areEqual()", () =>
            {
                function areEqualTest(left: unknown, right: unknown, expected: boolean): void
                {
                    runner.test(`with ${runner.andList([left, right])}`, (test: Test) =>
                    {
                        const mc: MutableCondition = MutableCondition.create();
                        test.assertEqual(mc.areEqual(left, right), expected);
                    });
                }

                areEqualTest(undefined, undefined, true);
                areEqualTest(5, 5, true);
                areEqualTest(true, true, true);
                areEqualTest({}, {}, true);

                areEqualTest(undefined, "", false);
                areEqualTest(1, 2, false);
                areEqualTest(false, true, false);
                areEqualTest({a:1}, {a:2}, false);
            });

            runner.testFunction("toValueString()", () =>
            {
                function toValueStringTest(value: unknown, expected: string): void
                {
                    runner.test(`with ${runner.toString(value)}`, (test: Test) =>
                    {
                        const mc: MutableCondition = MutableCondition.create();
                        test.assertEqual(expected, mc.toValueString(value));
                    });
                }

                toValueStringTest(undefined, "undefined");
                toValueStringTest(null, "null");
                toValueStringTest(0, "0");
                toValueStringTest("abc", `"abc"`);
                toValueStringTest({}, "{}");
                toValueStringTest({a:"a"}, `{"a":"a"}`);
            });

            runner.testFunction("createError()", () =>
            {
                runner.test("with all properties", (test: Test) =>
                {
                    const mc: MutableCondition = MutableCondition.create();
                    const error: Error = mc.createError({
                        actual: "fake-actual",
                        expected: "fake-expected",
                        expression: "fake-expression",
                        message: "fake-message",
                    });
                    test.assertEqual(error, new Error(join("\n", [
                        "Message: fake-message",
                        "Expression: fake-expression",
                        "Expected: fake-expected",
                        "Actual: fake-actual",
                    ])));
                });
            });
        });
    });
}