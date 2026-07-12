import { BasicTestError } from "./BasicTestError.js";
import { TestErrorCreator } from "./TestErrorCreator.js";

/**
 * A {@link TestErrorCreator} that creates {@link BasicTestError}s.
 */
export class BasicTestErrorCreator implements TestErrorCreator
{
    private constructor()
    {
    }

    public static create(): BasicTestErrorCreator
    {
        return new BasicTestErrorCreator();
    }

    public createTestError(error: unknown)
    {
        return BasicTestError.create(error);
    }
}