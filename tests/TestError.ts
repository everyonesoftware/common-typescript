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

    /**
     * A style function to apply to the file path/location of a stack frame.
     * @param stackFrameLocation The file path/location of the stack frame.
     */
    readonly stackFrameLocationStyle?: (stackFrameLocation: string) => string;
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