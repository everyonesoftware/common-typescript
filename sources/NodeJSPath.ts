import * as path from "path";
import { Path } from "./Path.js";
import { SyncResult } from "./syncResult.js";
import { PreCondition } from "./preCondition.js";

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
            return new NodeJSPath(path.parse(Path.convertSeparators(pathString, "/")));
        });
    }

    public getName(): string
    {
        return this.parsedPath.base;
    }

    public getParent(): SyncResult<Path>
    {
        return NodeJSPath.parse(this.parsedPath.dir);
    }

    public concatenate(part: string): Path
    {
        return NodeJSPath.parse(path.join(this.toString(), part)).await();
    }

    public toString(options?: { separator?: string }): string
    {
        let result: string = path.format(this.parsedPath);
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
        return path.isAbsolute(this.toString());
    }
}