import { StringTable } from "./StringTable.js";
import { isUndefinedNullOrEmpty } from "./types.js";

/**
 * Data that describes a condition assertion that failed.
 */
export interface ConditionErrorData
{
    /**
     * An extra message that describes the scenario.
     */
    readonly message?: string;
    /**
     * The expression that produced the actual value.
     */
    readonly expression?: string;
    /**
     * The string representation of the expected value.
     */
    readonly expectedString: string;
    /**
     * The string representation of the actual value.
     */
    readonly actualString: string;
}

export function conditionErrorDataToMessage(data: ConditionErrorData): string
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

    table.addRow(["Expected:", data.expectedString]);
    table.addRow(["Actual:", data.actualString]);

    return table.toString({
        betweenColumns: " ",
    });
}