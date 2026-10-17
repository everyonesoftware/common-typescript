import { Folder } from "./Folder.js";
import { Path } from "./Path.js";
import { PreCondition } from "./preCondition.js";
import { FileSystem } from "./FileSystem.js";
import { File } from "./File.js";
import { FileSystemEntryType } from "./FileSystemEntryType.js";
import { SyncResult } from "./syncResult.js";
import { AsyncResult } from "./asyncResult.js";
import { Iterator } from "./iterator.js";

export class BasicFolder implements Folder
{
    private readonly fileSystem: FileSystem;
    private readonly path: Path;

    private constructor(fileSystem: FileSystem, path: Path)
    {
        PreCondition.assertNotUndefinedAndNotNull(fileSystem, "fileSystem");
        PreCondition.assertNotUndefinedAndNotNull(path, "path");

        this.fileSystem = fileSystem;
        this.path = path;
    }

    public static create(fileSystem: FileSystem, path: Path): BasicFolder
    {
        return new BasicFolder(fileSystem, path);
    }

    public getFileSystem(): FileSystem
    {
        return this.fileSystem;
    }

    public getName(): string
    {
        return Folder.getName(this);
    }

    public getPath(): Path
    {
        return this.path;
    }

    public getParent(): SyncResult<Folder>
    {
        return Folder.getParent(this);
    }

    public getType(): FileSystemEntryType
    {
        return Folder.getType(this);
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

    public getFolder(subFolderPath: string | Path): SyncResult<Folder>
    {
        return Folder.getFolder(this, subFolderPath);
    }

    public create(): AsyncResult<void>
    {
        return Folder.createFolder(this);
    }

    public delete(): AsyncResult<void>
    {
        return Folder.delete(this);
    }

    public iterateFolderEntries(options?: { recursive?: boolean; }): AsyncResult<Iterator<File | Folder>>
    {
        return Folder.iterateFolderEntries(this, options);
    }
}