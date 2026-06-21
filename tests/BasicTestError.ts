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

    public static removeNonProjectPaths(errorString: string, currentFolderPath: string): string
    {
        currentFolderPath = currentFolderPath.replaceAll("\\", "/");
        return errorString
            .split('\n')
            .filter((line: string) =>
            {
                let keepLine: boolean = false;

                const trimmedLine: string = line.trim();

                const match: RegExpMatchArray | null =
                    trimmedLine.match(/^at .* \((.+)\)$/) ??
                    trimmedLine.match(/^at (.+)$/);
                if (!match)
                {
                    // If the line isn't a 'at (file-path)' or 'at FunctionSignature
                    // (file-path)' line, then we should keep it.
                    keepLine = true;
                }
                else
                {
                    const location: string = match[1];

                    // Keep only file URLs inside cwd
                    try
                    {
                        const filePath: string = path.resolve(fileURLToPath(location)).replaceAll("\\", "/");
                        keepLine = filePath.startsWith(currentFolderPath);
                    }
                    catch
                    {
                    }
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
                const match: RegExpMatchArray | null =
                    line.match(/^(\s*)at (.+?) \((.+)\)$/) ??
                    line.match(/^(\s*)at (.+)$/);
                if (match)
                {
                    const hasFunctionName: boolean = (match.length === 4);
                    const indentation: string = match[1];
                    const functionName: string | undefined = hasFunctionName ? match[2] : undefined;
                    const location: string = hasFunctionName ? match[3] : match[2];

                    let relativeLocation: string = location;
                    try
                    {
                        const pathMatch: RegExpMatchArray | null = location.match(/^(.*?):(\d+):(\d+)$/);
                        if (pathMatch)
                        {
                            const fullPath: string = pathMatch[1];
                            const lineNumber: string = pathMatch[2];
                            const columnNumber: string = pathMatch[3];

                            let absolutePath: string | undefined;
                            if (fullPath.startsWith('file:///'))
                            {
                                absolutePath = fileURLToPath(fullPath);
                            }
                            else if (/^[A-Za-z]:[\\/]/.test(fullPath) || fullPath.startsWith("/"))
                            {
                                absolutePath = fullPath;
                            }

                            if (absolutePath)
                            {
                                let relativePath = path.relative(
                                    currentFolderPath,
                                    absolutePath
                                );

                                relativePath = relativePath.replace(/\\/g, '/');

                                relativeLocation = `${relativePath}:${lineNumber}:${columnNumber}`;
                            }
                        }
                    }
                    catch
                    {
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