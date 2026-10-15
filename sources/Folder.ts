import { AsyncResult } from "./asyncResult.js";
import { BasicFolder } from "./BasicFolder.js";
import { File } from "./File.js";
import { FileSystem } from "./FileSystem.js";
import { FileSystemEntry } from "./FileSystemEntry.js";
import { FileSystemEntryType } from "./FileSystemEntryType.js";
import { Path } from "./Path.js";
import { PreCondition } from "./preCondition.js";
import { SyncResult } from "./syncResult.js";

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
        return Folder.isFile(this);
    }

    public static isFile(folder: Folder): folder is File
    {
        return FileSystemEntry.isFile(folder);
    }

    public isFolder(): this is Folder
    {
        return Folder.isFolder(this);
    }

    public static isFolder(folder: Folder): folder is Folder
    {
        return FileSystemEntry.isFolder(folder);
    }

    public exists(): AsyncResult<boolean>
    {
        return Folder.exists(this);
    }

    public static exists(folder: Folder): AsyncResult<boolean>
    {
        return folder.getFileSystem().folderExists(folder.getPath());
    }
}