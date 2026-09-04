import { Iterable } from "../sources/iterable.js";
import { PreConditionError } from "../sources/preConditionError.js";
import { join } from "../sources/strings.js";
import { Type } from "../sources/types.js";
import { Test } from "./test.js";
import { TestRunner } from "./testRunner.js";
import { TestSkip } from "./testSkip.js";

export function test(runner: TestRunner): void
{
    runner.testFile("testRunner.ts", () =>
    {
        runner.testType("TestRunner", () =>
        {
        });
    });
}

export function test2(runner: TestRunner, creator: () => TestRunner): void
{
    runner.testFile("testRunner.ts", () =>
    {
        runner.testType("TestRunner", () =>
        {
            runner.testFunction("andList()", () =>
            {
                function andListErrorTest(values: unknown[] | Iterable<unknown>, expected: Error): void
                {
                    runner.test(`with ${runner.toString(values)}`, (test: Test) =>
                    {
                        const runner2: TestRunner = creator();
                        test.assertThrows(() => runner2.andList(values), expected);
                    });
                }

                andListErrorTest(undefined!, new PreConditionError(join("\n", [
                    "Expression: values",
                    "Expected:   not undefined and not null",
                    "Actual:     undefined",
                ])));
                andListErrorTest(null!, new PreConditionError(join("\n", [
                    "Expression: values",
                    "Expected:   not undefined and not null",
                    "Actual:     null",
                ])));

                function andListTest(values: unknown[] | Iterable<unknown>, expected: string): void
                {
                    runner.test(`with ${runner.toString(values)}`, (test: Test) =>
                    {
                        const runner2: TestRunner = creator();
                        test.assertEqual(expected, runner2.andList(values));
                    });
                }

                andListTest([], "");
                andListTest(["a"], `"a"`);
                andListTest([1, "a"], `1 and "a"`);
                andListTest([1, "a", {a:7}], `1, "a", and {"a":7}`);
            });

            runner.testFunction("toString()", () =>
            {
                function toStringTest(value: unknown, expected: string): void
                {
                    runner.test(`with ${runner.toString(value)}`, (test: Test) =>
                    {
                        const runner2: TestRunner = creator();
                        test.assertEqual(expected, runner2.toString(value));
                    });
                }

                toStringTest(undefined, "undefined");
                toStringTest(null, "null");
                toStringTest(false, "false");
                toStringTest(true, "true");
                toStringTest(5, "5");
                toStringTest(6.4, "6.4");
                toStringTest("", `""`);
                toStringTest("hello there", `"hello there"`);
                toStringTest({}, "{}");
                toStringTest({a:{b:"c"}}, `{"a":{"b":"c"}}`);
                toStringTest([], "[]");
                toStringTest([false, 1, "d"], `[false,1,"d"]`);
            });

            runner.testFunction("skip()", () =>
            {
                runner.test("with no arguments", (test: Test) =>
                {
                    const runner2: TestRunner = creator();
                    const testSkip: TestSkip = runner2.skip();
                    test.assertNotUndefinedAndNotNull(testSkip);
                    test.assertTrue(testSkip.getShouldSkip());
                    test.assertEqual("", testSkip.getMessage());
                });

                runner.test("with false", (test: Test) =>
                {
                    const runner2: TestRunner = creator();
                    const testSkip: TestSkip = runner2.skip(false);
                    test.assertNotUndefinedAndNotNull(testSkip);
                    test.assertFalse(testSkip.getShouldSkip());
                    test.assertEqual("", testSkip.getMessage());
                });

                runner.test("with true", (test: Test) =>
                {
                    const runner2: TestRunner = creator();
                    const testSkip: TestSkip = runner2.skip(true);
                    test.assertNotUndefinedAndNotNull(testSkip);
                    test.assertTrue(testSkip.getShouldSkip());
                    test.assertEqual("", testSkip.getMessage());
                });

                runner.test("with message", (test: Test) =>
                {
                    const runner2: TestRunner = creator();
                    const testSkip: TestSkip = runner2.skip(true, "hello there!");
                    test.assertNotUndefinedAndNotNull(testSkip);
                    test.assertTrue(testSkip.getShouldSkip());
                    test.assertEqual("hello there!", testSkip.getMessage());
                });
            });

            runner.testFunction("testFile()", () =>
            {
                runner.testGroup("with no skip", () =>
                {
                    function testFileErrorTest(testName: string, fileName: string, testAction: () => void, expected: Error): void
                    {
                        runner.test(testName, (test: Test) =>
                        {
                            const runner2: TestRunner = creator();
                            test.assertThrows(() => runner2.testFile(fileName, testAction), expected);
                        })
                    }

                    testFileErrorTest(
                        "with undefined fileName",
                        undefined!,
                        () => {},
                        new PreConditionError(
                            "Expression: fileName",
                            "Expected:   not undefined and not null",
                            "Actual:     undefined",
                        ),
                    )
                    testFileErrorTest(
                        "with null fileName",
                        null!,
                        () => {},
                        new PreConditionError(
                            "Expression: fileName",
                            "Expected:   not undefined and not null",
                            "Actual:     null",
                        ),
                    )
                    testFileErrorTest(
                        "with empty fileName",
                        "",
                        () => {},
                        new PreConditionError(
                            "Expression: fileName",
                            "Expected:   not empty",
                            "Actual:     \"\"",
                        ),
                    )
                    testFileErrorTest(
                        "with undefined testAction",
                        "abc",
                        undefined!,
                        new PreConditionError(
                            "Expression: testAction",
                            "Expected:   not undefined and not null",
                            "Actual:     undefined",
                        ),
                    )
                    testFileErrorTest(
                        "with null testAction",
                        "abc",
                        null!,
                        new PreConditionError(
                            "Expression: testAction",
                            "Expected:   not undefined and not null",
                            "Actual:     undefined",
                        ),
                    )
                });

                runner.testGroup("with undefined skip", () =>
                {
                    function testFileErrorTest(testName: string, fileName: string, testAction: () => void, expected: Error): void
                    {
                        runner.test(testName, (test: Test) =>
                        {
                            const runner2: TestRunner = creator();
                            test.assertThrows(() => runner2.testFile(fileName, undefined, testAction), expected);
                        })
                    }

                    testFileErrorTest(
                        "with undefined fileName",
                        undefined!,
                        () => {},
                        new PreConditionError(
                            "Expression: fileName",
                            "Expected:   not undefined and not null",
                            "Actual:     undefined",
                        ),
                    )
                    testFileErrorTest(
                        "with null fileName",
                        null!,
                        () => {},
                        new PreConditionError(
                            "Expression: fileName",
                            "Expected:   not undefined and not null",
                            "Actual:     null",
                        ),
                    )
                    testFileErrorTest(
                        "with empty fileName",
                        "",
                        () => {},
                        new PreConditionError(
                            "Expression: fileName",
                            "Expected:   not empty",
                            "Actual:     \"\"",
                        ),
                    )
                    testFileErrorTest(
                        "with undefined testAction",
                        "abc",
                        undefined!,
                        new PreConditionError(
                            "Expression: testAction",
                            "Expected:   not undefined and not null",
                            "Actual:     undefined",
                        ),
                    )
                    testFileErrorTest(
                        "with null testAction",
                        "abc",
                        null!,
                        new PreConditionError(
                            "Expression: testAction",
                            "Expected:   not undefined and not null",
                            "Actual:     null",
                        ),
                    )
                });

                runner.testGroup("with null skip", () =>
                {
                    function testFileErrorTest(testName: string, fileName: string, testAction: () => void, expected: Error): void
                    {
                        runner.test(testName, (test: Test) =>
                        {
                            const runner2: TestRunner = creator();
                            test.assertThrows(() => runner2.testFile(fileName, null!, testAction), expected);
                        })
                    }

                    testFileErrorTest(
                        "with undefined fileName",
                        undefined!,
                        () => {},
                        new PreConditionError(
                            "Expression: fileName",
                            "Expected:   not undefined and not null",
                            "Actual:     undefined",
                        ),
                    )
                    testFileErrorTest(
                        "with null fileName",
                        null!,
                        () => {},
                        new PreConditionError(
                            "Expression: fileName",
                            "Expected:   not undefined and not null",
                            "Actual:     null",
                        ),
                    )
                    testFileErrorTest(
                        "with empty fileName",
                        "",
                        () => {},
                        new PreConditionError(
                            "Expression: fileName",
                            "Expected:   not empty",
                            "Actual:     \"\"",
                        ),
                    )
                    testFileErrorTest(
                        "with undefined testAction",
                        "abc",
                        undefined!,
                        new PreConditionError(
                            "Expression: testAction",
                            "Expected:   not undefined and not null",
                            "Actual:     undefined",
                        ),
                    )
                    testFileErrorTest(
                        "with null testAction",
                        "abc",
                        null!,
                        new PreConditionError(
                            "Expression: testAction",
                            "Expected:   not undefined and not null",
                            "Actual:     null",
                        ),
                    )
                });

                runner.testGroup("with skip", () =>
                {
                    function testFileErrorTest(testName: string, fileName: string, testAction: () => void, expected: Error): void
                    {
                        runner.test(testName, (test: Test) =>
                        {
                            const runner2: TestRunner = creator();
                            const skip: TestSkip = runner2.skip();
                            test.assertThrows(() => runner2.testFile(fileName, skip, testAction), expected);
                        })
                    }

                    testFileErrorTest(
                        "with undefined fileName",
                        undefined!,
                        () => {},
                        new PreConditionError(
                            "Expression: fileName",
                            "Expected:   not undefined and not null",
                            "Actual:     undefined",
                        ),
                    )
                    testFileErrorTest(
                        "with null fileName",
                        null!,
                        () => {},
                        new PreConditionError(
                            "Expression: fileName",
                            "Expected:   not undefined and not null",
                            "Actual:     null",
                        ),
                    )
                    testFileErrorTest(
                        "with empty fileName",
                        "",
                        () => {},
                        new PreConditionError(
                            "Expression: fileName",
                            "Expected:   not empty",
                            "Actual:     \"\"",
                        ),
                    )
                    testFileErrorTest(
                        "with undefined testAction",
                        "abc",
                        undefined!,
                        new PreConditionError(
                            "Expression: testAction",
                            "Expected:   not undefined and not null",
                            "Actual:     undefined",
                        ),
                    )
                    testFileErrorTest(
                        "with null testAction",
                        "abc",
                        null!,
                        new PreConditionError(
                            "Expression: testAction",
                            "Expected:   not undefined and not null",
                            "Actual:     null",
                        ),
                    )
                });
            });

            runner.testFunction("testType()", () =>
            {
                runner.testGroup("with no skip", () =>
                {
                    function testTypeErrorTest(testName: string, typeNameOrType: string | Type<unknown>, testAction: () => void, expected: Error): void
                    {
                        runner.test(testName, (test: Test) =>
                        {
                            const runner2: TestRunner = creator();
                            test.assertThrows(() => runner2.testType(typeNameOrType, testAction), expected);
                        })
                    }

                    testTypeErrorTest(
                        "with undefined typeNameOrType",
                        undefined!,
                        () => {},
                        new PreConditionError(
                            "Expression: typeNameOrType",
                            "Expected:   not undefined and not null",
                            "Actual:     undefined",
                        ),
                    )
                    testTypeErrorTest(
                        "with null typeNameOrType",
                        null!,
                        () => {},
                        new PreConditionError(
                            "Expression: typeNameOrType",
                            "Expected:   not undefined and not null",
                            "Actual:     null",
                        ),
                    )
                    testTypeErrorTest(
                        "with empty typeNameOrType",
                        "",
                        () => {},
                        new PreConditionError(
                            "Expression: typeName",
                            "Expected:   not empty",
                            "Actual:     \"\"",
                        ),
                    )
                    testTypeErrorTest(
                        "with undefined testAction",
                        "abc",
                        undefined!,
                        new PreConditionError(
                            "Expression: testAction",
                            "Expected:   not undefined and not null",
                            "Actual:     undefined",
                        ),
                    )
                    testTypeErrorTest(
                        "with null testAction",
                        "abc",
                        null!,
                        new PreConditionError(
                            "Expression: testAction",
                            "Expected:   not undefined and not null",
                            "Actual:     undefined",
                        ),
                    )
                });

                runner.testGroup("with undefined skip", () =>
                {
                    function testTypeErrorTest(testName: string, typeNameOrType: string | Type<unknown>, testAction: () => void, expected: Error): void
                    {
                        runner.test(testName, (test: Test) =>
                        {
                            const runner2: TestRunner = creator();
                            test.assertThrows(() => runner2.testType(typeNameOrType, undefined, testAction), expected);
                        })
                    }

                    testTypeErrorTest(
                        "with undefined typeNameOrType",
                        undefined!,
                        () => {},
                        new PreConditionError(
                            "Expression: typeNameOrType",
                            "Expected:   not undefined and not null",
                            "Actual:     undefined",
                        ),
                    )
                    testTypeErrorTest(
                        "with null typeNameOrType",
                        null!,
                        () => {},
                        new PreConditionError(
                            "Expression: typeNameOrType",
                            "Expected:   not undefined and not null",
                            "Actual:     null",
                        ),
                    )
                    testTypeErrorTest(
                        "with empty typeNameOrType",
                        "",
                        () => {},
                        new PreConditionError(
                            "Expression: typeName",
                            "Expected:   not empty",
                            "Actual:     \"\"",
                        ),
                    )
                    testTypeErrorTest(
                        "with undefined testAction",
                        "abc",
                        undefined!,
                        new PreConditionError(
                            "Expression: testAction",
                            "Expected:   not undefined and not null",
                            "Actual:     undefined",
                        ),
                    )
                    testTypeErrorTest(
                        "with null testAction",
                        "abc",
                        null!,
                        new PreConditionError(
                            "Expression: testAction",
                            "Expected:   not undefined and not null",
                            "Actual:     null",
                        ),
                    )
                });

                runner.testGroup("with null skip", () =>
                {
                    function testTypeErrorTest(testName: string, typeNameOrType: string | Type<unknown>, testAction: () => void, expected: Error): void
                    {
                        runner.test(testName, (test: Test) =>
                        {
                            const runner2: TestRunner = creator();
                            test.assertThrows(() => runner2.testType(typeNameOrType, null!, testAction), expected);
                        })
                    }

                    testTypeErrorTest(
                        "with undefined typeNameOrType",
                        undefined!,
                        () => {},
                        new PreConditionError(
                            "Expression: typeNameOrType",
                            "Expected:   not undefined and not null",
                            "Actual:     undefined",
                        ),
                    )
                    testTypeErrorTest(
                        "with null typeNameOrType",
                        null!,
                        () => {},
                        new PreConditionError(
                            "Expression: typeNameOrType",
                            "Expected:   not undefined and not null",
                            "Actual:     null",
                        ),
                    )
                    testTypeErrorTest(
                        "with empty typeNameOrType",
                        "",
                        () => {},
                        new PreConditionError(
                            "Expression: typeName",
                            "Expected:   not empty",
                            "Actual:     \"\"",
                        ),
                    )
                    testTypeErrorTest(
                        "with undefined testAction",
                        "abc",
                        undefined!,
                        new PreConditionError(
                            "Expression: testAction",
                            "Expected:   not undefined and not null",
                            "Actual:     undefined",
                        ),
                    )
                    testTypeErrorTest(
                        "with null testAction",
                        "abc",
                        null!,
                        new PreConditionError(
                            "Expression: testAction",
                            "Expected:   not undefined and not null",
                            "Actual:     null",
                        ),
                    )
                });

                runner.testGroup("with skip", () =>
                {
                    function testTypeErrorTest(testName: string, typeNameOrType: string | Type<unknown>, testAction: () => void, expected: Error): void
                    {
                        runner.test(testName, (test: Test) =>
                        {
                            const runner2: TestRunner = creator();
                            const skip: TestSkip = runner2.skip();
                            test.assertThrows(() => runner2.testType(typeNameOrType, skip, testAction), expected);
                        })
                    }

                    testTypeErrorTest(
                        "with undefined typeNameOrType",
                        undefined!,
                        () => {},
                        new PreConditionError(
                            "Expression: typeNameOrType",
                            "Expected:   not undefined and not null",
                            "Actual:     undefined",
                        ),
                    )
                    testTypeErrorTest(
                        "with null typeNameOrType",
                        null!,
                        () => {},
                        new PreConditionError(
                            "Expression: typeNameOrType",
                            "Expected:   not undefined and not null",
                            "Actual:     null",
                        ),
                    )
                    testTypeErrorTest(
                        "with empty typeNameOrType",
                        "",
                        () => {},
                        new PreConditionError(
                            "Expression: typeName",
                            "Expected:   not empty",
                            "Actual:     \"\"",
                        ),
                    )
                    testTypeErrorTest(
                        "with undefined testAction",
                        "abc",
                        undefined!,
                        new PreConditionError(
                            "Expression: testAction",
                            "Expected:   not undefined and not null",
                            "Actual:     undefined",
                        ),
                    )
                    testTypeErrorTest(
                        "with null testAction",
                        "abc",
                        null!,
                        new PreConditionError(
                            "Expression: testAction",
                            "Expected:   not undefined and not null",
                            "Actual:     null",
                        ),
                    )
                });
            });

            runner.testFunction("testFunction()", () =>
            {
                runner.testGroup("with no skip", () =>
                {
                    function testFunctionErrorTest(testName: string, functionSignature: string, testAction: () => void, expected: Error): void
                    {
                        runner.test(testName, (test: Test) =>
                        {
                            const runner2: TestRunner = creator();
                            test.assertThrows(() => runner2.testFunction(functionSignature, testAction), expected);
                        })
                    }

                    testFunctionErrorTest(
                        "with undefined functionSignature",
                        undefined!,
                        () => {},
                        new PreConditionError(
                            "Expression: functionSignature",
                            "Expected:   not undefined and not null",
                            "Actual:     undefined",
                        ),
                    )
                    testFunctionErrorTest(
                        "with null functionSignature",
                        null!,
                        () => {},
                        new PreConditionError(
                            "Expression: functionSignature",
                            "Expected:   not undefined and not null",
                            "Actual:     null",
                        ),
                    )
                    testFunctionErrorTest(
                        "with empty functionSignature",
                        "",
                        () => {},
                        new PreConditionError(
                            "Expression: functionSignature",
                            "Expected:   not empty",
                            "Actual:     \"\"",
                        ),
                    )
                    testFunctionErrorTest(
                        "with undefined testAction",
                        "abc",
                        undefined!,
                        new PreConditionError(
                            "Expression: testAction",
                            "Expected:   not undefined and not null",
                            "Actual:     undefined",
                        ),
                    )
                    testFunctionErrorTest(
                        "with null testAction",
                        "abc",
                        null!,
                        new PreConditionError(
                            "Expression: testAction",
                            "Expected:   not undefined and not null",
                            "Actual:     undefined",
                        ),
                    )
                });

                runner.testGroup("with undefined skip", () =>
                {
                    function testFunctionErrorTest(testName: string, functionSignature: string, testAction: () => void, expected: Error): void
                    {
                        runner.test(testName, (test: Test) =>
                        {
                            const runner2: TestRunner = creator();
                            test.assertThrows(() => runner2.testFunction(functionSignature, undefined, testAction), expected);
                        })
                    }

                    testFunctionErrorTest(
                        "with undefined functionSignature",
                        undefined!,
                        () => {},
                        new PreConditionError(
                            "Expression: functionSignature",
                            "Expected:   not undefined and not null",
                            "Actual:     undefined",
                        ),
                    )
                    testFunctionErrorTest(
                        "with null functionSignature",
                        null!,
                        () => {},
                        new PreConditionError(
                            "Expression: functionSignature",
                            "Expected:   not undefined and not null",
                            "Actual:     null",
                        ),
                    )
                    testFunctionErrorTest(
                        "with empty functionSignature",
                        "",
                        () => {},
                        new PreConditionError(
                            "Expression: functionSignature",
                            "Expected:   not empty",
                            "Actual:     \"\"",
                        ),
                    )
                    testFunctionErrorTest(
                        "with undefined testAction",
                        "abc",
                        undefined!,
                        new PreConditionError(
                            "Expression: testAction",
                            "Expected:   not undefined and not null",
                            "Actual:     undefined",
                        ),
                    )
                    testFunctionErrorTest(
                        "with null testAction",
                        "abc",
                        null!,
                        new PreConditionError(
                            "Expression: testAction",
                            "Expected:   not undefined and not null",
                            "Actual:     null",
                        ),
                    )
                });

                runner.testGroup("with null skip", () =>
                {
                    function testFunctionErrorTest(testName: string, functionSignature: string, testAction: () => void, expected: Error): void
                    {
                        runner.test(testName, (test: Test) =>
                        {
                            const runner2: TestRunner = creator();
                            test.assertThrows(() => runner2.testFunction(functionSignature, null!, testAction), expected);
                        })
                    }

                    testFunctionErrorTest(
                        "with undefined functionSignature",
                        undefined!,
                        () => {},
                        new PreConditionError(
                            "Expression: functionSignature",
                            "Expected:   not undefined and not null",
                            "Actual:     undefined",
                        ),
                    )
                    testFunctionErrorTest(
                        "with null functionSignature",
                        null!,
                        () => {},
                        new PreConditionError(
                            "Expression: functionSignature",
                            "Expected:   not undefined and not null",
                            "Actual:     null",
                        ),
                    )
                    testFunctionErrorTest(
                        "with empty functionSignature",
                        "",
                        () => {},
                        new PreConditionError(
                            "Expression: functionSignature",
                            "Expected:   not empty",
                            "Actual:     \"\"",
                        ),
                    )
                    testFunctionErrorTest(
                        "with undefined testAction",
                        "abc",
                        undefined!,
                        new PreConditionError(
                            "Expression: testAction",
                            "Expected:   not undefined and not null",
                            "Actual:     undefined",
                        ),
                    )
                    testFunctionErrorTest(
                        "with null testAction",
                        "abc",
                        null!,
                        new PreConditionError(
                            "Expression: testAction",
                            "Expected:   not undefined and not null",
                            "Actual:     null",
                        ),
                    )
                });

                runner.testGroup("with skip", () =>
                {
                    function testFunctionErrorTest(testName: string, functionSignature: string, testAction: () => void, expected: Error): void
                    {
                        runner.test(testName, (test: Test) =>
                        {
                            const runner2: TestRunner = creator();
                            const skip: TestSkip = runner2.skip();
                            test.assertThrows(() => runner2.testFunction(functionSignature, skip, testAction), expected);
                        })
                    }

                    testFunctionErrorTest(
                        "with undefined functionSignature",
                        undefined!,
                        () => {},
                        new PreConditionError(
                            "Expression: functionSignature",
                            "Expected:   not undefined and not null",
                            "Actual:     undefined",
                        ),
                    )
                    testFunctionErrorTest(
                        "with null functionSignature",
                        null!,
                        () => {},
                        new PreConditionError(
                            "Expression: functionSignature",
                            "Expected:   not undefined and not null",
                            "Actual:     null",
                        ),
                    )
                    testFunctionErrorTest(
                        "with empty functionSignature",
                        "",
                        () => {},
                        new PreConditionError(
                            "Expression: functionSignature",
                            "Expected:   not empty",
                            "Actual:     \"\"",
                        ),
                    )
                    testFunctionErrorTest(
                        "with undefined testAction",
                        "abc",
                        undefined!,
                        new PreConditionError(
                            "Expression: testAction",
                            "Expected:   not undefined and not null",
                            "Actual:     undefined",
                        ),
                    )
                    testFunctionErrorTest(
                        "with null testAction",
                        "abc",
                        null!,
                        new PreConditionError(
                            "Expression: testAction",
                            "Expected:   not undefined and not null",
                            "Actual:     null",
                        ),
                    )
                });
            });
        });
    });
}