import { ByteListStream } from "../sources/byteListStream.js";
import { EmptyError } from "../sources/emptyError.js";
import { PreConditionError } from "../sources/preConditionError.js";
import { Test } from "./test.js";
import { TestRunner } from "./testRunner.js";

export function test(runner: TestRunner): void
{
    runner.testFile("byteListStream.ts", () =>
    {
        runner.testType("ByteListStream", () =>
        {
            runner.testFunction("create()", () =>
            {
                runner.test("with no arguments", (test: Test) =>
                {
                    const stream: ByteListStream = ByteListStream.create();
                    test.assertNotUndefinedAndNotNull(stream);
                    test.assertEqual(0, stream.getAvailableByteCount());
                });

                runner.test("with empty array", (test: Test) =>
                {
                    const stream: ByteListStream = ByteListStream.create([]);
                    test.assertNotUndefinedAndNotNull(stream);
                    test.assertEqual(0, stream.getAvailableByteCount());
                });

                runner.test("with non-empty array", (test: Test) =>
                {
                    const stream: ByteListStream = ByteListStream.create([1, 2, 3]);
                    test.assertNotUndefinedAndNotNull(stream);
                    test.assertEqual(3, stream.getAvailableByteCount());
                });
            });

            runner.testFunction("writeBytes()", () =>
            {
                runner.test("with undefined bytes", (test: Test) =>
                {
                    const stream: ByteListStream = ByteListStream.create();
                    test.assertThrows(() => stream.writeBytes(undefined!), new PreConditionError(
                        "Expression: bytes",
                        "Expected: not undefined and not null",
                        "Actual: undefined",
                    ));
                    test.assertEqual(0, stream.getAvailableByteCount());
                });

                runner.test("with null bytes", (test: Test) =>
                {
                    const stream: ByteListStream = ByteListStream.create();
                    test.assertThrows(() => stream.writeBytes(null!), new PreConditionError(
                        "Expression: bytes",
                        "Expected: not undefined and not null",
                        "Actual: null",
                    ));
                    test.assertEqual(0, stream.getAvailableByteCount());
                });

                runner.test("with empty bytes", (test: Test) =>
                {
                    const stream: ByteListStream = ByteListStream.create();
                    test.assertEqual(0, stream.writeBytes([]).await());
                    test.assertEqual(0, stream.getAvailableByteCount());
                });

                runner.test("with non-empty bytes", (test: Test) =>
                {
                    const stream: ByteListStream = ByteListStream.create();

                    test.assertEqual(4, stream.writeBytes([1, 2, 3, 4]).await());
                    test.assertEqual(4, stream.getAvailableByteCount());

                    const bytes: Uint8Array = stream.readBytes(10).await();
                    test.assertNotUndefinedAndNotNull(bytes);
                    test.assertEqual(4, bytes.length);
                    test.assertEqual(new Uint8Array([1, 2, 3, 4]), bytes);
                    test.assertEqual(0, stream.getAvailableByteCount());
                });

                runner.test("with negative startIndex", (test: Test) =>
                {
                    const stream: ByteListStream = ByteListStream.create();
                    test.assertThrows(() => stream.writeBytes([1, 2], -1), new PreConditionError(
                        "Expression: startIndex",
                        "Expected: between 0 and 2",
                        "Actual: -1",
                    ));
                    test.assertEqual(0, stream.getAvailableByteCount());
                });

                runner.test("with too large startIndex", (test: Test) =>
                {
                    const stream: ByteListStream = ByteListStream.create();
                    test.assertThrows(() => stream.writeBytes([1, 2], 3), new PreConditionError(
                        "Expression: startIndex",
                        "Expected: between 0 and 2",
                        "Actual: 3",
                    ));
                    test.assertEqual(0, stream.getAvailableByteCount());
                });

                runner.test("with valid non-zero startIndex", (test: Test) =>
                {
                    const stream: ByteListStream = ByteListStream.create();
                    const writeBytesResult: number = stream.writeBytes([1, 2], 1).await();
                    test.assertEqual(1, writeBytesResult);
                    test.assertEqual(1, stream.getAvailableByteCount());

                    test.assertEqual(new Uint8Array([2]), stream.readBytes(5).await());
                    test.assertEqual(0, stream.getAvailableByteCount());
                });

                runner.test("with startIndex equal to bytes length", (test: Test) =>
                {
                    const stream: ByteListStream = ByteListStream.create();
                    const writeBytesResult: number = stream.writeBytes([1, 2], 2).await();
                    test.assertEqual(0, writeBytesResult);
                    test.assertEqual(0, stream.getAvailableByteCount());
                });

                runner.test("with negative length", (test: Test) =>
                {
                    const stream: ByteListStream = ByteListStream.create();
                    test.assertThrows(() => stream.writeBytes([1, 2], 0, -1), new PreConditionError(
                        "Expression: length",
                        "Expected: between 0 and 2",
                        "Actual: -1",
                    ));
                    test.assertEqual(0, stream.getAvailableByteCount());
                });

                runner.test("with too large length", (test: Test) =>
                {
                    const stream: ByteListStream = ByteListStream.create();
                    test.assertThrows(() => stream.writeBytes([1, 2], 0, 3), new PreConditionError(
                        "Expression: length",
                        "Expected: between 0 and 2",
                        "Actual: 3",
                    ));
                    test.assertEqual(0, stream.getAvailableByteCount());
                });

                runner.test("with valid startIndex and length values", (test: Test) =>
                {
                    const stream: ByteListStream = ByteListStream.create();
                    const writeBytesResult: number = stream.writeBytes([1, 2, 3, 4, 5], 2, 2).await();
                    test.assertEqual(2, writeBytesResult);
                    test.assertEqual(2, stream.getAvailableByteCount());

                    test.assertEqual(new Uint8Array([3, 4]), stream.readBytes(50).await());
                    test.assertEqual(0, stream.getAvailableByteCount());
                });
            });

            runner.testFunction("readBytes()", () =>
            {
                runner.testGroup("with empty stream", () =>
                {
                    runner.test("with negative count", (test: Test) =>
                    {
                        const stream: ByteListStream = ByteListStream.create();
                        test.assertThrows(() => stream.readBytes(-1).await(), new PreConditionError(
                            "Expression: count",
                            "Expected: greater than or equal to 0",
                            "Actual: -1",
                        ));
                        test.assertEqual(0, stream.getAvailableByteCount());
                    });

                    runner.test("with zero count", (test: Test) =>
                    {
                        const stream: ByteListStream = ByteListStream.create();
                        test.assertThrows(() => stream.readBytes(0).await(), new EmptyError());
                        test.assertEqual(0, stream.getAvailableByteCount());
                    });

                    runner.test("with positive count", (test: Test) =>
                    {
                        const stream: ByteListStream = ByteListStream.create();
                        test.assertThrows(() => stream.readBytes(1).await(), new EmptyError());
                        test.assertEqual(0, stream.getAvailableByteCount());
                    });
                });

                runner.testGroup("with non-empty stream", () =>
                {
                    runner.test("with negative count", (test: Test) =>
                    {
                        const stream: ByteListStream = ByteListStream.create([1, 2, 3]);
                        test.assertThrows(() => stream.readBytes(-1).await(), new PreConditionError(
                            "Expression: count",
                            "Expected: greater than or equal to 0",
                            "Actual: -1",
                        ));
                        test.assertEqual(3, stream.getAvailableByteCount());
                    });

                    runner.test("with zero count", (test: Test) =>
                    {
                        const stream: ByteListStream = ByteListStream.create([1, 2, 3]);
                        const readBytesResult: Uint8Array = stream.readBytes(0).await();
                        test.assertEqual(new Uint8Array(), readBytesResult);
                        test.assertEqual(3, stream.getAvailableByteCount());
                    });

                    runner.test("with positive count less than bytes available", (test: Test) =>
                    {
                        const stream: ByteListStream = ByteListStream.create([1, 2, 3]);
                        const readBytesResult: Uint8Array = stream.readBytes(2).await();
                        test.assertEqual(new Uint8Array([1, 2]), readBytesResult);
                        test.assertEqual(1, stream.getAvailableByteCount());
                    });

                    runner.test("with positive count equal to bytes available", (test: Test) =>
                    {
                        const stream: ByteListStream = ByteListStream.create([1, 2, 3]);
                        const readBytesResult: Uint8Array = stream.readBytes(3).await();
                        test.assertEqual(new Uint8Array([1, 2, 3]), readBytesResult);
                        test.assertEqual(0, stream.getAvailableByteCount());
                    });

                    runner.test("with positive count greater than bytes available", (test: Test) =>
                    {
                        const stream: ByteListStream = ByteListStream.create([1, 2, 3]);
                        const readBytesResult: Uint8Array = stream.readBytes(4).await();
                        test.assertEqual(new Uint8Array([1, 2, 3]), readBytesResult);
                        test.assertEqual(0, stream.getAvailableByteCount());
                    });

                    runner.test("with undefined output", (test: Test) =>
                    {
                        const stream: ByteListStream = ByteListStream.create([1, 2, 3]);
                        test.assertThrows(() => stream.readBytes(undefined!), new PreConditionError(
                            "Expression: output",
                            "Expected: not undefined and not null",
                            "Actual: undefined",
                        ));
                        test.assertEqual(3, stream.getAvailableByteCount());
                    });

                    runner.test("with null output", (test: Test) =>
                    {
                        const stream: ByteListStream = ByteListStream.create([1, 2, 3]);
                        test.assertThrows(() => stream.readBytes(null!), new PreConditionError(
                            "Expression: output",
                            "Expected: not undefined and not null",
                            "Actual: null",
                        ));
                        test.assertEqual(3, stream.getAvailableByteCount());
                    });

                    runner.test("with empty output", (test: Test) =>
                    {
                        const stream: ByteListStream = ByteListStream.create([1, 2, 3]);
                        const output: Uint8Array = new Uint8Array();
                        const readBytesResult: number = stream.readBytes(output).await();
                        test.assertEqual(0, readBytesResult);
                        test.assertEqual(output, new Uint8Array());
                        test.assertEqual(3, stream.getAvailableByteCount());
                    });

                    runner.test("with output smaller than the available bytes", (test: Test) =>
                    {
                        const stream: ByteListStream = ByteListStream.create([1, 2, 3]);
                        const output: Uint8Array = new Uint8Array(1);
                        const readBytesResult: number = stream.readBytes(output).await();
                        test.assertEqual(1, readBytesResult);
                        test.assertEqual(output, new Uint8Array([1]));
                        test.assertEqual(2, stream.getAvailableByteCount());
                    });

                    runner.test("with output equal to the available bytes", (test: Test) =>
                    {
                        const stream: ByteListStream = ByteListStream.create([1, 2, 3]);
                        const output: Uint8Array = new Uint8Array(3);
                        const readBytesResult: number = stream.readBytes(output).await();
                        test.assertEqual(3, readBytesResult);
                        test.assertEqual(output, new Uint8Array([1, 2, 3]));
                        test.assertEqual(0, stream.getAvailableByteCount());
                    });

                    runner.test("with output larger than available bytes", (test: Test) =>
                    {
                        const stream: ByteListStream = ByteListStream.create([1, 2, 3]);
                        const output: Uint8Array = new Uint8Array(5);
                        const readBytesResult: number = stream.readBytes(output).await();
                        test.assertEqual(3, readBytesResult);
                        test.assertEqual(output, new Uint8Array([1, 2, 3, 0, 0]));
                        test.assertEqual(0, stream.getAvailableByteCount());
                    });

                    runner.test("with negative startIndex", (test: Test) =>
                    {
                        const stream: ByteListStream = ByteListStream.create([1, 2, 3]);
                        const output: Uint8Array = new Uint8Array(5);
                        test.assertThrows(() => stream.readBytes(output, -1), new PreConditionError(
                            "Expression: startIndex",
                            "Expected: between 0 and 5",
                            "Actual: -1",
                        ));
                        test.assertEqual(3, stream.getAvailableByteCount());
                    });

                    runner.test("with too large startIndex", (test: Test) =>
                    {
                        const stream: ByteListStream = ByteListStream.create([1, 2, 3]);
                        const output: Uint8Array = new Uint8Array(5);
                        test.assertThrows(() => stream.readBytes(output, 6), new PreConditionError(
                            "Expression: startIndex",
                            "Expected: between 0 and 5",
                            "Actual: 6",
                        ));
                        test.assertEqual(3, stream.getAvailableByteCount());
                    });

                    runner.test("with startIndex with enough space to read the entire stream", (test: Test) =>
                    {
                        const stream: ByteListStream = ByteListStream.create([1, 2, 3]);
                        const output: Uint8Array = new Uint8Array(5);
                        test.assertEqual(3, stream.readBytes(output, 2).await());
                        test.assertEqual(new Uint8Array([0, 0, 1, 2, 3]), output);
                        test.assertEqual(0, stream.getAvailableByteCount());
                    });

                    runner.test("with startIndex with not enough space to read the entire stream", (test: Test) =>
                    {
                        const stream: ByteListStream = ByteListStream.create([1, 2, 3]);
                        const output: Uint8Array = new Uint8Array(5);
                        test.assertEqual(2, stream.readBytes(output, 3).await());
                        test.assertEqual(new Uint8Array([0, 0, 0, 1, 2]), output);
                        test.assertEqual(1, stream.getAvailableByteCount());
                    });

                    runner.test("with startIndex equal to output length", (test: Test) =>
                    {
                        const stream: ByteListStream = ByteListStream.create([1, 2, 3]);
                        const output: Uint8Array = new Uint8Array(5);
                        test.assertEqual(0, stream.readBytes(output, 5).await());
                        test.assertEqual(new Uint8Array(5), output);
                        test.assertEqual(3, stream.getAvailableByteCount());
                    });

                    runner.test("with negative count", (test: Test) =>
                    {
                        const stream: ByteListStream = ByteListStream.create([1, 2, 3]);
                        const output: Uint8Array = new Uint8Array(5);
                        test.assertThrows(() => stream.readBytes(output, 1, -1), new PreConditionError(
                            "Expression: count",
                            "Expected: between 0 and 4",
                            "Actual: -1",
                        ));
                        test.assertEqual(3, stream.getAvailableByteCount());
                    });

                    runner.test("with count larger than output.length - startIndex", (test: Test) =>
                    {
                        const stream: ByteListStream = ByteListStream.create([1, 2, 3]);
                        const output: Uint8Array = new Uint8Array(5);
                        test.assertThrows(() => stream.readBytes(output, 1, 5), new PreConditionError(
                            "Expression: count",
                            "Expected: between 0 and 4",
                            "Actual: 5",
                        ));
                        test.assertEqual(3, stream.getAvailableByteCount());
                    });

                    runner.test("with startIndex with enough space to read the entire stream", (test: Test) =>
                    {
                        const stream: ByteListStream = ByteListStream.create([1, 2, 3]);
                        const output: Uint8Array = new Uint8Array(5);
                        test.assertEqual(3, stream.readBytes(output, 2, 3).await());
                        test.assertEqual(new Uint8Array([0, 0, 1, 2, 3]), output);
                        test.assertEqual(0, stream.getAvailableByteCount());
                    });

                    runner.test("with startIndex with not enough space to read the entire stream", (test: Test) =>
                    {
                        const stream: ByteListStream = ByteListStream.create([1, 2, 3]);
                        const output: Uint8Array = new Uint8Array(5);
                        test.assertEqual(1, stream.readBytes(output, 3, 1).await());
                        test.assertEqual(new Uint8Array([0, 0, 0, 1, 0]), output);
                        test.assertEqual(2, stream.getAvailableByteCount());
                    });
                });
            });
        });
    });
}