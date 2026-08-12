import { BaseError } from "./BaseError.js";
import { PreCondition } from "./preCondition.js";

export class FetchError extends BaseError
{
    private readonly innerError: Error;

    public constructor(innerError: Error)
    {
        PreCondition.assertNotUndefinedAndNotNull(innerError, "innerError");

        super(innerError.message, innerError);

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