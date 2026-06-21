import { BasicTestErrorCreator } from "./BasicTestErrorCreator";
import { TestError } from "./TestError";

export abstract class TestErrorCreator
{
    public static create(): TestErrorCreator
    {
        return BasicTestErrorCreator.create();
    }

    public abstract createTestError(error: unknown): TestError
}