import { BaseError } from "./BaseError.js";
import { JavascriptIterable } from "./javascript.js";
import { join } from "./strings.js";
import { StringTable } from "./StringTable.js";
import { ToStringFunctions } from "./toStringFunctions.js";
import { isJavascriptIterable, isUndefinedNullOrEmpty, isUndefinedOrNull } from "./types.js";

export interface ConditionErrorDescribedValue
{
    readonly description?: string;
    readonly value?: unknown;
}

export interface ConditionErrorData
{
    readonly message?: string;

    readonly expression?: string;

    readonly expected?: ConditionErrorDescribedValue;

    readonly actual?: ConditionErrorDescribedValue;
}

export class ConditionError extends BaseError
{
    public readonly data: ConditionErrorData;

    public get expression(): string | undefined
    {
        return this.data.expression;
    }

    public get expected(): ConditionErrorDescribedValue | undefined
    {
        return this.data.expected;
    }

    public get actual(): ConditionErrorDescribedValue | undefined
    {
        return this.data.actual;
    }

    public constructor(messageLines: JavascriptIterable<string>, toStringFunctions?: ToStringFunctions);
    public constructor(data: ConditionErrorData, toStringFunctions?: ToStringFunctions);
    constructor(messageLinesOrData: JavascriptIterable<string> | ConditionErrorData, toStringFunctions?: ToStringFunctions)
    {
        let message: string;
        let data: ConditionErrorData;
        if (isJavascriptIterable(messageLinesOrData))
        {
            message = join("\n", messageLinesOrData);
            data = {
                message: message,
            };
        }
        else
        {
            data = messageLinesOrData;
            message = ConditionError.dataToMessage(data, toStringFunctions);
        }

        super(message);

        this.data = data;
    }

    public static dataToMessage(data: ConditionErrorData, toStringFunctions?: ToStringFunctions): string
    {
        const table: StringTable = StringTable.create();

        if (!isUndefinedNullOrEmpty(data.message))
        {
            table.addRow(["Message:", data.message]);
        }

        if (!isUndefinedNullOrEmpty(data.expression))
        {
            table.addRow(["Expression:", data.expression]);
        }

        toStringFunctions ??= ToStringFunctions.create();
        if (!isUndefinedOrNull(data.expected))
        {
            table.addRow(["Expected:", toStringFunctions.toString(data.expected.description ?? data.expected.value)]);
        }

        if (!isUndefinedOrNull(data.actual))
        {
            table.addRow(["Actual:", toStringFunctions.toString(data.actual.description ?? data.actual.value)]);
        }

        return table.toString({
            betweenColumns: " ",
        });
    }
}