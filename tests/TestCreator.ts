import { AssertTestCreator } from "./AssertTestCreator.js";
import { Test } from "./test.js";

/**
 * A type that can create new {@link Test} objects.
 */
export abstract class TestCreator
{
    /**
     * Create the default {@link TestCreator}.
     */
    public static create(): TestCreator
    {
        return AssertTestCreator.create();
    }

    /**
     * Create a new {@link Test} object.
     */
    public abstract createTest(): Test;
}