import { Iterator } from "./iterator.js";
import { AsyncResult } from "./asyncResult.js";
import { File } from "./File.js";
import { Folder } from "./Folder.js";
import { Path } from "./Path.js";
import { PreCondition } from "./preCondition.js";
import { SyncResult } from "./syncResult.js";

/**
 * A type that can be used to interact with the file system.
 */
export abstract class FileSystem
{
    /**
     * Get a reference to a {@link Folder} at the provided path.
     * @param path The path to the {@link Folder}.
     */
    public getFolder(path: string | Path): SyncResult<Folder>
    {
        return FileSystem.getFolder(this, path);
    }

    public static getFolder(fileSystem: FileSystem, path: string | Path): SyncResult<Folder>
    {
        PreCondition.assertNotUndefinedAndNotNull(fileSystem, "fileSystem");
        PreCondition.assertNotUndefinedAndNotNull(path, "path");

        return SyncResult.create(() =>
        {
            path = Path.ensurePath(path).await();
            PreCondition.assertTrue(path.isAbsolute(), "path.isAbsolute()");

            return Folder.create(fileSystem, path);
        });
    }

    /**
     * Get a reference to a {@link File} at the provided path.
     * @param path The path to the {@link File}.
     */
    public getFile(path: string | Path): SyncResult<File>
    {
        return FileSystem.getFile(this, path);
    }

    public static getFile(fileSystem: FileSystem, path: string | Path): SyncResult<File>
    {
        PreCondition.assertNotUndefinedAndNotNull(fileSystem, "fileSystem");
        PreCondition.assertNotUndefinedAndNotNull(path, "path");

        return SyncResult.create(() =>
        {
            path = Path.ensurePath(path).await();
            PreCondition.assertTrue(path.isAbsolute(), "path.isAbsolute()");

            return File.create(fileSystem, path);
        });
    }

    /**
     * Get whether a file exists at the provided absolute path.
     * @param path The path to the {@link File}.
     */
    public abstract fileExists(path: string | Path): AsyncResult<boolean>;

    /**
     * Get whether a folder exists at the provided absolute path.
     * @param path The path to the {@link Folder}.
     */
    public abstract folderExists(path: string | Path): AsyncResult<boolean>;

    /**
     * Create a file at the provided path. Return the created {@link File}.
     * @param filePath The path to the {@link File} to create.
     */
    public abstract createFile(filePath: string | Path): AsyncResult<File>;

    /**
     * Delete the file at the provided path.
     * @param filePath The path to the file to delete.
     */
    public abstract deleteFile(filePath: string | Path): AsyncResult<void>;

    /**
     * Create a folder at the provided path. Return the created {@link Folder}.
     * @param folderPath The path to the {@link Folder} to create.
     */
    public abstract createFolder(folderPath: string | Path): AsyncResult<Folder>;

    /**
     * Delete the {@link Folder} at the provided path.
     * @param folderPath The path to the {@link Folder} to delete.
     */
    public abstract deleteFolder(folderPath: string | Path): AsyncResult<void>;

    /**
     * Iterate over the entries of the {@link Folder} at the provided path.
     * @param folderPath The {@link Folder} path to iterate over the entries of.
     */
    public abstract iterateFolderEntries(folderPath: string | Path, options?: { recursive?: boolean }): AsyncResult<Iterator<File | Folder>>;
}