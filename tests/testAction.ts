import { JavascriptIterable } from "../sources/javascript.js";
import { List } from "../sources/list.js";
import { PreCondition } from "../sources/preCondition.js";
import { join } from "../sources/strings.js";
import { TestSkip } from "./testSkip.js";

export type TestActionType = "file" | "type" | "function" | "group" | "test";

export class TestAction
{
    private readonly parent: TestAction | undefined;
    private readonly name: string;
    private readonly type: TestActionType;
    private readonly skip: TestSkip | undefined;
    private readonly action: () => (void | Promise<void>);

    private constructor(parent: TestAction | undefined, name: string, type: TestActionType, skip: TestSkip | undefined, action: () => (void | Promise<void>))
    {
        PreCondition.assertNotUndefinedAndNotNull(name, "name");
        PreCondition.assertNotEmpty(type, "type");
        PreCondition.assertNotUndefinedAndNotNull(action, "action");

        this.parent = parent;
        this.name = name;
        this.type = type;
        this.skip = skip;
        this.action = action;
    }

    public static create(parent: TestAction | undefined, name: string, type: TestActionType, skip: TestSkip | undefined, action: () => (void | Promise<void>)): TestAction
    {
        return new TestAction(parent, name, type, skip, action);
    }

    public getParent(): TestAction | undefined
    {
        return this.parent;
    }

    public getName(): string
    {
        return this.name;
    }

    public getFullNameParts(): JavascriptIterable<string>
    {
        const result: List<string> = List.create();
        if (this.parent)
        {
            result.addAll(this.parent.getFullNameParts());
        }
        result.add(this.getName());
        return result;
    }

    public getFullName(): string
    {
        return join(" ", this.getFullNameParts());
    }

    public getType(): TestActionType
    {
        return this.type;
    }

    public getSkip(): TestSkip | undefined
    {
        return this.skip || this.parent?.getSkip();
    }

    public shouldSkip(): boolean
    {
        return !!this.getSkip()?.getShouldSkip();
    }

    public getAction(): () => (void | Promise<void>)
    {
        return this.action;
    }
    
    public runAsync(): void | Promise<void>
    {
        return this.action();
    }
}