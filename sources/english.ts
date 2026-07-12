import { Iterator } from "./iterator.js";
import { JavascriptIterable } from "./javascript.js";
import { PreCondition } from "./preCondition.js";

export function andList(values: JavascriptIterable<string>): string
{
    return list("and", values);
}

export function orList(values: JavascriptIterable<string>): string
{
    return list("or", values);
}

function list(conjunction: string, values: JavascriptIterable<string>): string
{
    PreCondition.assertNotEmpty(conjunction, "conjunction");
    PreCondition.assertNotUndefinedAndNotNull(values, "values");

    let result: string = "";
    let index = 0;
    const iterator: Iterator<string> = Iterator.create(values).start().await();
    while (iterator.hasCurrent())
    {
        const currentValue: string = iterator.takeCurrent().await();
        if (index >= 1)
        {
            if (iterator.hasCurrent())
            {
                result += `, `;
            }
            else
            {
                if (index >= 2)
                {
                    result += `,`;
                }
                result += ` ${conjunction} `;
            }
        }
        result += currentValue;
        index++;
    }
    return result;
}