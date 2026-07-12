import { andList } from "../sources/english.js";
import { EqualFunctions } from "../sources/equalFunctions.js";
import { List } from "../sources/list.js";
import { Map } from "../sources/map.js";
import { PreConditionError } from "../sources/preConditionError.js";
import { isNumber } from "../sources/types.js";
import { Test } from "./test.js";
import { TestRunner } from "./testRunner.js";

export function test(runner: TestRunner): void
{
    runner.testFile("equalFunctions.ts", () =>
    {
        runner.testType("EqualFunctions", () =>
        {
            runner.test("create()", (test: Test) =>
            {
                const functions: EqualFunctions = EqualFunctions.create();
                test.assertNotUndefinedAndNotNull(functions);
            });

            runner.testFunction("areEqual()", () =>
            {
                function areEqualTest(left: unknown, right: unknown, expected: boolean): void
                {
                    runner.test(`with ${runner.andList([left, right])}`, (test: Test) =>
                    {
                        const functions: EqualFunctions = EqualFunctions.create();
                        test.assertEqual(functions.areEqual(left, right).await(), expected);
                    });
                }

                areEqualTest(undefined, undefined, true);
                areEqualTest(undefined, null, false);
                areEqualTest(undefined, false, false);
                areEqualTest(undefined, true, false);
                areEqualTest(undefined, "hello", false);
                areEqualTest(undefined, 20, false);
                areEqualTest(undefined, {}, false);
                areEqualTest(undefined, [], false);
                areEqualTest(undefined, Map.create(), false);

                areEqualTest(null, undefined, false);
                areEqualTest(null, null, true);
                areEqualTest(null, false, false);
                areEqualTest(null, true, false);
                areEqualTest(null, "hello", false);
                areEqualTest(null, 20, false);
                areEqualTest(null, {}, false);
                areEqualTest(null, [], false);
                areEqualTest(null, Map.create(), false);

                areEqualTest(false, undefined, false);
                areEqualTest(false, null, false);
                areEqualTest(false, false, true);
                areEqualTest(false, true, false);
                areEqualTest(false, "hello", false);
                areEqualTest(false, 20, false);
                areEqualTest(false, {}, false);
                areEqualTest(false, [], false);
                areEqualTest(false, Map.create(), false);

                areEqualTest(true, undefined, false);
                areEqualTest(true, null, false);
                areEqualTest(true, false, false);
                areEqualTest(true, true, true);
                areEqualTest(true, "hello", false);
                areEqualTest(true, 20, false);
                areEqualTest(true, {}, false);
                areEqualTest(true, [], false);
                areEqualTest(true, Map.create(), false);
                
                areEqualTest("hello", undefined, false);
                areEqualTest("hello", null, false);
                areEqualTest("hello", false, false);
                areEqualTest("hello", true, false);
                areEqualTest("hello", "hello", true);
                areEqualTest("hello", "hello there", false);
                areEqualTest("hello", "HELLO", false);
                areEqualTest("hello", 20, false);
                areEqualTest("hello", {}, false);
                areEqualTest("hello", [], false);
                areEqualTest("", [], false);
                areEqualTest("abc", ["a", "b", "c"], false);
                areEqualTest("hello", Map.create(), false);

                areEqualTest(10, undefined, false);
                areEqualTest(10, null, false);
                areEqualTest(10, false, false);
                areEqualTest(10, true, false);
                areEqualTest(10, "hello", false);
                areEqualTest(10, 10, true);
                areEqualTest(10, 10.0, true);
                areEqualTest(10, -10, false);
                areEqualTest(10, 10.0000001, false);
                areEqualTest(10, 20, false);
                areEqualTest(10, {}, false);
                areEqualTest(10, [], false);
                areEqualTest(10, Map.create(), false);

                areEqualTest({}, undefined, false);
                areEqualTest({}, null, false);
                areEqualTest({}, false, false);
                areEqualTest({}, true, false);
                areEqualTest({}, "hello", false);
                areEqualTest({}, 20, false);
                areEqualTest({}, {}, true);
                areEqualTest({}, {a:5}, false);
                areEqualTest({a:5}, {a:5}, true);
                areEqualTest({a:{b:5}}, {a:{b:5}}, true);
                areEqualTest({a:6}, {a:5}, false);
                areEqualTest({A:5}, {a:5}, false);
                areEqualTest({}, [], false);
                areEqualTest({}, Map.create(), false);
                areEqualTest({a:5}, Map.create<string,number>().set("a", 5), false);

                areEqualTest([], undefined, false);
                areEqualTest([], null, false);
                areEqualTest([], false, false);
                areEqualTest([], true, false);
                areEqualTest([], "hello", false);
                areEqualTest(["a", "b", "c"], "abc", false);
                areEqualTest([], 20, false);
                areEqualTest([], {}, false);
                areEqualTest([], List.create(), true);
                areEqualTest([], [], true);
                areEqualTest([], [1], false);
                areEqualTest([1], [1], true);
                areEqualTest([1,2,3], [1,2,3], true);
                areEqualTest([1,2], [1,2,3], false);
                areEqualTest([1,2], [1,3], false);
                areEqualTest([], Map.create(), false);

                areEqualTest(List.create(), undefined, false);
                areEqualTest(List.create(), null, false);
                areEqualTest(List.create(), false, false);
                areEqualTest(List.create(), true, false);
                areEqualTest(List.create(), "hello", false);
                areEqualTest(List.create(), 20, false);
                areEqualTest(List.create(), {}, false);
                areEqualTest(List.create(), [], true);
                areEqualTest(List.create(), [1], false);
                areEqualTest(List.create([1]), [1], true);
                areEqualTest(List.create([1,2,3]), [1,2,3], true);
                areEqualTest(List.create([1,2]), [1,2,3], false);
                areEqualTest(List.create([1,2]), [1,3], false);
                areEqualTest(List.create(), Map.create(), false);

                areEqualTest(Map.create(), undefined, false);
                areEqualTest(Map.create(), null, false);
                areEqualTest(Map.create(), false, false);
                areEqualTest(Map.create(), true, false);
                areEqualTest(Map.create(), "hello", false);
                areEqualTest(Map.create(), 20, false);
                areEqualTest(Map.create(), {}, false);
                areEqualTest(Map.create().set("d", 4), {d:4}, false);
                areEqualTest(Map.create().set("d", 4), {d:5}, false);
                areEqualTest(Map.create().set("d", 4), {e:4}, false);
                areEqualTest(Map.create(), [], false);
                areEqualTest(Map.create(), Map.create(), true);
                areEqualTest(Map.create(), Map.create().set("e", 5), false);
                areEqualTest(Map.create().set("e", 5), Map.create().set("e", 5), true);
                areEqualTest(Map.create().set("e", 5), Map.create().set("f", 5), false);
                areEqualTest(Map.create().set("e", 5), Map.create().set("e", 6), false);
                areEqualTest(Map.create().set("e", 5).set("f", 6), Map.create().set("f", 6).set("e", 5), true);
            });

            runner.testFunction("add()", () =>
            {
                runner.test("with undefined equalFunction", (test: Test) =>
                {
                    const functions: EqualFunctions = EqualFunctions.create();
                    test.assertThrows(
                        () => functions.add(undefined!),
                        new PreConditionError([
                            "Expression: equalFunction",
                            "Expected: not undefined and not null",
                            "Actual: undefined"
                        ].join("\n")),
                    );
                });

                runner.test("with null equalFunction", (test: Test) =>
                {
                    const functions: EqualFunctions = EqualFunctions.create();
                    test.assertThrows(
                        () => functions.add(null!),
                        new PreConditionError([
                            "Expression: equalFunction",
                            "Expected: not undefined and not null",
                            "Actual: null"
                        ].join("\n")),
                    );
                });

                runner.test("with equalFunction that compares numbers based on their mod 2 result", (test: Test) =>
                {
                    const functions: EqualFunctions = EqualFunctions.create();
                    const result: EqualFunctions = functions.add((left: unknown, right: unknown) =>
                    {
                        let result: boolean | undefined;
                        if (isNumber(left) && isNumber(right))
                        {
                            const leftMod2: number = left % 2;
                            const rightMod2: number = right % 2;
                            result = leftMod2 === rightMod2;
                        }
                        return result;
                    });
                    test.assertSame(functions, result);
                    test.assertTrue(functions.areEqual(0, 0).await());
                    test.assertTrue(functions.areEqual(1, 1).await());
                    test.assertTrue(functions.areEqual(0, 2).await());
                    test.assertTrue(functions.areEqual(1, 3).await());
                    test.assertFalse(functions.areEqual(-1, 5).await());
                    test.assertFalse(functions.areEqual(0, 1).await());
                    test.assertTrue(functions.areEqual(false, false).await());
                    test.assertFalse(functions.areEqual(false, true).await());
                });
            });
        });
    });
}