import { AsyncResult } from "./asyncResult.js";
import { File } from "./File.js";
import { FileSystem } from "./FileSystem.js";
import { Folder } from "./Folder.js";
import { Path } from "./Path.js";
import { PreCondition } from "./preCondition.js";
import { SyncResult } from "./syncResult.js";
import * as fs from "fs";
import { isUndefinedOrNull } from "./types.js";
import { NotFoundError } from "./notFoundError.js";
import { escapeAndQuote } from "./strings.js";
import { FileAlreadyExistsError } from "./FileAlreadyExistsError.js";
import { FileNotFoundError } from "./FileNotFoundError.js";
import { FolderAlreadyExistsError } from "./FolderAlreadyExists.js";
import { FolderNotFoundError } from "./FolderNotFoundError.js";
import { Iterator } from "./iterator.js";

export class NodeJSFileSystem implements FileSystem
{
    private constructor()
    {
    }

    public static create(): NodeJSFileSystem
    {
        return new NodeJSFileSystem();
    }

    public getFolder(path: string | Path): SyncResult<Folder>
    {
        return FileSystem.getFolder(this, path);
    }

    public getFile(path: string | Path): SyncResult<File>
    {
        return FileSystem.getFile(this, path);
    }

    private getFsStats(path: string | Path): AsyncResult<fs.Stats>
    {
        PreCondition.assertNotUndefinedAndNotNull(path, "path");

        return AsyncResult.create(new Promise((resolve, reject) =>
        {
            path = Path.ensurePath(path).await();
            PreCondition.assertTrue(path.isAbsolute(), "path.isAbsolute()");

            // https://nodejs.org/api/fs.html#fsstatpath-options-callback
            fs.stat(path.toString(), (error: NodeJS.ErrnoException | null, stats: fs.Stats) =>
            {
                if (!isUndefinedOrNull(error))
                {
                    if (error.code === "ENOENT")
                    {
                        reject(new NotFoundError(`No file system entry exists at ${escapeAndQuote(path.toString())}.`, error));
                    }
                    else
                    {
                        reject(error);
                    }
                }
                else
                {
                    resolve(stats);
                }
            });
        }));
    }

    public fileExists(path: string | Path): AsyncResult<boolean>
    {
        return this.getFsStats(path)
            .then((stats: fs.Stats) => stats.isFile())
            .catch(NotFoundError, () => false);
    }

    public folderExists(path: string | Path): AsyncResult<boolean>
    {
        return this.getFsStats(path)
            .then((stats: fs.Stats) => stats.isDirectory())
            .catch(NotFoundError, () => false);
    }

    public createFile(filePath: string | Path): AsyncResult<File>
    {
        PreCondition.assertNotUndefinedAndNotNull(filePath, "filePath");

        return AsyncResult.create(new Promise((resolve, reject) =>
        {
            filePath = Path.ensurePath(filePath).await();
            PreCondition.assertTrue(filePath.isAbsolute(), "filePath.isAbsolute()");

            // https://nodejs.org/api/fs.html#file-system-flags
            const flags: fs.OpenMode | undefined = "wx";
            // https://nodejs.org/api/fs.html#file-modes
            const mode: fs.Mode | undefined = undefined;
            // https://nodejs.org/api/fs.html#fsopenpath-flags-mode-callback
            fs.open(filePath.toString(), flags, mode, (error: NodeJS.ErrnoException | null, fileDescriptor: number) =>
            {
                if (!isUndefinedOrNull(error))
                {
                    if (error.code === "EEXIST")
                    {
                        reject(new FileAlreadyExistsError(this.getFile(filePath).await(), undefined, error));
                    }
                    else
                    {
                        reject(error);
                    }
                }
                else
                {
                    // https://nodejs.org/api/fs.html#fsclosefd-callback
                    fs.close(fileDescriptor, (error: NodeJS.ErrnoException | null) =>
                    {
                        if (!isUndefinedOrNull(error))
                        {
                            reject(error);
                        }
                        else
                        {
                            resolve(this.getFile(filePath).await());
                        }
                    });
                }
            });
        }));
    }

