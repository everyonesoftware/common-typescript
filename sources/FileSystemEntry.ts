import { AsyncResult } from "./asyncResult.js";
import { File } from "./File.js";
import { FileSystem } from "./FileSystem.js";
import { FileSystemEntryType } from "./FileSystemEntryType.js";
import { Folder } from "./Folder.js";
import { Path } from "./Path.js";
import { PreCondition } from "./preCondition.js";
import { SyncResult } from "./syncResult.js";

/**
 * An entry within a {@link FileSystem}.
 */
export abstract class FileSystemEntry
{
    /**
     * Get the {@link FileSystem} that this {@link FileSystemEntry} is a part of.
     */
    public abstract getFileSystem(): FileSystem;

    /**
     * Get the name of this {@link FileSystemEntry}. This will be the last part of the
     * {@link FileSystemEntry}'s {@link Path}, including the file extension if this is a
     * {@link File}.
     */
    public getName(): string
    {
        return FileSystemEntry.getName(this);
    }

    public static getName(entry: FileSystemEntry): string
    {
        PreCondition.assertNotUndefinedAndNotNull(entry, "entry");

        return entry.getPath().getName();
    }

    /**
     * Get the {@link Path} to this {@link FileSystemEntry}.
     */
    public abstract getPath(): Path;

    /**
     * Get the {@link Folder} that contains this {@link FileSystemEntry}.
     */
    public getParent(): SyncResult<Folder>
    {
        return FileSystemEntry.getParent(this);
    }

    /**
     * Get the parent {@link Folder} of the provided {@link FileSystemEntry}.
     * @param entry The {@link FileSystemEntry} to get the parent {@link Folder} of.
     */
    public static getParent(entry: FileSystemEntry): SyncResult<Folder>
    {
        PreCondition.assertNotUndefinedAndNotNull(entry, "entry");

        return SyncResult.create(() =>
        {
            const entryPath: Path = entry.getPath();
            const parentPath: Path = entryPath.getParent().await();
            const fileSystem: FileSystem = entry.getFileSystem();
            return fileSystem.getFolder(parentPath).await();
        });
    }

    /**
     * Get the type of {@link FileSystemEntry} that this value is.
     */
    public abstract getType(): FileSystemEntryType

    /**
     * Get whether this {@link FileSystemEntry} is a {@link File}.
     */
    public abstract isFile(): this is File;

    /**
     * Get whether this {@link FileSystemEntry} is a {@link Folder}.
     */
    public abstract isFolder(): this is Folder;

    /**
     * Get whether this {@link FileSystemEntry} exists.
     */
    public exists(): AsyncResult<boolean>
    {
        return FileSystemEntry.exists(this);
    }

    public static exists(entry: FileSystemEntry): AsyncResult<boolean>
    {
        return AsyncResult.create(async () =>
        {
            let result: boolean;

            const fileSystem: FileSystem = entry.getFileSystem();
            const entryPath: Path = entry.getPath();
            switch (entry.getType())
            {
                case FileSystemEntryType.File:
                    result = await fileSystem.fileExists(entryPath);
                    break;

                case FileSystemEntryType.Folder:
                    result = await fileSystem.folderExists(entryPath);
                    break;
            }
            
            return result;
        });
    }
}