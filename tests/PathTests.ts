import { Path, PreConditionError, SyncResult } from "../sources/index.js";
import { Test } from "./test.js";
import { TestRunner } from "./testRunner.js";

export function test(runner: TestRunner): void
{
    runner.testFile("Path.ts", () =>
    {
        pathTests(runner, Path.parse);
    });
}

export function pathTests(runner: TestRunner, parser: (pathString: string) => SyncResult<Path>): void
{
    runner.testType("Path", () =>
    {
        runner.testFunction("parse()", () =>
        {
            function parseErrorTest(pathString: string, expected: Error): void
            {
                runner.test(`with ${runner.toString(pathString)}`, (test: Test) =>
                {
                    test.assertThrows(() => parser(pathString).await(), expected);
                });
            }

            parseErrorTest(undefined!, new PreConditionError({
                expression: "pathString",
                expectedString: "not undefined and not null",
                actualString: "undefined",
            }));
            parseErrorTest(null!, new PreConditionError({
                expression: "pathString",
                expectedString: "not undefined and not null",
                actualString: "null",
            }));

            function parseTest(pathString: string, expectedToString: string): void
            {
                runner.test(`with ${runner.toString(pathString)}`, (test: Test) =>
                {
                    const path: Path = parser(pathString).await();
                    test.assertNotUndefinedAndNotNull(path);
                    test.assertEqual(path.toString({ separator: "/" }), expectedToString);
                });
            }

            parseTest("/", "/");
            parseTest("/hello", "/hello");
            parseTest("/hello/there", "/hello/there");
            parseTest("/hello//there", "/hello//there");
            parseTest("/hello/././../there", "/hello/././../there")
            parseTest("/hello/./../../there", "/hello/./../../there")
            parseTest("/hello/../../../there", "/hello/../../../there")
            parseTest("C:\\", "C:/");
            parseTest("C:/Windows/System32/notepad.exe", "C:/Windows/System32/notepad.exe");
            parseTest("C:\\<>:\"|?*.txt", "C:/<>:\"|?*.txt");
        });

        runner.testFunction("getName()", () =>
        {
            function getNameTest(pathString: string, expected: string): void
            {
                runner.test(`with ${runner.toString(pathString)}`, (test: Test) =>
                {
                    const path: Path = parser(pathString).await();
                    test.assertEqual(path.getName(), expected);
                });
            }

            getNameTest("/", "/");
            getNameTest("/hello", "hello");
            getNameTest("/hello/there", "there");
            getNameTest("/hello//there", "there");
            getNameTest("/hello/././../there", "there")
            getNameTest("/hello/./../../there", "there")
            getNameTest("/hello/../../../there", "there")
            getNameTest("C:\\", "C:/");
            getNameTest("C:/", "C:/");
            getNameTest("C:", "C:/");
            getNameTest("C:/Windows/System32/notepad.exe", "notepad.exe");
            getNameTest("C:\\<>:\"|?*.txt", "<>:\"|?*.txt");
        });

        runner.testFunction("getParent()", () =>
        {
            function getParentTest(pathString: string, expected: string): void
            {
                runner.test(`with ${runner.toString(pathString)}`, (test: Test) =>
                {
                    const path: Path = parser(pathString).await();
                    test.assertEqual(path.getParent().await().toString({ separator: "/" }), expected);
                });
            }

            getParentTest("/", "/");
            getParentTest("/hello", "/");
            getParentTest("/hello/there", "/hello");
            getParentTest("/hello//there", "/hello");
            getParentTest("/hello/././../there", "/hello/././..")
            getParentTest("/hello/./../../there", "/hello/./../..")
            getParentTest("/hello/../../../there", "/hello/../../..")
            getParentTest("C:\\", "C:/");
            getParentTest("C:/Windows/System32/notepad.exe", "C:/Windows/System32");
            getParentTest("C:\\<>:\"|?*.txt", "C:/");
        });

        runner.testFunction("isRelative()", () =>
        {
            function isRelativeTest(pathString: string, expected: boolean): void
            {
                runner.test(`with ${runner.toString(pathString)}`, (test: Test) =>
                {
                    const path: Path = parser(pathString).await();
                    test.assertEqual(path.isRelative(), expected);
                });
            }

            isRelativeTest("/", false);
            isRelativeTest("/hello", false);
            isRelativeTest("/hello/there", false);
            isRelativeTest("/hello//there", false);
            isRelativeTest("/hello/././../there", false)
            isRelativeTest("/hello/./../../there", false)
            isRelativeTest("/hello/../../../there", false)
            isRelativeTest("C:\\", false);
            isRelativeTest("C:/Windows/System32/notepad.exe", false);
            isRelativeTest("C:\\<>:\"|?*.txt", false);

            isRelativeTest(".", true);
            isRelativeTest("hello there", true);
            isRelativeTest("./../oops.txt", true);
        });

        runner.testFunction("isAbsolute()", () =>
        {
            function isAbsolute(pathString: string, expected: boolean): void
            {
                runner.test(`with ${runner.toString(pathString)}`, (test: Test) =>
                {
                    const path: Path = parser(pathString).await();
                    test.assertEqual(path.isAbsolute(), expected);
                });
            }

            isAbsolute("/", true);
            isAbsolute("/hello", true);
            isAbsolute("/hello/there", true);
            isAbsolute("/hello//there", true);
            isAbsolute("/hello/././../there", true)
            isAbsolute("/hello/./../../there", true)
            isAbsolute("/hello/../../../there", true)
            isAbsolute("C:\\", true);
            isAbsolute("C:/", true);
            isAbsolute("C:", true);
            isAbsolute("C:/Windows/System32/notepad.exe", true);
            isAbsolute("C:\\<>:\"|?*.txt", true);

            isAbsolute(".", false);
            isAbsolute("hello there", false);
            isAbsolute("./../oops.txt", false);
        });
    });
}