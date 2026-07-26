import { CharacterWriteStream } from "../sources/characterWriteStream.js";
import { TestRunner } from "./testRunner.js";

export function test(runner: TestRunner, _creator: () => CharacterWriteStream): void
{
    runner.testFile("characterWriteStream.ts", () =>
    {
        runner.testType("CharacterWriteStream", () =>
        {
        });
    });
}