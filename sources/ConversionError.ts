/**
 * An {@link Error} that is created when a conversion fails.
 */
export class ConversionError extends Error
{
    public constructor(message?: string, cause?: unknown)
    {
        super(message, { cause });
    }
}