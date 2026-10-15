import { CharacterWriteStream, CurrentProcess, FileSystem, InMemoryCharacterWriteStream, Iterable, JavascriptIterable, NodeJSFileSystem, PreConditionError } from "../sources/index.js";
import { Test } from "./test.js";
import { TestRunner } from "./testRunner.js";

export function test(runner: TestRunner): void
{
    runner.testFile("CurrentProcess.ts", () =>
    {
        runner.testType("CurrentProcess", () =>
        {
            runner.testFunction("create()", (test: Test) =>
            {
                const currentProcess: CurrentProcess = CurrentProcess.create();
                test.assertNotUndefinedAndNotNull(currentProcess);
            });

            runner.testFunction("getArguments()", (test: Test) =>
            {
                const currentProcess: CurrentProcess = CurrentProcess.create();
                const args: Iterable<string> = currentProcess.getArguments();
                test.assertNotUndefinedAndNotNull(args);
                test.assertTrue(Iterable.getCount(args).await() >= 2);
            });

            runner.testFunction("setArguments()", () =>
            {
                function setArgumentsErrorTest(args: JavascriptIterable<string>, expected: Error): void
                {
                    runner.test(`with ${runner.toString(args)}`, (test: Test) =>
                    {
                        const currentProcess: CurrentProcess = CurrentProcess.create();
                        test.assertThrows(() => currentProcess.setArguments(args), expected);
                    });
                }

                setArgumentsErrorTest(undefined!, new PreConditionError({
                    expression: "args",
                    expectedString: "not undefined and not null",
                    actualString: "undefined",
                }));
                setArgumentsErrorTest(null!, new PreConditionError({
                    expression: "args",
                    expectedString: "not undefined and not null",
                    actualString: "null",
                }));

                runner.test("with multiple calls to setArguments()", (test: Test) =>
                {
                    const currentProcess: CurrentProcess = CurrentProcess.create();

                    currentProcess.setArguments(["a", "b", "c"]);
                    test.assertEqual(currentProcess.getArguments(), Iterable.create(["a", "b", "c"]));

                    test.assertThrows(() => currentProcess.setArguments(["d", "e"]), new PreConditionError({
                        expression: "this.args",
                        expectedString: "undefined",
                        actualString: `["a","b","c"]`,
                    }));
                });

                function setArgumentsTest(args: JavascriptIterable<string>): void
                {
                    runner.test(`with ${runner.toString(args)}`, (test: Test) =>
                    {
                        const currentProcess: CurrentProcess = CurrentProcess.create();

                        const result: CurrentProcess = currentProcess.setArguments(args);
                        test.assertSame(result, currentProcess);
                        test.assertEqual(currentProcess.getArguments(), Iterable.create(args));
                    });
                }

                setArgumentsTest([]);
                setArgumentsTest(["a"]);
                setArgumentsTest(["a", "b"]);
            });

            runner.testFunction("getOutputWriteStream()", (test: Test) =>
            {
                const currentProcess: CurrentProcess = CurrentProcess.create();
                const output: CharacterWriteStream = currentProcess.getOutputWriteStream();
                test.assertNotUndefinedAndNotNull(output);
            });

            runner.testFunction("setOutputWriteStream()", () =>
            {
                function setOutputWriteStreamErrorTest(output: CharacterWriteStream, expected: Error): void
                {
                    runner.test(`with ${runner.toString(output)}`, (test: Test) =>
                    {
                        const currentProcess: CurrentProcess = CurrentProcess.create();
                        test.assertThrows(() => currentProcess.setOutputWriteStream(output), expected);
                    });
                }

                setOutputWriteStreamErrorTest(undefined!, new PreConditionError({
                    expression: "outputWriteStream",
                    expectedString: "not undefined and not null",
                    actualString: "undefined",
                }));
                setOutputWriteStreamErrorTest(null!, new PreConditionError({
                    expression: "outputWriteStream",
                    expectedString: "not undefined and not null",
                    actualString: "null",
                }));

                runner.test(`with defined write stream`, (test: Test) =>
                {
                    const currentProcess: CurrentProcess = CurrentProcess.create();
                    const writeStream: InMemoryCharacterWriteStream = InMemoryCharacterWriteStream.create();

                    const result: CurrentProcess = currentProcess.setOutputWriteStream(writeStream);
                    test.assertSame(result, currentProcess);
                    test.assertSame(currentProcess.getOutputWriteStream(), writeStream);
                });

                runner.test(`with multiple attempts at setting the stream`, (test: Test) =>
                {
                    const currentProcess: CurrentProcess = CurrentProcess.create();
                    const writeStream: InMemoryCharacterWriteStream = InMemoryCharacterWriteStream.create();

                    const result: CurrentProcess = currentProcess.setOutputWriteStream(writeStream);
                    test.assertSame(result, currentProcess);
                    test.assertSame(currentProcess.getOutputWriteStream(), writeStream);

                    test.assertThrows(() => currentProcess.setOutputWriteStream(writeStream), new PreConditionError({
                        expression: "this.outputWriteStream",
                        expectedString: "undefined",
                        actualString: `defined`,
                    }));
                });

                runner.test(`with attempt to set the stream after calling getOutputWriteStream()`, (test: Test) =>
                {
                    const currentProcess: CurrentProcess = CurrentProcess.create();
                    const writeStream: InMemoryCharacterWriteStream = InMemoryCharacterWriteStream.create();
                    const currentWriteStream: CharacterWriteStream = currentProcess.getOutputWriteStream();

                    test.assertThrows(() => currentProcess.setOutputWriteStream(writeStream), new PreConditionError({
                        expression: "this.outputWriteStream",
                        expectedString: "undefined",
                        actualString: `defined`,
                    }));
                    test.assertSame(currentProcess.getOutputWriteStream(), currentWriteStream);
                });
            });

            runner.testFunction("getFileSystem()", (test: Test) =>
            {
                const currentProcess: CurrentProcess = CurrentProcess.create();
                const fileSystem: FileSystem = currentProcess.getFileSystem();
                test.assertNotUndefinedAndNotNull(fileSystem);
            });

            runner.testFunction("setFileSystem()", () =>
            {
                function setFileSystemErrorTest(fileSystem: FileSystem, expected: Error): void
                {
                    runner.test(`with ${runner.toString(fileSystem)}`, (test: Test) =>
                    {
                        const currentProcess: CurrentProcess = CurrentProcess.create();
                        test.assertThrows(() => currentProcess.setFileSystem(fileSystem), expected);
                    });
                }

                setFileSystemErrorTest(undefined!, new PreConditionError({
                    expression: "fileSystem",
                    expectedString: "not undefined and not null",
                    actualString: "undefined",
                }));
                setFileSystemErrorTest(null!, new PreConditionError({
                    expression: "fileSystem",
                    expectedString: "not undefined and not null",
                    actualString: "null",
                }));

                runner.test("with defined", (test: Test) =>
                {
                    const currentProcess: CurrentProcess = CurrentProcess.create();
                    const fileSystem: FileSystem = NodeJSFileSystem.create();

                    const result: CurrentProcess = currentProcess.setFileSystem(fileSystem);
                    test.assertSame(result, currentProcess);
                    test.assertSame(currentProcess.getFileSystem(), fileSystem);
                });

                runner.test("with multiple attempts at setting the file system", (test: Test) =>
                {
                    const currentProcess: CurrentProcess = CurrentProcess.create();
                    const fileSystem: FileSystem = NodeJSFileSystem.create();

                    const result: CurrentProcess = currentProcess.setFileSystem(fileSystem);
                    test.assertSame(result, currentProcess);
                    test.assertSame(currentProcess.getFileSystem(), fileSystem);

                    test.assertThrows(() => currentProcess.setFileSystem(NodeJSFileSystem.create()), new PreConditionError({
                        expression: "this.fileSystem",
                        expectedString: "undefined",
                        actualString: "defined",
                    }));
                    test.assertSame(currentProcess.getFileSystem(), fileSystem);
                });
            });
        });
    });
}