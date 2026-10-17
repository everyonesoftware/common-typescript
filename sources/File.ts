import { AsyncResult } from "./asyncResult.js";
import { BasicFile } from "./BasicFile.js";
import { FileSystem } from "./FileSystem.js";
import { FileSystemEntry } from "./FileSystemEntry.js";
import { FileSystemEntryType } from "./FileSystemEntryType.js";
import { Folder } from "./Folder.js";
import { Path } from "./Path.js";
import { SyncResult } from "./syncResult.js";

/**
 * A reference to a {@link File} in a {@link FileSystem}.
 */
export abstract class File implements FileSystemEntry
{
    public static create(fileSystem: FileSystem, path: Path): File
    {
        return BasicFile.create(fileSystem, path);
    }

    public abstract getFileSystem(): FileSystem;

    public getName(): string
    {
        return File.getName(this);
    }

    public static getName(file: File): string
    {
        return FileSystemEntry.getName(file);
    }

    public abstract getPath(): Path;

    public getParent(): SyncResult<Folder>
    {
        return File.getParent(this);
    }

    public static getParent(file: File): SyncResult<Folder>
    {
        return FileSystemEntry.getParent(file);
    }

    public getType(): FileSystemEntryType
    {
        return File.getType(this);
    }

    public static getType(_file: File): FileSystemEntryType
    {
        return FileSystemEntryType.File;
    }

    public isFile(): this is File
    {
        return true;
    }

    public isFolder(): this is Folder
    {
        return false;
    }

    public exists(): AsyncResult<boolean>
    {
        return File.exists(this);
    }

    public static exists(file: File): AsyncResult<boolean>
    {
        return file.getFileSystem().fileExists(file.getPath());
    }
}