import { BasicTestSkip } from "./basicTestSkip.js";

/**
 * A type that is used to mark that a test group or a test should be skipped.
 */
export abstract class TestSkip
{
    protected constructor()
    {
    }

    /**
     * Create a new {@link TestSkip} with the provided properties.
     * @param shouldSkip Whether the tests associated with the new {@link TestSkip}
     * should be skipped.
     * @param message The message that explains why the tests associated with this {@link TestSkip}
     * should be skipped.
     */
    public static create(shouldSkip?: boolean, message?: string): TestSkip
    {
        return BasicTestSkip.create(shouldSkip, message);
    }

    /**
     * Get whether the tests associated with this {@link TestSkip} should be skipped.
     */
    public abstract getShouldSkip(): boolean;

    /**
     * Get the message that explains why the tests associated with this {@link TestSkip}
     * should be skipped.
     */
    public abstract getMessage(): string;
}