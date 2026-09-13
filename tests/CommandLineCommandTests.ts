import { CommandLineParameter, InMemoryCharacterWriteStream, Iterable, join, List, PreConditionError } from "../sources/index.js";
import { CommandLineCommand } from "../sources/CommandLineCommand.js";
import { Test } from "./test.js";
import { TestRunner } from "./testRunner.js";

export function test(runner: TestRunner): void
{
    runner.testFile("CommandLineCommand.ts", () =>
    {
        runner.testType("CommandLineCommand", () =>
        {
            runner.testFunction("create()", () =>
            {
                function withNameErrorTest(name: string, expected: Error): void
                {
                    runner.test(`with ${runner.toString(name)}`, (test: Test) =>
                    {
                        test.assertThrows(() => CommandLineCommand.create({ name }), expected);
                    });
                }

                withNameErrorTest(undefined!, new PreConditionError({
                    expression: "name",
                    expected: "not undefined and not null",
                    actual: "undefined",
                }));
                withNameErrorTest(null!, new PreConditionError({
                    expression: "name",
                    expected: "not undefined and not null",
                    actual: "null",
                }));
                withNameErrorTest("", new PreConditionError({
                    expression: "name",
                    expected: "not empty",
                    actual: `""`,
                }));

                function withNameTest(name: string): void
                {
                    runner.test(`with ${runner.toString(name)}`, (test: Test) =>
                    {
                        const command: CommandLineCommand = CommandLineCommand.create({ name });
                        test.assertNotUndefinedAndNotNull(command);
                        test.assertEqual(name, command.getName());
                        test.assertEqual(Iterable.create(), command.getAliases());
                        test.assertEqual(Iterable.create([name]), command.getNameAndAliases());
                        test.assertEqual("", command.getDescription());
                        test.assertEqual(1, command.getParameters().getCount().await());
                    });
                }

                withNameTest("a");
                withNameTest("apples");
                withNameTest("hello there");
                withNameTest("ABC!@#");
            });

            runner.testFunction("addParameter()", () =>
            {
                function addParameterNameErrorTest(name: string, expected: Error): void
                {
                    runner.test(`with ${runner.toString(name)}`, (test: Test) =>
                    {
                        const command: CommandLineCommand = CommandLineCommand.create({ name: "fake-command-name" });
                        test.assertThrows(() => command.addParameter(name), expected);
                        test.assertEqual(1, command.getParameters().getCount().await());
                        test.assertEqual("help", command.getParameters().first().await().getName());
                    });
                }

                addParameterNameErrorTest(undefined!, new PreConditionError({
                    expression: "name",
                    expected: "not undefined and not null",
                    actual: "undefined",
                }));
                addParameterNameErrorTest(null!, new PreConditionError({
                    expression: "name",
                    expected: "not undefined and not null",
                    actual: "undefined",
                }));
                addParameterNameErrorTest("", new PreConditionError({
                    expression: "name",
                    expected: "not empty",
                    actual: `""`,
                }));

                function addParameterNameTest(name: string): void
                {
                    runner.test(`with ${runner.toString(name)}`, (test: Test) =>
                    {
                        const command: CommandLineCommand = CommandLineCommand.create({ name: "fake-command-name" });
                        const parameter: CommandLineParameter = command.addParameter(name);
                        test.assertNotUndefinedAndNotNull(parameter);
                        test.assertEqual(name, parameter.getName());
                        test.assertEqual([], parameter.getAliases());
                        test.assertEqual(Iterable.create([name]), parameter.getNameAndAliases());
                        test.assertEqual("", parameter.getDescription());
                        test.assertEqual(2, command.getParameters().getCount().await());
                        test.assertSame(parameter, command.getParameters().first().await());
                    });
                }

                addParameterNameTest("a");
            });

            runner.testFunction("addCommand()", () =>
            {
                runner.test("with basic sub-command", (test: Test) =>
                {
                    const command: CommandLineCommand = CommandLineCommand.create({ name: "fake-command" });
                    
                    const subCommand: CommandLineCommand = command.addCommand({ name: "fake-sub-command" });
                    test.assertNotUndefinedAndNotNull(subCommand);
                    test.assertEqual("fake-sub-command", subCommand.getName());
                    test.assertEqual(1, command.getCommands().getCount().await());
                    
                    subCommand.addParameter("apples", ["a"], "fake-apples-description");
                    test.assertEqual(2, subCommand.getParameters().getCount().await());
                    test.assertEqual("apples", subCommand.getParameters().first().await().getName());
                    test.assertEqual("help", subCommand.getParameters().last().await().getName());
                });
            });

            runner.testFunction("showHelp()", () =>
            {
                runner.test("with no arguments", async (test: Test) =>
                {
                    const writeStream: InMemoryCharacterWriteStream = InMemoryCharacterWriteStream.create();
                    const command: CommandLineCommand = CommandLineCommand.create({
                        name: "fake-command",
                        aliases: ["fc"],
                        description: "fake-command-description",
                        arguments: [],
                        writeStream,
                    });

                    const showHelpResult: boolean = await command.showHelp();
                    test.assertFalse(showHelpResult);
                    test.assertEqual("", writeStream.getWrittenText());
                });

                runner.test("with no command parameters", async (test: Test) =>
                {
                    const writeStream: InMemoryCharacterWriteStream = InMemoryCharacterWriteStream.create();
                    const command: CommandLineCommand = CommandLineCommand.create({
                        name: "fake-command",
                        aliases: ["fc"],
                        description: "fake-command-description",
                        writeStream,
                        arguments: ["--help"],
                    });

                    const showHelpResult: boolean = await command.showHelp();
                    test.assertTrue(showHelpResult);
                    test.assertEqual(writeStream.getWrittenText(), join("\n", [
                        "Command:     fake-command [fc]",
                        "Description: fake-command-description",
                        "Parameters:",
                        "--help [-?]: Show the command's help menu.",
                        "",
                    ]));
                });

                runner.test("with parameters", async (test: Test) =>
                {
                    const writeStream: InMemoryCharacterWriteStream = InMemoryCharacterWriteStream.create();
                    const command: CommandLineCommand = CommandLineCommand.create({
                        name: "fake-command",
                        aliases: ["fc"],
                        description: "fake-command-description",
                        arguments: ["--help"],
                        writeStream,
                    });
                    command.addParameter("apples", ["a", "ap"], "How many apples?");
                    command.addParameter("vegetarian", ["v", "veg"], "Should it be vegetarian?");

                    const showHelpResult: boolean = await command.showHelp();
                    test.assertTrue(showHelpResult);
                    test.assertEqual(writeStream.getWrittenText(), join("\n", [
                        "Command:     fake-command [fc]",
                        "Description: fake-command-description",
                        "Parameters:",
                        "--apples [-a,-ap]:      How many apples?",
                        "--vegetarian [-v,-veg]: Should it be vegetarian?",
                        "--help [-?]:            Show the command's help menu.",
                        "",
                    ]));
                });
            });

            runner.testFunction("run()", () =>
            {
                runner.test("with no sub-commands and no arguments", async (test: Test) =>
                {
                    let values: List<number> = List.create();

                    const command: CommandLineCommand = CommandLineCommand.create({
                        name: "a",
                        action: () => { values.add(1); },
                    });
                    test.assertEqual(values, List.create([]));
                    
                    const result: void | number = await command.run();
                    test.assertUndefined(result);

                    test.assertEqual(values, List.create([1]));
                });

                runner.test("with no sub-commands and 1 argument", async (test: Test) =>
                {
                    let values: List<number> = List.create();

                    const command: CommandLineCommand = CommandLineCommand.create({
                        name: "a",
                        arguments: ["b"],
                        action: () => { values.add(1); },
                    });
                    test.assertEqual(values, List.create([]));
                    
                    const result: void | number = await command.run();
                    test.assertUndefined(result);

                    test.assertEqual(values, List.create([1]));
                });

                runner.test("with 1 sub-command and no arguments", async (test: Test) =>
                {
                    const values: List<number> = List.create();

                    const command: CommandLineCommand = CommandLineCommand.create({
                        name: "a",
                        action: () => { values.add(1); },
                    });
                    command.addCommand({
                        name: "b",
                        action: () => { values.add(2); },
                    });
                    
                    const result: void | number = await command.run();
                    test.assertUndefined(result);

                    test.assertEqual(values, List.create([1]));
                });

                runner.test("with 1 sub-command and matching command name argument", async (test: Test) =>
                {
                    const values: List<number> = List.create();

                    const command: CommandLineCommand = CommandLineCommand.create({
                        name: "a",
                        arguments: ["b"],
                        action: () => { values.add(1); },
                    });
                    command.addCommand({
                        name: "b",
                        action: () => { values.add(2); },
                    });
                    
                    const result: void | number = await command.run();
                    test.assertUndefined(result);

                    test.assertEqual(values, List.create([2]));
                });

                runner.test("with 1 sub-command and non-matching command name argument", async (test: Test) =>
                {
                    const values: List<number> = List.create();

                    const command: CommandLineCommand = CommandLineCommand.create({
                        name: "a",
                        arguments: ["c"],
                        action: () => { values.add(1); },
                    });
                    command.addCommand({
                        name: "b",
                        action: () => { values.add(2); },
                    });
                    
                    const result: void | number = await command.run();
                    test.assertUndefined(result);

                    test.assertEqual(values, List.create([1]));
                });

                runner.test("with 1 sub-command, matching command name argument, and --help argument", async (test: Test) =>
                {
                    const values: List<number> = List.create();
                    const writeStream: InMemoryCharacterWriteStream = InMemoryCharacterWriteStream.create();

                    const command: CommandLineCommand = CommandLineCommand.create({
                        name: "a",
                        arguments: ["b", "--help"],
                        writeStream,
                        action: () => { values.add(1); },
                    });
                    command.addCommand({
                        name: "b",
                        action: () => { values.add(2); },
                    });
                    
                    const result: void | number = await command.run();
                    test.assertEqual(-1, result);
                    test.assertEqual(values, List.create([]));
                    test.assertEqual(writeStream.getWrittenText(), join("\n", [
                        "Command: a b",
                        "Parameters:",
                        "--help [-?]: Show the command's help menu.",
                        "",
                    ]));
                });
            });
        });
    });
}