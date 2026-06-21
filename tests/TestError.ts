/**
 * Options that can be passed to {@link TestError.getErrorString()}.
 */
export interface GetErrorStringOptions
{
    /**
     * Whether all of the file paths in the stack trace should be shortened to be relative to the
     * current directory.
     */
    readonly relativeFilePaths?: boolean;

    /**
     * Remove any stack frames from code that is not part of the current project.
     */
    readonly removeNonProjectPaths?: boolean;
}

export abstract class TestError
{
    protected constructor()
    {
    }

    /**
     * Get the error that caused the test or test group to fail.
     */
    public abstract getError(): unknown;

    /**
     * Get the string representation of the error.
     */
    public abstract getErrorString(options?: GetErrorStringOptions): string;
}