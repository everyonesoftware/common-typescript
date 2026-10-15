import { BaseError } from "./BaseError.js";

/**
 * An {@link Error} that is raised when an operation is attempted but it fails because a resource
 * already exists.
 */
export class AlreadyExistsError extends BaseError
{
    public constructor(message: string | string[], cause?: unknown)
    {
        super(message, cause);
    }
}