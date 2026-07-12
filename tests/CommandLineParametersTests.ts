import { CommandLineParameters, Iterable, JavascriptIterable, PreConditionError } from "../sources/index.js";
import { Test } from "./test.js";
import { TestRunner } from "./testRunner.js";

export function test(runner: TestRunner): void
{
    runner.testFile("commandLineParameters.ts", () =>
    {
        runner.testType("CommandLineParameters", () =>
        {
            runner.testFunction("create()", () =>
            {
                function createErrorTest(argv: JavascriptIterable<string>, expected: Error): void
                {
                    runner.test(`with ${runner.toString(argv)}`, (test: Test) =>
                    {
                        test.assertThrows(() => CommandLineParameters.create(argv), expected);
                    });
                }

                createErrorTest(undefined!, new PreConditionError(
                    "Expression: argv",
                    "Expected: not undefined and not null",
                    "Actual: undefined",
                ));
                createErrorTest(null!, new PreConditionError(
                    "Expression: argv",
                    "Expected: not undefined and not null",
                    "Actual: null",
                ));

                function createTest(argv: JavascriptIterable<string>): void
                {
                    runner.test(`with ${runner.toString(argv)}`, (test: Test) =>
                    {
                        const parameters: CommandLineParameters = CommandLineParameters.create(argv);
                        test.assertNotUndefinedAndNotNull(parameters);
                        test.assertEqual(parameters.getArguments(), Iterable.create(argv));
                    });
                }

                createTest([]);
                createTest(["a"]);
            });

            runner.testFunction("getArgumentName()", () =>
            {
                function getArgumentNameTest(arg: string, expected: string | undefined): void
                {
                    runner.test(`with ${runner.toString(arg)}`, (test: Test) =>
                    {
                        test.assertEqual(CommandLineParameters.getArgumentName(arg), expected);
                    });
                }

                getArgumentNameTest("", undefined);
                getArgumentNameTest("  ", undefined);
                getArgumentNameTest("abc", undefined);
                getArgumentNameTest("-", "");
                getArgumentNameTest("--", "");
                getArgumentNameTest("-a", "a");
                getArgumentNameTest("--b", "b");
                getArgumentNameTest("-apples", "apples");
                getArgumentNameTest("--bananas", "bananas");
                getArgumentNameTest("---cat", "-cat");
            });

            runner.testFunction("getNamedArgumentStringValue()", () =>
            {
                function getNamedArgumentStringValueErrorTest(args: string[], nameOrNames: string | JavascriptIterable<string>, expected: Error): void
                {
                    runner.test(`with ${runner.andList([args, nameOrNames])}`, (test: Test) =>
                    {
                        const parameters: CommandLineParameters = CommandLineParameters.create(args);
                        test.assertThrows(() => parameters.getNamedArgumentStringValue(nameOrNames).await(), expected);
                    });
                }

                getNamedArgumentStringValueErrorTest([], undefined!, new PreConditionError(
                    "Expression: nameOrNames",
                    "Expected: not undefined and not null",
                    "Actual: undefined",
                ));
                getNamedArgumentStringValueErrorTest([], null!, new PreConditionError(
                    "Expression: nameOrNames",
                    "Expected: not undefined and not null",
                    "Actual: null",
                ));
                getNamedArgumentStringValueErrorTest([], "", new PreConditionError(
                    "Expression: nameOrNames",
                    "Expected: not empty",
                    "Actual: \"\"",
                ));
                getNamedArgumentStringValueErrorTest([], [], new PreConditionError(
                    "Expression: nameOrNames",
                    "Expected: not empty",
                    "Actual: []",
                ));
                getNamedArgumentStringValueErrorTest([], "a", new PreConditionError(
                    "No argument found that matches \"a\".",
                ));
                getNamedArgumentStringValueErrorTest([], ["a", "b"], new PreConditionError(
                    "No argument found that matches \"a\" or \"b\".",
                ));
                getNamedArgumentStringValueErrorTest([], ["a", "b", "c"], new PreConditionError(
                    "No argument found that matches \"a\", \"b\", or \"c\".",
                ));
            });
        });
    });
}