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

        if (options?.removeNonProjectPaths ?? true)
        {
            result = BasicTestError.removeNonProjectPaths(result, currentFolderPath);
        }

        if (options?.relativeFilePaths ?? true)
        {
            result = BasicTestError.makeFilePathsRelative(result, currentFolderPath);
        }

        return result;
    }

    public static removeNonProjectPaths(errorString: string, currentFolderPath: string): string
    {
        return errorString
            .split('\n')
            .filter((line: string) =>
            {
                let keepLine: boolean = false;

                const trimmedLine: string = line.trim();

                if (!trimmedLine.startsWith('at '))
                {
                    // Keep non-stack lines (error message, assertion diff, blanks)
                    keepLine = true;
                }
                else
                {
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
                        if (location.startsWith('file:///'))
                        {
                            try
                            {
                                const filePath: string = path.resolve(fileURLToPath(location));
                                keepLine = filePath.startsWith(currentFolderPath);
                            }
                            catch
                            {
                            }
                        }
                    }
                }

                return keepLine;
            })
            .join('\n');
    }

    public static makeFilePathsRelative(errorString: string, currentFolderPath: string): string
    {
        return errorString.replace(/file:\/\/\/[^\s)]+/g, (fileUrl: string) =>
        {
            try
            {
                const absolutePath: string = fileURLToPath(fileUrl);
                let relativePath = path.relative(currentFolderPath, absolutePath);

                // Normalize slashes so output looks cleaner in stack traces
                relativePath = relativePath.replace(/\\/g, '/');

                return relativePath;
            }
            catch
            {
                return fileUrl; // leave unchanged if parsing fails
            }
        });
    }
}