    public deleteFile(filePath: string | Path): AsyncResult<void>
    {
        PreCondition.assertNotUndefinedAndNotNull(filePath, "filePath");

        return AsyncResult.create(new Promise((resolve, reject) =>
        {
            filePath = Path.ensurePath(filePath).await();
            PreCondition.assertTrue(filePath.isAbsolute(), "filePath.isAbsolute()");

            // https://nodejs.org/api/fs.html#fsunlinkpath-callback
            fs.unlink(filePath.toString(), (error: NodeJS.ErrnoException | null) =>
            {
                if (!isUndefinedOrNull(error))
                {
                    if (error.code === "ENOENT")
                    {
                        reject(new FileNotFoundError(this.getFile(filePath).await(), undefined, error));
                    }
                    else
                    {
                        reject(error);
                    }
                }
                else
                {
                    resolve();
                }
            });
        }));
    }

    public createFolder(folderPath: string | Path): AsyncResult<Folder>
    {
        PreCondition.assertNotUndefinedAndNotNull(folderPath, "folderPath");

        return AsyncResult.create(new Promise((resolve, reject) =>
        {
            folderPath = Path.ensurePath(folderPath).await();
            PreCondition.assertTrue(folderPath.isAbsolute(), "folderPath.isAbsolute()");

            const options: fs.MakeDirectoryOptions | undefined = undefined;
            // https://nodejs.org/api/fs.html#fsmkdirpath-options-callback
            fs.mkdir(folderPath.toString(), options, (error: NodeJS.ErrnoException | null, _firstCreatedFolderPath?: string) =>
            {
                if (!isUndefinedOrNull(error))
                {
                    if (error.code === "EEXIST")
                    {
                        reject(new FolderAlreadyExistsError(this.getFolder(folderPath).await(), undefined, error));
                    }
                    else
                    {
                        reject(error);
                    }
                }
                else
                {
                    resolve(this.getFolder(folderPath).await());
                }
            });
        }));
    }

    public deleteFolder(folderPath: string | Path): AsyncResult<void>
    {
        PreCondition.assertNotUndefinedAndNotNull(folderPath, "folderPath");

        return AsyncResult.create(new Promise((resolve, reject) =>
        {
            folderPath = Path.ensurePath(folderPath).await();
            PreCondition.assertTrue(folderPath.isAbsolute(), "folderPath.isAbsolute()");

            const options: fs.RmOptions = { recursive: true };
            // https://nodejs.org/api/fs.html#fsrmpath-options-callback
            fs.rm(folderPath.toString(), options, (error: NodeJS.ErrnoException | null) =>
            {
                if (!isUndefinedOrNull(error))
                {
                    if (error.code === "ENOENT")
                    {
                        reject(new FolderNotFoundError(this.getFolder(folderPath).await(), undefined, error));
                    }
                    else
                    {
                        reject(error);
                    }
                }
                else
                {
                    resolve();
                }
            });
        }));
    }

    public iterateFolderEntries(folderPath: string | Path, options?: { recursive?: boolean }): AsyncResult<Iterator<File | Folder>>
    {
        PreCondition.assertNotUndefinedAndNotNull(folderPath, "folderPath");

        return AsyncResult.create(new Promise((resolve, reject) =>
        {
            folderPath = Path.ensurePath(folderPath).await();
            PreCondition.assertTrue(folderPath.isAbsolute(), "folderPath.isAbsolute()");

            // https://nodejs.org/api/fs.html#fsreaddirpath-options-callback
            fs.readdir(folderPath.toString(), { encoding: "utf8", withFileTypes: true, recursive: options?.recursive }, (error: NodeJS.ErrnoException | null, entries: fs.Dirent<string>[]) =>
            {
                if (!isUndefinedOrNull(error))
                {
                    if (error.code === "ENOENT")
                    {
                        reject(new FolderNotFoundError(this.getFolder(folderPath).await(), undefined, error));
                    }
                    else
                    {
                        reject(error);
                    }
                }
                else
                {
                    resolve(Iterator.create(entries)
                        .map(entry =>
                        {
                            let result: File | Folder | undefined;
                            const parentPath: Path = Path.parse(entry.parentPath).await();
                            const entryPath: Path = parentPath.concatenate(entry.name);
                            if (entry.isDirectory())
                            {
                                result = this.getFolder(entryPath).await();
                            }
                            else if (entry.isFile())
                            {
                                result = this.getFile(entryPath).await();
                            }
                            return result;
                        })
                        .where(entry => !isUndefinedOrNull(entry))
                    );
                }
            });
        }));
    }
}