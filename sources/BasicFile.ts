import { PreCondition } from "./preCondition.js";
import { FileSystem } from "./FileSystem.js";
import { Path } from "./Path.js";
import { File } from "./File.js";
import { AsyncResult } from "./asyncResult.js";
import { FileSystemEntryType } from "./FileSystemEntryType.js";
import { Folder } from "./Folder.js";
import { SyncResult } from "./syncResult.js";

export class BasicFile implements File
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

    public static create(fileSystem: FileSystem, path: Path): BasicFile
    {
        return new BasicFile(fileSystem, path);
    }

    public getFileSystem(): FileSystem
    {
        return this.fileSystem;
    }

    public getName(): string
    {
        return File.getName(this);
    }

    public getPath(): Path
    {
        return this.path;
    }

    public getParent(): SyncResult<Folder>
    {
        return File.getParent(this);
    }

    public getType(): FileSystemEntryType
    {
        return File.getType(this);
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

    public writeContents(fileContents: string): AsyncResult<void>
    {
        return File.writeContents(this, fileContents);
    }

    public readContents(): AsyncResult<string>
    {
        return File.readContents(this);
    }
}