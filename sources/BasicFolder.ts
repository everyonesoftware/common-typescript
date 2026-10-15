import { Folder } from "./Folder.js";
import { Path } from "./Path.js";
import { PreCondition } from "./preCondition.js";
import { FileSystem } from "./FileSystem.js";
import { File } from "./File.js";
import { FileSystemEntryType } from "./FileSystemEntryType.js";
import { SyncResult } from "./syncResult.js";
import { AsyncResult } from "./asyncResult.js";

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
        return Folder.isFile(this);
    }

    public isFolder(): this is Folder
    {
        return Folder.isFolder(this);
    }

    public exists(): AsyncResult<boolean>
    {
        return Folder.exists(this);
    }
}