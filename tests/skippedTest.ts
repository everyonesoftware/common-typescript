import { PreCondition } from "../sources/preCondition.js";
import { TestAction } from "./testAction.js";
import { TestSkip } from "./testSkip.js";

export class SkippedTest
{
    private readonly skip: TestSkip;
    private readonly testAction: TestAction;

    private constructor(skip: TestSkip, testAction: TestAction)
    {
        PreCondition.assertNotUndefinedAndNotNull(skip, "skip");
        PreCondition.assertNotUndefinedAndNotNull(testAction, "testAction");

        this.skip = skip;
        this.testAction = testAction;
    }

    public static create(skip: TestSkip, testAction: TestAction): SkippedTest
    {
        return new SkippedTest(skip, testAction);
    }

    public getSkipMessage(): string
    {
        return this.skip.getMessage();
    }

    public getTestAction(): TestAction
    {
        return this.testAction;
    }
}