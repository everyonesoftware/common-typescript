import { Bytes } from "../sources/bytes.js";
import { Test } from "./test.js";
import { TestRunner } from "./testRunner.js";

export function test(runner: TestRunner): void
{
    runner.testFile("bytes.ts", () =>
    {
        runner.testType("Bytes", () =>
        {
            runner.test("minimumValue", (test: Test) =>
            {
                test.assertSame(Bytes.minimumValue, 0);
            });

            runner.test("maximumValue", (test: Test) =>
            {
                test.assertSame(Bytes.maximumValue, 255);
            });

            runner.testFunction("isByte(number)", () =>
            {
                function isByteTest(value: number, expected: boolean): void
                {
                    runner.test(`with ${value}`, (test: Test) =>
                    {
                        test.assertSame(Bytes.isByte(value), expected);
                    });
                }

                isByteTest(-2, false);
                isByteTest(-1, false);
                isByteTest(0, true);
                isByteTest(1, true);
                isByteTest(128, true);
                isByteTest(254, true);
                isByteTest(255, true);
                isByteTest(256, false);
                isByteTest(257, false);
            });
        });
    });
}