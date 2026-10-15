import { AlreadyExistsError } from "./AlreadyExistsError.js";
import { File } from "./File.js";
import { PreCondition } from "./preCondition.js";
import { escapeAndQuote } from "./strings.js";

/**
 * The {@link Error} that is raised when a {@link File} is attempted to be created but it already
 * exists.
 */
export class FileAlreadyExistsError extends AlreadyExistsError
{
    public readonly file: File;

    public constructor(file: File, message?: string | string[], cause?: unknown)
    {
        PreCondition.assertNotUndefinedAndNotNull(file, "file");

        super(message ?? `The file ${escapeAndQuote(file.getPath().toString())} already exists.`, cause);

        this.file = file;
    }
}