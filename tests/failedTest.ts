import { PreCondition } from "../sources/preCondition";
import { TestAction } from "./testAction";
import { TestError } from "./TestError";

export class FailedTest
{
    private readonly testAction: TestAction;
    private readonly error: TestError;

    private constructor(testAction: TestAction, error: TestError)
    {
        PreCondition.assertNotUndefinedAndNotNull(testAction, "testAction");
        PreCondition.assertNotUndefinedAndNotNull(error, "error");

        this.testAction = testAction;
        this.error = error;
    }

    public static create(testAction: TestAction, error: TestError): FailedTest
    {
        return new FailedTest(testAction, error);
    }

    public getTestAction(): TestAction
    {
        return this.testAction;
    }

    public getTestError(): TestError
    {
        return this.error;
    }
}