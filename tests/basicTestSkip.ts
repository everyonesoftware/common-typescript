import { PreCondition } from "../sources/preCondition.js";
import { TestSkip } from "./testSkip.js";

/**
 * A type that is used to mark that a test group or a test should be skipped.
 */
export class BasicTestSkip implements TestSkip
{
    private readonly shouldSkip: boolean;
    private readonly message: string;

    private constructor(shouldSkip: boolean, message: string)
    {
        PreCondition.assertNotUndefinedAndNotNull(message, "message");

        this.shouldSkip = shouldSkip;
        this.message = message;
    }

    /**
     * Create a new {@link TestSkip} with the provided properties.
     * @param shouldSkip Whether the tests associated with the new {@link TestSkip}
     * should be skipped.
     * @param message The message that explains why the tests associated with this {@link TestSkip}
     * should be skipped.
     */
    public static create(shouldSkip?: boolean, message?: string): BasicTestSkip
    {
        if (shouldSkip === undefined || shouldSkip === null)
        {
            shouldSkip = true;
        }

        if (message === undefined || message === null)
        {
            message = "";
        }

        return new BasicTestSkip(shouldSkip, message);
    }

    public getShouldSkip(): boolean
    {
        return this.shouldSkip;
    }

    public getMessage(): string
    {
        return this.message;
    }
}