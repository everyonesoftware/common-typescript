import * as path from "path";
import { Path } from "./Path.js";
import { SyncResult } from "./syncResult.js";
import { PreCondition } from "./preCondition.js";
import { NotFoundError } from "./notFoundError.js";
import { escapeAndQuote } from "./strings.js";

export class NodeJSPath implements Path
{
    private readonly parsedPath: path.ParsedPath;

    private constructor(parsedPath: path.ParsedPath)
    {
        PreCondition.assertNotUndefinedAndNotNull(parsedPath, "parsedPath");

        this.parsedPath = parsedPath;
    }

    public static parse(pathString: string): SyncResult<NodeJSPath>
    {
        PreCondition.assertNotEmpty(pathString, "pathString");

        return SyncResult.create(() =>
        {
            pathString = Path.convertSeparators(pathString, Path.defaultSeparator);

            let parsedPath: path.ParsedPath = path.win32.parse(pathString);
            if (!parsedPath.root)
            {
                parsedPath = path.posix.parse(pathString);
            }
            return new NodeJSPath(parsedPath);
        });
    }

    private getParsedPath(): path.ParsedPath
    {
        return this.parsedPath;
    }

    public getName(): string
    {
        const parsedPath: path.ParsedPath = this.getParsedPath();
        let result: string = parsedPath.base
        if (!result)
        {
            result = Path.ensureTrailingSeparator(parsedPath.dir, Path.defaultSeparator);
        }
        return result;
    }

    public getParent(): SyncResult<Path>
    {
        return SyncResult.create(() =>
        {
            const parsedPath: path.ParsedPath = this.getParsedPath();
            const parentPathString: string = parsedPath.dir;
            if (!parentPathString)
            {
                throw new NotFoundError(`The path ${escapeAndQuote(this.toString())} doesn't have a parent folder.`);
            }
            return NodeJSPath.parse(parentPathString).await();
        });
    }

    public concatenate(part: string): Path
    {
        return NodeJSPath.parse(path.join(this.toString(), part)).await();
    }

    public toString(options?: { separator?: string }): string
    {
        const parsedPath: path.ParsedPath = this.getParsedPath();
        let result: string = path.format(parsedPath);
        if (!parsedPath.base)
        {
            result = Path.ensureTrailingSeparator(result, Path.defaultSeparator);
        }
        if (options?.separator)
        {
            result = Path.convertSeparators(result, options.separator);
        }
        return result;
    }

    public isRelative(): boolean
    {
        return Path.isRelative(this);
    }

    public isAbsolute(): boolean
    {
        const pathString: string = this.toString();
        return path.win32.isAbsolute(pathString) || path.posix.isAbsolute(pathString);
    }
}