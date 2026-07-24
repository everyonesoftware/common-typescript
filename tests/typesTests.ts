import { Iterable } from "../sources/iterable.js";
import { List } from "../sources/list.js";
import {
    asBoolean, hasFunction, HasFunctionOptions, hasProperty, isArray, isBoolean, isFunction, isNumber, isObject,
    isObjectOrArrayOrNull, isString
} from "../sources/types.js";
import { Test } from "./test.js";
import { TestRunner } from "./testRunner.js";

export function test(runner: TestRunner): void
{
    runner.testFile("types.ts", () =>
    {
        runner.testFunction("isBoolean(unknown)", () =>
        {
            function isBooleanTest(value: unknown, expected: boolean): void
            {
                runner.test(`with ${runner.toString(value)}`, (test: Test) =>
                {
                    test.assertSame(isBoolean(value), expected);
                });
            }

            isBooleanTest(undefined, false);
            isBooleanTest(null, false);
            isBooleanTest("", false);
            isBooleanTest("true", false);
            isBooleanTest(123, false);
            isBooleanTest({}, false);
            isBooleanTest([], false);
            isBooleanTest(true, true);
            isBooleanTest(false, true);
        });

        runner.testFunction("asBoolean(unknown)", () =>
        {
            function asBooleanTest(value: unknown, expected: boolean | undefined): void
            {
                runner.test(`with ${runner.toString(value)}`, (test: Test) =>
                {
                    test.assertEqual(asBoolean(value), expected);
                });
            }

            asBooleanTest(undefined, undefined);
            asBooleanTest(null, undefined);
            asBooleanTest("", undefined);
            asBooleanTest("true", undefined);
            asBooleanTest(123, undefined);
            asBooleanTest({}, undefined);
            asBooleanTest([], undefined);
            asBooleanTest(true, true);
            asBooleanTest(false, false);
            asBooleanTest(() => false, undefined);
            asBooleanTest(() => true, undefined);
        });

        runner.testFunction("isNumber(unknown)", () =>
        {
            function isNumberTest(value: unknown, expected: boolean): void
            {
                runner.test(`with ${runner.toString(value)}`, (test: Test) =>
                {
                    test.assertSame(isNumber(value), expected);
                });
            }

            isNumberTest(undefined, false);
            isNumberTest(null, false);
            isNumberTest("", false);
            isNumberTest("123", false);
            isNumberTest({}, false);
            isNumberTest([], false);
            isNumberTest(true, false);
            isNumberTest(false, false);
            isNumberTest(123, true);
            isNumberTest(Infinity, true);
            isNumberTest(-Infinity, true);
            isNumberTest(NaN, true);
        });

        runner.testFunction("isString(unknown)", () =>
        {
            function isStringTest(value: unknown, expected: boolean): void
            {
                runner.test(`with ${runner.toString(value)}`, (test: Test) =>
                {
                    test.assertSame(isString(value), expected);
                });
            }

            isStringTest(undefined, false);
            isStringTest(null, false);
            isStringTest(50, false);
            isStringTest({}, false);
            isStringTest("", true);
            isStringTest("hello", true);
        });

        runner.testFunction("isFunction(unknown)", () =>
        {
            function isFunctionTest(value: unknown, expected: boolean): void
            {
                runner.test(`with ${runner.toString(value)}`, (test: Test) =>
                {
                    test.assertSame(isFunction(value), expected);
                });
            }

            isFunctionTest(undefined, false);
            isFunctionTest(null, false);
            isFunctionTest(false, false);
            isFunctionTest(true, false);
            isFunctionTest(123, false);
            isFunctionTest("abc", false);
            isFunctionTest({}, false);
            isFunctionTest([], false);

            isFunctionTest(isArray, true);
            isFunctionTest(isFunction, true);
            isFunctionTest(() => 123, true);
        });

        runner.testFunction("isArray(unknown)", () =>
        {
            function isArrayTest(value: unknown, expected: boolean): void
            {
                runner.test(`with ${runner.toString(value)}`, (test: Test) =>
                {
                    test.assertSame(isArray(value), expected);
                });
            }

            isArrayTest(undefined, false);
            isArrayTest(null, false);
            isArrayTest(50, false);
            isArrayTest({}, false);
            isArrayTest("", false);
            isArrayTest("hello", false);
            isArrayTest(Iterable.create(), false);
            isArrayTest(List.create(), false);
            isArrayTest(new Uint8Array(), false);

            isArrayTest([], true);
            isArrayTest(["a", "b"], true);
            isArrayTest(new Array(), true);
            isArrayTest(Array.from([1, 2]), true);
        });

        runner.testFunction("isObjectOrArrayOrNull(unknown)", () =>
        {
            function isObjectOrArrayOrNullTest(value: unknown, expected: boolean): void
            {
                runner.test(`with ${runner.toString(value)}`, (test: Test) =>
                {
                    test.assertSame(isObjectOrArrayOrNull(value), expected);
                });
            }

            isObjectOrArrayOrNullTest(undefined, false);
            isObjectOrArrayOrNullTest(50, false);
            isObjectOrArrayOrNullTest("", false);
            isObjectOrArrayOrNullTest("hello", false);
            
            isObjectOrArrayOrNullTest({}, true);
            isObjectOrArrayOrNullTest(null, true);
            isObjectOrArrayOrNullTest([], true);
            isObjectOrArrayOrNullTest(["a", "b"], true);
            isObjectOrArrayOrNullTest(new Array(), true);
            isObjectOrArrayOrNullTest(Array.from([1, 2]), true);
            isObjectOrArrayOrNullTest(Iterable.create(), true);
            isObjectOrArrayOrNullTest(List.create(), true);
        });

        runner.testFunction("isObject(unknown)", () =>
        {
            function isObjectTest(value: unknown, expected: boolean): void
            {
                runner.test(`with ${runner.toString(value)}`, (test: Test) =>
                {
                    test.assertSame(isObject(value), expected);
                });
            }

            isObjectTest(undefined, false);
            isObjectTest(50, false);
            isObjectTest("", false);
            isObjectTest("hello", false);
            isObjectTest(null, false);
            isObjectTest([], false);
            isObjectTest(["a", "b"], false);
            isObjectTest(new Array(), false);
            isObjectTest(Array.from([1, 2]), false);
            
            isObjectTest({}, true);
            isObjectTest(Iterable.create(), true);
            isObjectTest(List.create(), true);
        });

        runner.testFunction("hasProperty(TValue,TPropertyKey extends PropertyKey)", () =>
        {
            function hasPropertyTest<TPropertyKey extends PropertyKey>(value: unknown, propertyKey: TPropertyKey, expected: boolean): void
            {
                runner.test(`with ${runner.andList([value, propertyKey])}`, (test: Test) =>
                {
                    const result: boolean = hasProperty(value, propertyKey);
                    test.assertSame(result, expected);
                    if (value !== undefined && value !== null)
                    {
                        if (result)
                        {
                            test.assertNotUndefined((value as any)[propertyKey]);
                        }
                        else
                        {
                            test.assertUndefined((value as any)[propertyKey]);
                        }
                    }
                });
            }

            hasPropertyTest(undefined, "spam", false);
            hasPropertyTest(null, "spam", false);
            hasPropertyTest([], "spam", false);
            hasPropertyTest([], "length", true);
            hasPropertyTest({}, "spam", false);
            hasPropertyTest("", "spam", false);
            hasPropertyTest("", "length", true);
            hasPropertyTest(5, "spam", false);
            hasPropertyTest(5, "toString", true);
        });

        runner.testFunction("hasFunction(TValue,TPropertyKey extends PropertyKey)", () =>
        {
            function hasFunctionTest<TPropertyKey extends PropertyKey>(value: unknown, propertyKey: TPropertyKey, expected: boolean): void
            {
                runner.test(`with ${runner.andList([value, propertyKey])}`, (test: Test) =>
                {
                    test.assertSame(hasFunction(value, propertyKey), expected);
                });
            }

            hasFunctionTest(undefined, "spam", false);
            hasFunctionTest(null, "spam", false);
            hasFunctionTest([], "spam", false);
            hasFunctionTest([], "length", false);
            hasFunctionTest([], Symbol.iterator, true);
            hasFunctionTest({}, "spam", false);
            hasFunctionTest("", "spam", false);
            hasFunctionTest("", "length", false);
            hasFunctionTest("", "at", true);
            hasFunctionTest("", Symbol.iterator, true);
            hasFunctionTest(5, "spam", false);
            hasFunctionTest(5, "toString", true);

            function hasFunctionWithOptionsTest<TPropertyKey extends PropertyKey>(value: unknown, propertyKey: TPropertyKey, options: HasFunctionOptions, expected: boolean): void
            {
                runner.test(`with ${runner.andList([value, propertyKey, options])}`, (test: Test) =>
                {
                    test.assertSame(hasFunction(value, propertyKey, options), expected);
                });
            }

            hasFunctionWithOptionsTest(undefined, "spam", {}, false);
            hasFunctionWithOptionsTest(null, "spam", {}, false);
            hasFunctionWithOptionsTest([], "spam", {}, false);
            hasFunctionWithOptionsTest([], "length", {}, false);
            hasFunctionWithOptionsTest([], Symbol.iterator, {}, true);
            hasFunctionWithOptionsTest({}, "spam", {}, false);
            hasFunctionWithOptionsTest("", "spam", {}, false);
            hasFunctionWithOptionsTest("", "length", {}, false);
            hasFunctionWithOptionsTest("", "at", {}, true);
            hasFunctionWithOptionsTest("", Symbol.iterator, {}, true);
            hasFunctionWithOptionsTest(5, "spam", {}, false);
            hasFunctionWithOptionsTest(5, "toString", {}, true);

            hasFunctionWithOptionsTest(undefined, "spam", { allowInherited: false }, false);
            hasFunctionWithOptionsTest(null, "spam", { allowInherited: false }, false);
            hasFunctionWithOptionsTest([], "spam", { allowInherited: false }, false);
            hasFunctionWithOptionsTest([], "length", { allowInherited: false }, false);
            hasFunctionWithOptionsTest([], Symbol.iterator, { allowInherited: false }, true);
            hasFunctionWithOptionsTest({}, "spam", { allowInherited: false }, false);
            hasFunctionWithOptionsTest("", "spam", { allowInherited: false }, false);
            hasFunctionWithOptionsTest("", "length", { allowInherited: false }, false);
            hasFunctionWithOptionsTest("", "at", { allowInherited: false }, true);
            hasFunctionWithOptionsTest("", Symbol.iterator, { allowInherited: false }, true);
            hasFunctionWithOptionsTest(5, "spam", { allowInherited: false }, false);
            hasFunctionWithOptionsTest(5, "toString", { allowInherited: false }, true);
        });
    });
}