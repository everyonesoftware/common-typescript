import { PreCondition } from "./preCondition.js";
import { escapeAndQuote } from "./strings.js";

export class HttpHeader
{
    private readonly name: string;
    private readonly value: string;

    private constructor(name: string, value: string)
    {
        PreCondition.assertNotEmpty(name, "name");
        PreCondition.assertNotUndefinedAndNotNull(value, "value");

        this.name = name;
        this.value = value;
    }

    public static create(name: string, value: string): HttpHeader
    {
        return new HttpHeader(name, value);
    }

    public getName(): string
    {
        return this.name;
    }

    public getValue(): string
    {
        return this.value;
    }

    public toString(): string
    {
        return `${escapeAndQuote(this.name)}:${escapeAndQuote(this.value)}`;
    }
}