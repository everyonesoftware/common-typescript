import { AsyncResult } from "./asyncResult.js";
import { BasicFolder } from "./BasicFolder.js";
import { File } from "./File.js";
import { FileSystem } from "./FileSystem.js";
import { FileSystemEntry } from "./FileSystemEntry.js";
import { FileSystemEntryType } from "./FileSystemEntryType.js";
import { Path } from "./Path.js";
import { PreCondition } from "./preCondition.js";
import { SyncResult } from "./syncResult.js";
import { Iterator } from "./iterator.js";

/**
 * A folder/directory within a {@link FileSystem}.
 */
export abstract class Folder implements FileSystemEntry
{
    public static create(fileSystem: FileSystem, path: Path): Folder
    {
        return BasicFolder.create(fileSystem, path);
    }

    public abstract getFileSystem(): FileSystem;

    public getName(): string
    {
        return Folder.getName(this);
    }

    public static getName(folder: Folder): string
    {
        return FileSystemEntry.getName(folder);
    }

    public abstract getPath(): Path;

    public getParent(): SyncResult<Folder>
    {
        return Folder.getParent(this);
    }

    public static getParent(folder: Folder): SyncResult<Folder>
    {
        PreCondition.assertNotUndefinedAndNotNull(folder, "folder");

        return FileSystemEntry.getParent(folder);
    }

    public getType(): FileSystemEntryType
    {
        return Folder.getType(this);
    }

    public static getType(_folder: Folder): FileSystemEntryType
    {
        return FileSystemEntryType.Folder;
    }

    public isFile(): this is File
    {
        return false;
    }

    public isFolder(): this is Folder
    {
        return true;
    }

    public exists(): AsyncResult<boolean>
    {
        return Folder.exists(this);
    }

    public static exists(folder: Folder): AsyncResult<boolean>
    {
        return folder.getFileSystem().folderExists(folder.getPath());
    }

    public getFolder(subFolderPath: string | Path): SyncResult<Folder>
    {
        return Folder.getFolder(this, subFolderPath);
    }

    public static getFolder(folder: Folder, subFolderPath: string | Path): SyncResult<Folder>
    {
        PreCondition.assertNotUndefinedAndNotNull(folder, "folder");
        PreCondition.assertNotUndefinedAndNotNull(subFolderPath, "subFolderPath");

        return SyncResult.create(() =>
        {
            subFolderPath = Path.ensurePath(subFolderPath).await();
            PreCondition.assertTrue(subFolderPath.isRelative(), "subFolderPath.isRelative()");

            subFolderPath = folder.getPath().concatenate(subFolderPath);
            return folder.getFileSystem().getFolder(subFolderPath).await();
        });
    }

    /**
     * Create a folder at this {@link Folder}'s path.
     */
    public create(): AsyncResult<void>
    {
        return Folder.createFolder(this);
    }

    public static createFolder(folder: Folder): AsyncResult<void>
    {
        PreCondition.assertNotUndefinedAndNotNull(folder, "folder");

        return AsyncResult.create(async () =>
        {
            const fileSystem: FileSystem = folder.getFileSystem();
            await fileSystem.createFolder(folder.getPath());
        });
    }

    /**
     * Delete this {@link Folder}.
     */
    public delete(): AsyncResult<void>
    {
        return Folder.delete(this);
    }

    public static delete(folder: Folder): AsyncResult<void>
    {
        PreCondition.assertNotUndefinedAndNotNull(folder, "folder");

        return AsyncResult.create(async () =>
        {
            const fileSystem: FileSystem = folder.getFileSystem();
            await fileSystem.deleteFolder(folder.getPath());
        })
    }

    /**
     * Iterate over the entries of the {@link Folder} at the provided path.
     * @param folderPath The {@link Folder} path to iterate over the entries of.
     */
    public iterateFolderEntries(options?: { recursive?: boolean }): AsyncResult<Iterator<File | Folder>>
    {
        return Folder.iterateFolderEntries(this, options);
    }

    public static iterateFolderEntries(folder: Folder, options?: { recursive?: boolean }): AsyncResult<Iterator<File | Folder>>
    {
        PreCondition.assertNotUndefinedAndNotNull(folder, "folder");

        return AsyncResult.create(async () =>
        {
            const fileSystem: FileSystem = folder.getFileSystem();
            return await fileSystem.iterateFolderEntries(folder.getPath(), options);
        });
    }
}