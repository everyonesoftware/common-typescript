import { BaseError } from "./BaseError.js";

/**
 * An {@link Error} that is thrown when a post-condition fails.
 */
export class PostConditionError extends BaseError
{
    public constructor(...message: string[])
    {
        super(message);
    }
}