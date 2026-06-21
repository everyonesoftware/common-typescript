import { AssertTest } from "./assertTest";
import { TestCreator } from "./TestCreator";

/**
 * An implementation of {@link TestCreator} that creates {@link AssertTest}s.
 */
export class AssertTestCreator implements TestCreator
{
    private constructor()
    {
    }

    public static create(): AssertTestCreator
    {
        return new AssertTestCreator();
    }

    public createTest(): AssertTest
    {
        return AssertTest.create();
    }
}