import { PreCondition } from "./preCondition";

export class FetchError extends Error
{
    private readonly innerError: Error;

    public constructor(innerError: Error)
    {
        PreCondition.assertNotUndefinedAndNotNull(innerError, "innerError");

        super(innerError.message, { cause: innerError });

        this.innerError = innerError;
    }

    public get code(): string | undefined
    {
        return "code" in this.innerError
            ? this.innerError.code as string
            : undefined;
    }

    public get hostname(): string | undefined
    {
        return "hostname" in this.innerError
            ? this.innerError.hostname as string
            : undefined;
    }
}