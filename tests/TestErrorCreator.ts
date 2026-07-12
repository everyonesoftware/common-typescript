import { BasicTestErrorCreator } from "./BasicTestErrorCreator.js";
import { TestError } from "./TestError.js";

export abstract class TestErrorCreator
{
    public static create(): TestErrorCreator
    {
        return BasicTestErrorCreator.create();
    }

    public abstract createTestError(error: unknown): TestError
}