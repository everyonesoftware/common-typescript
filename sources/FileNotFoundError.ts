import { File } from "./File.js";
import { NotFoundError } from "./notFoundError.js";
import { PreCondition } from "./preCondition.js";
import { escapeAndQuote } from "./strings.js";

/**
 * An error that is raised when an operation expects a file to exist but it doesn't.
 */
export class FileNotFoundError extends NotFoundError
{
    public readonly file: File;

    public constructor(file: File, message?: string | string[], cause?: unknown)
    {
        PreCondition.assertNotUndefinedAndNotNull(file, "file");

        super(message ?? `Could not find a file at ${escapeAndQuote(file.getPath().toString())}.`, cause);

        this.file = file;
    }
}