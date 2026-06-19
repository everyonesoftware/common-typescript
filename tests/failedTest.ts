import { JavascriptIterable } from "../sources/javascript";
import { PreCondition } from "../sources/preCondition";
import { join } from "../sources/strings";
import { TestAction } from "./testAction";

export class FailedTest
{
    private readonly testAction: TestAction;
    private readonly error: unknown;

    private constructor(testAction: TestAction, error: unknown)
    {
        PreCondition.assertNotUndefinedAndNotNull(testAction, "testAction");
        PreCondition.assertNotUndefinedAndNotNull(error, "error");

        this.testAction = testAction;
        this.error = error;
    }

    public static create(testAction: TestAction, error: unknown): FailedTest
    {
        return new FailedTest(testAction, error);
    }

    public getTestAction(): TestAction
    {
        return this.testAction;
    }

    public getError(): unknown
    {
        return this.error;
    }

    public getErrorMessage(): string
    {
        return this.error instanceof Error && this.error.stack ? this.error.stack : `${this.error}`;
    }
}