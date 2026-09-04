/**
 * A collection of parameters that can be passed to an assert error message function.
 */
export interface AssertMessageParameters
{
    /**
     * The expected state.
     */
    readonly expected: string,
    /**
     * The actual state.
     */
    readonly actual: string,
    /**
     * A string representation of the expression that produced the actual state.
     */
    readonly expression?: string,
    /**
     * A message that describes the failure.
     */
    readonly message?: string,
}