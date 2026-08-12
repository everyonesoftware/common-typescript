import { BaseError } from "./BaseError.js";

/**
 * An {@link Error} that is thrown when a pre-condition fails.
 */
export class PreConditionError extends BaseError
{
    public constructor(...message: string[])
    {
        super(message);
    }
}