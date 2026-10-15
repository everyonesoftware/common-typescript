import { Folder } from "./Folder.js";
import { NotFoundError } from "./notFoundError.js";
import { PreCondition } from "./preCondition.js";
import { escapeAndQuote } from "./strings.js";

/**
 * An error that is raised when an operation expects a {@link Folder} to exist but it doesn't.
 */
export class FolderNotFoundError extends NotFoundError
{
    public readonly folder: Folder;

    public constructor(folder: Folder, message?: string | string[], cause?: unknown)
    {
        PreCondition.assertNotUndefinedAndNotNull(folder, "folder");

        super(message ?? `Could not find a folder at ${escapeAndQuote(folder.getPath().toString())}.`, cause);

        this.folder = folder;
    }
}