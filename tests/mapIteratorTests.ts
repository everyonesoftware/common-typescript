import { Iterator } from "../sources/iterator.js";
import { MapIterator } from "../sources/mapIterator.js";
import { PreConditionError } from "../sources/preConditionError.js";
import { Test } from "./test.js";
import { TestRunner } from "./testRunner.js";

export function test(runner: TestRunner): void
{
    runner.testFile("mapIterator.ts", () =>
    {
        runner.testType("MapIterator<TInput,TOutput>", () =>
        {
            runner.testFunction("create(Iterator<TInput>,(TInput)=>TOutput)", () =>
            {
                function createErrorTest<TInput,TOutput>(innerIterator: Iterator<TInput>, mapping: (value: TInput) => TOutput, expected: Error): void
                {
                    runner.test(`with ${runner.toString(innerIterator)}`, (test: Test) =>
                    {
                        test.assertThrows(() => MapIterator.create(innerIterator, mapping), expected);
                    });
                }
        
                createErrorTest(
                    undefined!,
                    (value: number) => value.toString(),
                    new PreConditionError(
                        "Expression: inputIterator",
                        "Expected:   not undefined and not null",
                        "Actual:     undefined",
                    ));
                createErrorTest(
                    null!,
                    (value: number) => value.toString(),
                    new PreConditionError(
                        "Expression: inputIterator",
                        "Expected:   not undefined and not null",
                        "Actual:     null",
                    ));
        
                runner.test("with valid values", (test: Test) =>
                {
                    const inputIterator: Iterator<number> = Iterator.create([1, 2, 3]);
                    test.assertFalse(inputIterator.hasStarted());
                    test.assertFalse(inputIterator.hasCurrent());
        
                    const iterator: MapIterator<number,string> = MapIterator.create(inputIterator, (value: number) => value.toString());
                    test.assertFalse(iterator.hasStarted());
                    test.assertFalse(iterator.hasCurrent());
                });
            });
        });
    });
}