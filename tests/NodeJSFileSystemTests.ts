import { FileNotFoundError } from "../sources/FileNotFoundError.js";
import { FolderAlreadyExistsError } from "../sources/FolderAlreadyExists.js";
import { File, FileAlreadyExistsError, Folder, FolderNotFoundError, Iterator, NodeJSFileSystem, Path, PreConditionError } from "../sources/index.js";
import { Test } from "./test.js";
import { TestRunner } from "./testRunner.js";

export function test(runner: TestRunner): void
{
    runner.testFile("NodeJSFileSystem.ts", () =>
    {
        runner.testType("NodeJSFileSystem", () =>
        {
            runner.testFunction("create()", (test: Test) =>
            {
                const fileSystem: NodeJSFileSystem = NodeJSFileSystem.create();
                test.assertNotUndefinedAndNotNull(fileSystem);
            });

            runner.testFunction("getFolder()", () =>
            {
                function getFolderErrorTest(path: string | Path, expected: Error): void
                {
                    runner.test(`with ${runner.toString(path)}`, (test: Test) =>
                    {
                        const fileSystem: NodeJSFileSystem = NodeJSFileSystem.create();
                        test.assertThrows(() => fileSystem.getFolder(path).await(), expected);
                    });
                }

                getFolderErrorTest(undefined!, new PreConditionError({
                    expression: "path",
                    expectedString: "not undefined and not null",
                    actualString: "undefined",
                }));
                getFolderErrorTest(null!, new PreConditionError({
                    expression: "path",
                    expectedString: "not undefined and not null",
                    actualString: "null",
                }));
                getFolderErrorTest("", new PreConditionError({
                    expression: "pathString",
                    expectedString: "not empty",
                    actualString: `""`,
                }));
                getFolderErrorTest("hello", new PreConditionError({
                    expression: "path.isAbsolute()",
                    expectedString: "true",
                    actualString: "false",
                }));

                function getFolderTest(path: string | Path): void
                {
                    runner.test(`with ${runner.toString(path)}`, (test: Test) =>
                    {
                        const fileSystem: NodeJSFileSystem = NodeJSFileSystem.create();
                        const folder: Folder = fileSystem.getFolder(path).await();
                        test.assertNotUndefinedAndNotNull(folder);
                        test.assertEqual(folder.getPath(), Path.ensurePath(path).await());
                    });
                }

                getFolderTest("/");
                getFolderTest("/i/dont/exist/");
            });

            runner.testFunction("getFile()", () =>
            {
                function getFileErrorTest(path: string | Path, expected: Error): void
                {
                    runner.test(`with ${runner.toString(path)}`, (test: Test) =>
                    {
                        const fileSystem: NodeJSFileSystem = NodeJSFileSystem.create();
                        test.assertThrows(() => fileSystem.getFile(path).await(), expected);
                    });
                }

                getFileErrorTest(undefined!, new PreConditionError({
                    expression: "path",
                    expectedString: "not undefined and not null",
                    actualString: "undefined",
                }));
                getFileErrorTest(null!, new PreConditionError({
                    expression: "path",
                    expectedString: "not undefined and not null",
                    actualString: "null",
                }));
                getFileErrorTest("", new PreConditionError({
                    expression: "pathString",
                    expectedString: "not empty",
                    actualString: `""`,
                }));
                getFileErrorTest("hello", new PreConditionError({
                    expression: "path.isAbsolute()",
                    expectedString: "true",
                    actualString: "false",
                }));

                function getFileTest(path: string | Path): void
                {
                    runner.test(`with ${runner.toString(path)}`, (test: Test) =>
                    {
                        const fileSystem: NodeJSFileSystem = NodeJSFileSystem.create();
                        const file: File = fileSystem.getFile(path).await();
                        test.assertNotUndefinedAndNotNull(file);
                        test.assertEqual(file.getPath(), Path.ensurePath(path).await());
                    });
                }

                getFileTest("/");
                getFileTest("/i/dont/exist/");
                getFileTest("/im/a/test/document.txt");
            });

            runner.testFunction("folderExists()", () =>
            {
                function folderExistsErrorTest(path: string | Path, expected: Error): void
                {
                    runner.test(`with ${runner.toString(path)}`, async (test: Test) =>
                    {
                        const fileSystem: NodeJSFileSystem = NodeJSFileSystem.create();
                        await test.assertThrowsAsync(async () => await fileSystem.folderExists(path), expected);
                    });
                }

                folderExistsErrorTest(undefined!, new PreConditionError({
                    expression: "path",
                    expectedString: "not undefined and not null",
                    actualString: "undefined",
                }));
                folderExistsErrorTest(null!, new PreConditionError({
                    expression: "path",
                    expectedString: "not undefined and not null",
                    actualString: "null",
                }));
                folderExistsErrorTest("", new PreConditionError({
                    expression: "pathString",
                    expectedString: "not empty",
                    actualString: `""`,
                }));
                folderExistsErrorTest("hello", new PreConditionError({
                    expression: "path.isAbsolute()",
                    expectedString: "true",
                    actualString: "false",
                }));

                function folderExistsTest(path: string | Path, expected: boolean): void
                {
                    runner.test(`with ${runner.toString(path)}`, async (test: Test) =>
                    {
                        const fileSystem: NodeJSFileSystem = NodeJSFileSystem.create();
                        test.assertEqual(await fileSystem.folderExists(path), expected);
                    });
                }

                folderExistsTest("/", true);
                folderExistsTest("/i/dont/exist/", false);
            });

            runner.testFunction("fileExists()", () =>
            {
                function fileExistsErrorTest(path: string | Path, expected: Error): void
                {
                    runner.test(`with ${runner.toString(path)}`, async (test: Test) =>
                    {
                        const fileSystem: NodeJSFileSystem = NodeJSFileSystem.create();
                        await test.assertThrowsAsync(async () => await fileSystem.fileExists(path), expected);
                    });
                }

                fileExistsErrorTest(undefined!, new PreConditionError({
                    expression: "path",
                    expectedString: "not undefined and not null",
                    actualString: "undefined",
                }));
                fileExistsErrorTest(null!, new PreConditionError({
                    expression: "path",
                    expectedString: "not undefined and not null",
                    actualString: "null",
                }));
                fileExistsErrorTest("", new PreConditionError({
                    expression: "pathString",
                    expectedString: "not empty",
                    actualString: `""`,
                }));
                fileExistsErrorTest("hello", new PreConditionError({
                    expression: "path.isAbsolute()",
                    expectedString: "true",
                    actualString: "false",
                }));

                function fileExistsTest(path: string | Path, expected: boolean): void
                {
                    runner.test(`with ${runner.toString(path)}`, async (test: Test) =>
                    {
                        const fileSystem: NodeJSFileSystem = NodeJSFileSystem.create();
                        test.assertEqual(await fileSystem.fileExists(path), expected);
                    });
                }

                fileExistsTest("/", false);
                fileExistsTest("/i/dont/exist/", false);
            });

            runner.testFunction("createFile()", () =>
            {
                function createFileErrorTest(filePath: string | Path, expected: Error): void
                {
                    runner.test(`with ${runner.toString(filePath)}`, async (test: Test) =>
                    {
                        const fileSystem: NodeJSFileSystem = NodeJSFileSystem.create();
                        await test.assertThrowsAsync(async () => await fileSystem.createFile(filePath), expected);
                    });
                }

                createFileErrorTest(undefined!, new PreConditionError({
                    expression: "filePath",
                    expectedString: "not undefined and not null",
                    actualString: "undefined",
                }));
                createFileErrorTest(null!, new PreConditionError({
                    expression: "filePath",
                    expectedString: "not undefined and not null",
                    actualString: "null",
                }));
                createFileErrorTest("", new PreConditionError({
                    expression: "pathString",
                    expectedString: "not empty",
                    actualString: `""`,
                }));
                createFileErrorTest("relative/path.txt", new PreConditionError({
                    expression: "filePath.isAbsolute()",
                    expectedString: "true",
                    actualString: "false",
                }));

                runner.test("with file that doesn't exist", async (test: Test) =>
                {
                    const fileSystem: NodeJSFileSystem = NodeJSFileSystem.create();
                    const currentFolderPath: Path = runner.getCurrentFolder().getPath();
                    const filePath: Path = currentFolderPath.concatenate("hellothere.txt");

                    const file: File = await fileSystem.createFile(filePath);
                    try
                    {
                        test.assertNotUndefinedAndNotNull(file);
                        test.assertEqual(file.getPath(), filePath);
                        test.assertTrue(await fileSystem.fileExists(filePath))
                    }
                    finally
                    {
                        await fileSystem.deleteFile(filePath);
                        test.assertFalse(await fileSystem.fileExists(filePath));
                    }
                });

                runner.test("with file that exists", async (test: Test) =>
                {
                    const currentFolderPath: Path = runner.getCurrentFolder().getPath();
                    const filePath: Path = currentFolderPath.concatenate("hellothere.txt");

                    const fileSystem: NodeJSFileSystem = NodeJSFileSystem.create();
                    await fileSystem.createFile(filePath);
                    try
                    {
                        test.assertTrue(await fileSystem.fileExists(filePath));

                        await test.assertThrowsAsync(async () => await fileSystem.createFile(filePath), new FileAlreadyExistsError(fileSystem.getFile(filePath).await()));
                        test.assertTrue(await fileSystem.fileExists(filePath));
                    }
                    finally
                    {
                        await fileSystem.deleteFile(filePath);
                        test.assertFalse(await fileSystem.fileExists(filePath));
                    }
                });
            });

            runner.testFunction("deleteFile()", () =>
            {
                function deleteFileErrorTest(filePath: string | Path, expected: Error): void
                {
                    runner.test(`with ${runner.toString(filePath)}`, async (test: Test) =>
                    {
                        const fileSystem: NodeJSFileSystem = NodeJSFileSystem.create();
                        await test.assertThrowsAsync(async () => await fileSystem.deleteFile(filePath), expected);
                    });
                }

                deleteFileErrorTest(undefined!, new PreConditionError({
                    expression: "filePath",
                    expectedString: "not undefined and not null",
                    actualString: "undefined",
                }));
                deleteFileErrorTest(null!, new PreConditionError({
                    expression: "filePath",
                    expectedString: "not undefined and not null",
                    actualString: "null",
                }));
                deleteFileErrorTest("", new PreConditionError({
                    expression: "pathString",
                    expectedString: "not empty",
                    actualString: `""`,
                }));
                deleteFileErrorTest("relative/path.txt", new PreConditionError({
                    expression: "filePath.isAbsolute()",
                    expectedString: "true",
                    actualString: "false",
                }));

                runner.test("with file that doesn't exist", async (test: Test) =>
                {
                    const fileSystem: NodeJSFileSystem = NodeJSFileSystem.create();
                    const filePath: string = "/i/dont/exist.txt";

                    await test.assertThrowsAsync(async () => await fileSystem.deleteFile(filePath), new FileNotFoundError(fileSystem.getFile(filePath).await()));

                    test.assertFalse(await fileSystem.fileExists(filePath))
                });

                runner.test("with file that exists", async (test: Test) =>
                {
                    const currentFolderPath: Path = runner.getCurrentFolder().getPath();
                    const filePath: Path = currentFolderPath.concatenate("hellothere.txt");

                    const fileSystem: NodeJSFileSystem = NodeJSFileSystem.create();
                    await fileSystem.createFile(filePath);
                    try
                    {
                        test.assertTrue(await fileSystem.fileExists(filePath));
                    }
                    finally
                    {
                        await fileSystem.deleteFile(filePath);
                        test.assertFalse(await fileSystem.fileExists(filePath));
                    }
                });
            });

            runner.testFunction("createFolder()", () =>
            {
                function createFolderErrorTest(folderPath: string | Path, expected: Error): void
                {
                    runner.test(`with ${runner.toString(folderPath)}`, async (test: Test) =>
                    {
                        const fileSystem: NodeJSFileSystem = NodeJSFileSystem.create();
                        await test.assertThrowsAsync(async () => await fileSystem.createFolder(folderPath), expected);
                    });
                }

                createFolderErrorTest(undefined!, new PreConditionError({
                    expression: "folderPath",
                    expectedString: "not undefined and not null",
                    actualString: "undefined",
                }));
                createFolderErrorTest(null!, new PreConditionError({
                    expression: "folderPath",
                    expectedString: "not undefined and not null",
                    actualString: "null",
                }));
                createFolderErrorTest("", new PreConditionError({
                    expression: "pathString",
                    expectedString: "not empty",
                    actualString: `""`,
                }));
                createFolderErrorTest("relative/path", new PreConditionError({
                    expression: "folderPath.isAbsolute()",
                    expectedString: "true",
                    actualString: "false",
                }));

                runner.test("with folder that doesn't exist", async (test: Test) =>
                {
                    const fileSystem: NodeJSFileSystem = NodeJSFileSystem.create();
                    const currentFolderPath: Path = runner.getCurrentFolder().getPath();
                    const folderPath: Path = currentFolderPath.concatenate("hellothere");

                    const folder: Folder = await fileSystem.createFolder(folderPath);
                    try
                    {
                        test.assertNotUndefinedAndNotNull(folder);
                        test.assertEqual(folder.getPath(), folderPath);
                        test.assertTrue(await fileSystem.folderExists(folderPath))
                        test.assertFalse(await fileSystem.fileExists(folderPath));
                    }
                    finally
                    {
                        await fileSystem.deleteFolder(folderPath);
                        test.assertFalse(await fileSystem.folderExists(folderPath));
                    }
                });

                runner.test("with folder that exists", async (test: Test) =>
                {
                    const currentFolderPath: Path = runner.getCurrentFolder().getPath();
                    const folderPath: Path = currentFolderPath.concatenate("hellothere");

                    const fileSystem: NodeJSFileSystem = NodeJSFileSystem.create();
                    await fileSystem.createFolder(folderPath);
                    try
                    {
                        test.assertTrue(await fileSystem.folderExists(folderPath));

                        await test.assertThrowsAsync(async () => await fileSystem.createFolder(folderPath), new FolderAlreadyExistsError(fileSystem.getFolder(folderPath).await()));
                        test.assertTrue(await fileSystem.folderExists(folderPath));
                    }
                    finally
                    {
                        await fileSystem.deleteFolder(folderPath);
                        test.assertFalse(await fileSystem.folderExists(folderPath));
                    }
                });
            });

            runner.testFunction("deleteFolder()", () =>
            {
                function deleteFolderErrorTest(folderPath: string | Path, expected: Error): void
                {
                    runner.test(`with ${runner.toString(folderPath)}`, async (test: Test) =>
                    {
                        const fileSystem: NodeJSFileSystem = NodeJSFileSystem.create();
                        await test.assertThrowsAsync(async () => await fileSystem.deleteFolder(folderPath), expected);
                    });
                }

                deleteFolderErrorTest(undefined!, new PreConditionError({
                    expression: "folderPath",
                    expectedString: "not undefined and not null",
                    actualString: "undefined",
                }));
                deleteFolderErrorTest(null!, new PreConditionError({
                    expression: "folderPath",
                    expectedString: "not undefined and not null",
                    actualString: "null",
                }));
                deleteFolderErrorTest("", new PreConditionError({
                    expression: "pathString",
                    expectedString: "not empty",
                    actualString: `""`,
                }));
                deleteFolderErrorTest("relative/path", new PreConditionError({
                    expression: "folderPath.isAbsolute()",
                    expectedString: "true",
                    actualString: "false",
                }));

                runner.test("with folder that doesn't exist", async (test: Test) =>
                {
                    const fileSystem: NodeJSFileSystem = NodeJSFileSystem.create();
                    const folderPath: string = "/i/dont/exist";
                    test.assertFalse(await fileSystem.folderExists(folderPath));

                    await test.assertThrowsAsync(async () => await fileSystem.deleteFolder(folderPath), new FolderNotFoundError(fileSystem.getFolder(folderPath).await()));

                    test.assertFalse(await fileSystem.folderExists(folderPath))
                });

                runner.test("with folder that exists and is empty", async (test: Test) =>
                {
                    const currentFolderPath: Path = runner.getCurrentFolder().getPath();
                    const folderPath: Path = currentFolderPath.concatenate("hellothere");

                    const fileSystem: NodeJSFileSystem = NodeJSFileSystem.create();
                    await fileSystem.createFolder(folderPath);
                    test.assertTrue(await fileSystem.folderExists(folderPath));

                    await fileSystem.deleteFolder(folderPath);
                    test.assertFalse(await fileSystem.folderExists(folderPath));
                });

                runner.test("with folder that exists and is not empty", async (test: Test) =>
                {
                    const currentFolderPath: Path = runner.getCurrentFolder().getPath();
                    const folderPath: Path = currentFolderPath.concatenate("hellothere");

                    const fileSystem: NodeJSFileSystem = NodeJSFileSystem.create();
                    await fileSystem.createFolder(folderPath);
                    test.assertTrue(await fileSystem.folderExists(folderPath));

                    const filePath: Path = folderPath.concatenate("document.txt");
                    await fileSystem.createFile(filePath);
                    test.assertTrue(await fileSystem.fileExists(filePath));

                    await fileSystem.deleteFolder(folderPath);
                    test.assertFalse(await fileSystem.folderExists(folderPath));
                    test.assertFalse(await fileSystem.fileExists(filePath));
                });
            });

            runner.testFunction("iterateFolderEntries()", () =>
            {
                function iterateFolderEntriesErrorTest(folderPath: string | Path, expected: Error): void
                {
                    runner.test(`with ${folderPath}`, async (test: Test) =>
                    {
                        const fileSystem: NodeJSFileSystem = NodeJSFileSystem.create();
                        await test.assertThrowsAsync(async () => await fileSystem.iterateFolderEntries(folderPath), expected);
                    });
                }

                iterateFolderEntriesErrorTest(undefined!, new PreConditionError({
                    expression: "folderPath",
                    expectedString: "not undefined and not null",
                    actualString: "undefined",
                }));
                iterateFolderEntriesErrorTest(null!, new PreConditionError({
                    expression: "folderPath",
                    expectedString: "not undefined and not null",
                    actualString: "null",
                }));
                iterateFolderEntriesErrorTest("", new PreConditionError({
                    expression: "pathString",
                    expectedString: "not empty",
                    actualString: `""`,
                }));

                runner.test(`with folder that doesn't exist`, async (test: Test) =>
                {
                    const fileSystem: NodeJSFileSystem = NodeJSFileSystem.create();
                    const folderPath: string = "/i/dont/exist";
                    test.assertFalse(await fileSystem.folderExists(folderPath));

                    await test.assertThrowsAsync(async () => await fileSystem.iterateFolderEntries(folderPath), new FolderNotFoundError(fileSystem.getFolder(folderPath).await()));
                });

                runner.test("with folder that exists and is empty", async (test: Test) =>
                {
                    const currentFolderPath: Path = runner.getCurrentFolder().getPath();
                    const folderPath: Path = currentFolderPath.concatenate("hellothere");

                    const fileSystem: NodeJSFileSystem = NodeJSFileSystem.create();
                    await fileSystem.createFolder(folderPath);
                    test.assertTrue(await fileSystem.folderExists(folderPath));
                    try
                    {
                        const entries: Iterator<File | Folder> = await fileSystem.iterateFolderEntries(folderPath);
                        test.assertNotUndefinedAndNotNull(entries);
                        test.assertEqual(entries.toArray().await(), []);
                    }
                    finally
                    {
                        await fileSystem.deleteFolder(folderPath);
                        test.assertFalse(await fileSystem.folderExists(folderPath));
                    }
                });

                runner.test("with folder that has a file", async (test: Test) =>
                {
                    const currentFolderPath: Path = runner.getCurrentFolder().getPath();
                    const folderPath: Path = currentFolderPath.concatenate("hellothere");

                    const fileSystem: NodeJSFileSystem = NodeJSFileSystem.create();
                    await fileSystem.createFolder(folderPath);
                    test.assertTrue(await fileSystem.folderExists(folderPath));
                    try
                    {
                        const filePath: Path = folderPath.concatenate("document.txt");
                        await fileSystem.createFile(filePath);
                        test.assertTrue(await fileSystem.fileExists(filePath));

                        const entries: Iterator<File | Folder> = await fileSystem.iterateFolderEntries(folderPath);
                        test.assertNotUndefinedAndNotNull(entries);
                        test.assertEqual(entries.toArray().await(), [fileSystem.getFile(filePath).await()]);
                    }
                    finally
                    {
                        await fileSystem.deleteFolder(folderPath);
                    }
                });

                runner.test("with folder that has an empty subfolder", async (test: Test) =>
                {
                    const currentFolderPath: Path = runner.getCurrentFolder().getPath();
                    const folderPath: Path = currentFolderPath.concatenate("hellothere");

                    const fileSystem: NodeJSFileSystem = NodeJSFileSystem.create();
                    await fileSystem.createFolder(folderPath);
                    try
                    {
                        const subfolderPath: Path = folderPath.concatenate("subfolder");
                        await fileSystem.createFolder(subfolderPath);

                        const entries: Iterator<File | Folder> = await fileSystem.iterateFolderEntries(folderPath);
                        test.assertNotUndefinedAndNotNull(entries);
                        test.assertEqual(entries.toArray().await(), [fileSystem.getFolder(subfolderPath).await()]);
                    }
                    finally
                    {
                        await fileSystem.deleteFolder(folderPath);
                    }
                });

                runner.test("with folder that has a non-empty subfolder and recursive not defined", async (test: Test) =>
                {
                    const currentFolderPath: Path = runner.getCurrentFolder().getPath();
                    const folderPath: Path = currentFolderPath.concatenate("hellothere");

                    const fileSystem: NodeJSFileSystem = NodeJSFileSystem.create();
                    await fileSystem.createFolder(folderPath);
                    try
                    {
                        const subfolderPath: Path = folderPath.concatenate("subfolder");
                        await fileSystem.createFolder(subfolderPath);


                        const subFolderFilePath: Path = subfolderPath.concatenate("document.txt");
                        await fileSystem.createFile(subFolderFilePath);

                        const entries: Iterator<File | Folder> = await fileSystem.iterateFolderEntries(folderPath);
                        test.assertNotUndefinedAndNotNull(entries);
                        test.assertEqual(entries.toArray().await(), [fileSystem.getFolder(subfolderPath).await()]);
                    }
                    finally
                    {
                        await fileSystem.deleteFolder(folderPath);
                    }
                });

                runner.test("with folder that has a non-empty subfolder and recursive is false", async (test: Test) =>
                {
                    const currentFolderPath: Path = runner.getCurrentFolder().getPath();
                    const folderPath: Path = currentFolderPath.concatenate("hellothere");

                    const fileSystem: NodeJSFileSystem = NodeJSFileSystem.create();
                    await fileSystem.createFolder(folderPath);
                    try
                    {
                        const subfolderPath: Path = folderPath.concatenate("subfolder");
                        await fileSystem.createFolder(subfolderPath);


                        const subFolderFilePath: Path = subfolderPath.concatenate("document.txt");
                        await fileSystem.createFile(subFolderFilePath);

                        const entries: Iterator<File | Folder> = await fileSystem.iterateFolderEntries(folderPath, { recursive: false });
                        test.assertNotUndefinedAndNotNull(entries);
                        test.assertEqual(entries.toArray().await(), [fileSystem.getFolder(subfolderPath).await()]);
                    }
                    finally
                    {
                        await fileSystem.deleteFolder(folderPath);
                    }
                });

                runner.test("with folder that has a non-empty subfolder and recursive is true", async (test: Test) =>
                {
                    const currentFolderPath: Path = runner.getCurrentFolder().getPath();
                    const folderPath: Path = currentFolderPath.concatenate("hellothere");

                    const fileSystem: NodeJSFileSystem = NodeJSFileSystem.create();
                    await fileSystem.createFolder(folderPath);
                    try
                    {
                        const subfolderPath: Path = folderPath.concatenate("subfolder");
                        await fileSystem.createFolder(subfolderPath);


                        const subFolderFilePath: Path = subfolderPath.concatenate("document.txt");
                        await fileSystem.createFile(subFolderFilePath);

                        const entries: Iterator<File | Folder> = await fileSystem.iterateFolderEntries(folderPath, { recursive: true });
                        test.assertNotUndefinedAndNotNull(entries);
                        test.assertEqual(entries.toArray().await(), [
                            fileSystem.getFolder(subfolderPath).await(),
                            fileSystem.getFile(subFolderFilePath).await(),
                        ]);
                    }
                    finally
                    {
                        await fileSystem.deleteFolder(folderPath);
                    }
                });
            });
        });
    });
}