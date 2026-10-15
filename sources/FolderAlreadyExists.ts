import { AlreadyExistsError } from "./AlreadyExistsError.js";
import { Folder } from "./Folder.js";
import { PreCondition } from "./preCondition.js";
import { escapeAndQuote } from "./strings.js";

/**
 * An error that is raised when a {@link Folder} is attempted to be created but it already exists.
 */
export class FolderAlreadyExistsError extends AlreadyExistsError
{
    public readonly folder: Folder;

    public constructor(folder: Folder, message?: string | string[], cause?: unknown)
    {
        PreCondition.assertNotUndefinedAndNotNull(folder, "folder");

        super(message ?? `The folder at ${escapeAndQuote(folder.getPath().toString())} already exists.`, cause);

        this.folder = folder;
    }
}