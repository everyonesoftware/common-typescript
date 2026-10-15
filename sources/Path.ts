import { NodeJSPath } from "./NodeJSPath.js";
import { PreCondition } from "./preCondition.js";
import { SyncResult } from "./syncResult.js";
import { isString } from "./types.js";

/**
 * A path to a {@link FileSystemEntry}.
 */
export abstract class Path
{
    public static parse(pathString: string): SyncResult<Path>
    {
        return NodeJSPath.parse(pathString);
    }

    /**
     * Ensure that the provided value is a {@link Path}.
     * @param path The path value to check.
     */
    public static ensurePath(path: string | Path): SyncResult<Path>
    {
        PreCondition.assertNotUndefinedAndNotNull(path, "path");

        return SyncResult.create(() =>
        {
            if (isString(path))
            {
                path = Path.parse(path).await();
            }
            return path;
        });
    }

    /**
     * Get the name/last part of this {@link Path}. Typically this will be a file or folder's name.
     */
    public abstract getName(): string;

    /**
     * Get the {@link Path} to the parenet {@link Folder} of this {@link Path}. If this {@link Path}
     * points to a root, then a {@link NotFoundError} will be returned.
     */
    public abstract getParent(): SyncResult<Path>;

    /**
     * Get a new {@link Path} with the provided part concatenated on to the end of this
     * {@link Path}. A path separating slash will be inserted into the new {@link Path} if this
     * {@link Path} doesn't end with a trailing slash.
     * @param part The part to concatenate.
     */
    public abstract concatenate(part: string): Path;

    /**
     * Get the string representation of this {@link Path}.
     */
    public abstract toString(): string;

    /**
     * Get whether this {@link Path} is relative. In other words, does this {@link Path} not specify
     * its root.
     */
    public isRelative(): boolean
    {
        return Path.isRelative(this);
    }

    public static isRelative(path: Path): boolean
    {
        return !path.isAbsolute();
    }

    /**
     * Get whether this {@link Path} is not relative. In other words, does this {@link Path} specify
     * its root.
     */
    public abstract isAbsolute(): boolean;
}