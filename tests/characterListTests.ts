import { CharacterList } from "../sources/characterList";
import { EqualFunctions } from "../sources/equalFunctions";
import { JavascriptIterable } from "../sources/javascript";
import { NotFoundError } from "../sources/notFoundError";
import { PreConditionError } from "../sources/preConditionError";
import { isNumber, isString } from "../sources/types";
import { Test } from "./test";
import { TestRunner } from "./testRunner";

export function test(runner: TestRunner): void
{
    runner.testFile("characterList.ts", () =>
    {
        runner.testType("CharacterList", () =>
        {
            runner.testFunction("create()", () =>
            {
                runner.test("with no arguments", (test: Test) =>
                {
                    const list: CharacterList = CharacterList.create();
                    test.assertNotUndefinedAndNotNull(list);
                    test.assertEqual(0, list.getCount().await());
                    test.assertFalse(list.any().await());
                    test.assertEqual([], list.toArray().await());
                });

                runner.test("with undefined", (test: Test) =>
                {
                    const list: CharacterList = CharacterList.create(undefined);
                    test.assertNotUndefinedAndNotNull(list);
                    test.assertEqual(0, list.getCount().await());
                    test.assertFalse(list.any().await());
                    test.assertEqual([], list.toArray().await());
                });

                runner.test("with null", (test: Test) =>
                {
                    const list: CharacterList = CharacterList.create(null!);
                    test.assertNotUndefinedAndNotNull(list);
                    test.assertEqual(0, list.getCount().await());
                    test.assertFalse(list.any().await());
                    test.assertEqual([], list.toArray().await());
                });

                runner.test("with empty initialValues", (test: Test) =>
                {
                    const list: CharacterList = CharacterList.create([]);
                    test.assertNotUndefinedAndNotNull(list);
                    test.assertEqual(0, list.getCount().await());
                    test.assertFalse(list.any().await());
                    test.assertEqual([], list.toArray().await());
                });

                runner.test("with one value", (test: Test) =>
                {
                    const list: CharacterList = CharacterList.create(["m"]);
                    test.assertNotUndefinedAndNotNull(list);
                    test.assertEqual(1, list.getCount().await());
                    test.assertTrue(list.any().await());
                    test.assertEqual(["m"], list.toArray().await());
                });

                runner.test("with two values", (test: Test) =>
                {
                    const list: CharacterList = CharacterList.create(["n", "l"]);
                    test.assertNotUndefinedAndNotNull(list);
                    test.assertEqual(2, list.getCount().await());
                    test.assertTrue(list.any().await());
                    test.assertEqual(["n", "l"], list.toArray().await());
                });
            });

            runner.testFunction("add()", () =>
            {
                function addErrorTest(value: string, expected: Error): void
                {
                    runner.test(`with ${runner.toString(value)}`, (test: Test) =>
                    {
                        const list: CharacterList = CharacterList.create();
                        test.assertThrows(() => list.add(value), expected);
                        test.assertEqual([], list.toArray().await());
                    });
                }

                addErrorTest("", new PreConditionError(
                    "Expression: value",
                    "Expected: character",
                    "Actual: \"\"",
                ));
                addErrorTest("ab", new PreConditionError(
                    "Expression: value",
                    "Expected: character",
                    "Actual: \"ab\"",
                ));

                runner.test("with valid value", (test: Test) =>
                {
                    const list: CharacterList = CharacterList.create();

                    const addResult1: CharacterList = list.add("a");
                    test.assertSame(list, addResult1);
                    test.assertEqual(["a"], addResult1.toArray().await());

                    const addResult2: CharacterList = list.add("b");
                    test.assertSame(list, addResult2);
                    test.assertEqual(["a", "b"], addResult2.toArray().await());

                    const addResult3: CharacterList = list.add("c");
                    test.assertSame(list, addResult3);
                    test.assertEqual(["a", "b", "c"], addResult3.toArray().await());

                    const addResult4: CharacterList = list.add("d");
                    test.assertSame(list, addResult4);
                    test.assertEqual(["a", "b", "c", "d"], addResult4.toArray().await());
                });
            });

            runner.testFunction("addAll()", () =>
            {
                runner.test("with empty values", (test: Test) =>
                {
                    const list: CharacterList = CharacterList.create();

                    const addAllResult: CharacterList = list.addAll([]);
                    test.assertSame(list, addAllResult);
                    test.assertEqual([], list.toArray().await());
                });

                runner.test("with non-empty values", (test: Test) =>
                {
                    const list: CharacterList = CharacterList.create();

                    const addAllResult: CharacterList = list.addAll("abcde");
                    test.assertSame(list, addAllResult);
                    test.assertEqual(["a", "b", "c", "d", "e"], list.toArray().await());
                });
            });

            runner.testFunction("insert()", () =>
            {
                function insertErrorTest(initialValues: string[], index: number, value: string, expected: Error): void
                {
                    runner.test(`with ${runner.andList([initialValues, index, value])}`, (test: Test) =>
                    {
                        const list: CharacterList = CharacterList.create(initialValues);
                        test.assertThrows(() => list.insert(index, value), expected);
                        test.assertEqual(initialValues, list.toArray().await());
                    });
                }

                insertErrorTest([], -1, "a", new PreConditionError(
                    "Expression: index",
                    "Expected: 0",
                    "Actual: -1",
                ));
                insertErrorTest([], 1, "a", new PreConditionError(
                    "Expression: index",
                    "Expected: 0",
                    "Actual: 1",
                ));
                insertErrorTest(["z"], -1, "a", new PreConditionError(
                    "Expression: index",
                    "Expected: between 0 and 1",
                    "Actual: -1",
                ));
                insertErrorTest(["z"], 2, "a", new PreConditionError(
                    "Expression: index",
                    "Expected: between 0 and 1",
                    "Actual: 2",
                ));
                insertErrorTest([], 0, "", new PreConditionError(
                    "Expression: value",
                    "Expected: character",
                    "Actual: \"\"",
                ));
                insertErrorTest([], 0, "ab", new PreConditionError(
                    "Expression: value",
                    "Expected: character",
                    "Actual: \"ab\"",
                ));

                function insertTest(initialValues: JavascriptIterable<string>, index: number, value: string, expected: string[]): void
                {
                    runner.test(`with ${runner.andList([initialValues, index, value])}`, (test: Test) =>
                    {
                        const list: CharacterList = CharacterList.create(initialValues);

                        const insertResult: CharacterList = list.insert(index, value);
                        test.assertSame(list, insertResult);
                        test.assertEqual(expected, list.toArray().await());
                    });
                }

                insertTest([], 0, "z", ["z"]);
                insertTest(["a"], 0, "y", ["y", "a"]);
                insertTest(["a"], 1, "y", ["a", "y"]);
                insertTest(["a", "b", "c"], 0, "z", ["z", "a", "b", "c"]);
                insertTest(["a", "b", "c"], 1, "z", ["a", "z", "b", "c"]);
                insertTest(["a", "b", "c"], 2, "z", ["a", "b", "z", "c"]);
                insertTest(["a", "b", "c"], 3, "z", ["a", "b", "c", "z"]);
                insertTest(["a", "b", "c", "d", "e"], 2, "z", ["a", "b", "z", "c", "d", "e"]);
            });

            runner.testFunction("remove()", () =>
            {
                runner.test("with not-found value", (test: Test) =>
                {
                    const list: CharacterList = CharacterList.create();

                    test.assertThrows(() => list.remove("a").await(), new NotFoundError("Could not find the value to remove: \"a\""));
                    test.assertEqual([], list.toArray().await());
                });

                runner.test("with found value", (test: Test) =>
                {
                    const list: CharacterList = CharacterList.create(["a"]);

                    const removeResult: string = list.remove("a").await();
                    test.assertEqual("a", removeResult);
                    test.assertEqual([], list.toArray().await());
                });

                runner.test("with multiple found values", (test: Test) =>
                {
                    const list: CharacterList = CharacterList.create(["a", "a", "a"]);

                    const removeResult: string = list.remove("a").await();
                    test.assertEqual("a", removeResult);
                    test.assertEqual(["a", "a"], list.toArray().await());
                });

                runner.test("with multiple found values and equalFunctions", (test: Test) =>
                {
                    const list: CharacterList = CharacterList.create(["a", "b", "c", "d", "e"]);
                    const isVowel = (character: string) => ["a", "e", "i", "o", "u"].includes(character);
                    const equalFunctions: EqualFunctions = EqualFunctions.create()
                        .add((left: unknown, right: unknown) =>
                        {
                            return isString(left) && isString(right)
                                ? isVowel(left) === isVowel(right)
                                : undefined;
                        });
                    const removeResult: string = list.remove("i", equalFunctions).await();
                    test.assertEqual("a", removeResult);
                    test.assertEqual(["b", "c", "d", "e"], list.toArray().await());
                });
            });
        });
    });
}