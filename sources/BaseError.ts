export abstract class BaseError extends Error
{
    public constructor(message?: string | string[], cause?: unknown)
    {
        if (message === undefined || message === null)
        {
            message = [];
        }
        else if (typeof message === "string")
        {
            message = [message];
        }
        super(Array.from(message).join("\n"), { cause: cause });
    }
}