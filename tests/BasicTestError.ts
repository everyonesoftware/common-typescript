import { fileURLToPath } from "url";
import { PreCondition } from "../sources";
import { GetErrorStringOptions, TestError } from "./TestError";
import path from "path";

export class BasicTestError implements TestError
{
    private readonly error: unknown;

    private constructor(error: unknown)
    {
        PreCondition.assertNotUndefinedAndNotNull(error, "error");

        this.error = error;
    }

    public static create(error: unknown): BasicTestError
    {
        return new BasicTestError(error);
    }

    public getError(): unknown
    {
        return this.error;
    }

    public getErrorString(options?: GetErrorStringOptions): string
    {
        let result: string = this.error instanceof Error && this.error.stack ? this.error.stack : `${this.error}`;

        const currentFolderPath: string = process.cwd();

        if (options?.removeNonProjectPaths ?? false)
        {
            result = BasicTestError.removeNonProjectPaths(result, currentFolderPath);
        }

        if (options?.relativeFilePaths ?? false)
        {
            result = BasicTestError.makeFilePathsRelative(result, currentFolderPath);
        }

        return result;
    }

    private static getStackFrameLineMatch(line: string): RegExpMatchArray | null
    {
        return line.match(/^(\s*)at (.*) \((.+)\)$/) ??
            line.match(/^(\s*)at (.+)$/);
    }

    private static normalizePath(path: string): string
    {
        return path.replace(/\\/g, "/");
    }

    private static getStackFrameAbsolutePath(stackFrameLocation: string): string | undefined
    {
        let result: string | undefined = BasicTestError.normalizePath(stackFrameLocation);
        if (result.startsWith('file:///'))
        {
            result = BasicTestError.normalizePath(fileURLToPath(result));
        }
        else if (!/^[A-Za-z]:[\\/]/.test(result) && !result.startsWith("/"))
        {
            result = undefined;
        }
        return result;
    }

    public static removeNonProjectPaths(errorString: string, currentFolderPath: string): string
    {
        currentFolderPath = BasicTestError.normalizePath(currentFolderPath);
        return errorString
            .split('\n')
            .filter((line: string) =>
            {
                let keepLine: boolean = true;
                const stackFrameLineMatch: RegExpMatchArray | null = BasicTestError.getStackFrameLineMatch(line);
                if (stackFrameLineMatch)
                {
                    const hasFunctionName: boolean = (stackFrameLineMatch.length === 4);
                    const location: string = hasFunctionName ? stackFrameLineMatch[3] : stackFrameLineMatch[2];

                    const filePath: string | undefined = BasicTestError.getStackFrameAbsolutePath(location);
                    keepLine = !!filePath && filePath.startsWith(currentFolderPath) && !filePath.includes("/node_modules/");
                }
                return keepLine;
            })
            .join('\n');
    }

    public static makeFilePathsRelative(errorString: string, currentFolderPath: string): string
    {
        return errorString
            .split('\n')
            .map((line: string) =>
            {
                const stackFrameLineMatch: RegExpMatchArray | null = BasicTestError.getStackFrameLineMatch(line);
                if (stackFrameLineMatch)
                {
                    const hasFunctionName: boolean = (stackFrameLineMatch.length === 4);
                    const indentation: string = stackFrameLineMatch[1];
                    const functionName: string | undefined = hasFunctionName ? stackFrameLineMatch[2] : undefined;
                    const location: string = hasFunctionName ? stackFrameLineMatch[3] : stackFrameLineMatch[2];

                    let relativeLocation: string = location;
                    const pathMatch: RegExpMatchArray | null = location.match(/^(.*?):(\d+):(\d+)$/);
                    if (pathMatch)
                    {
                        const absolutePath: string | undefined = BasicTestError.getStackFrameAbsolutePath(location);
                        if (absolutePath)
                        {
                            const relativePath: string = path.relative(currentFolderPath, absolutePath);
                            relativeLocation = BasicTestError.normalizePath(relativePath);
                        }
                    }

                    if (relativeLocation !== location)
                    {
                        if (functionName)
                        {
                            line = `${indentation}at ${functionName} (${relativeLocation})`;
                        }
                        else
                        {
                            line = `${indentation}at ${relativeLocation}`;
                        }
                    }
                }
                return line;
            })
            .join('\n');
    }
}