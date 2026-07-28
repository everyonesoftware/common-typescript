import { Comparable } from "./comparable.js";
import { Comparison } from "./comparison.js";
import { PreCondition } from "./preCondition.js";

export class LogLevel extends Comparable<LogLevel>
{
    private readonly name: string;
    private readonly value: number;

    private constructor(name: string, value: number)
    {
        PreCondition.assertNotEmpty(name, "name");
        PreCondition.assertNotUndefinedAndNotNull(value, "value");

        super();

        this.name = name;
        this.value = value;
    }

    private static create(name: string, value: number): LogLevel
    {
        return new LogLevel(name, value);
    }

    public getName(): string
    {
        return this.name;
    }

    public getValue(): number
    {
        return this.value;
    }

    public toString(): string
    {
        return this.getName();
    }

    public compareTo(logLevel: LogLevel): Comparison
    {
        return Comparison.parse(this.getValue() - logLevel.getValue());
    }

    public static readonly Debug = LogLevel.create("Debug", 1);
    public static readonly Info = LogLevel.create("Info", 2);
    public static readonly Warning = LogLevel.create("Warning", 3);
    public static readonly Error = LogLevel.create("Error", 4);
}