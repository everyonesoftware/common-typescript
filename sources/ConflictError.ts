/**
 * An error that occurs because a conflict occurred, such as an entity already existing.
 */
export class ConflictError extends Error
{
    public constructor(message: string, cause?: Error)
    {
        super(message, { cause });
    }
}