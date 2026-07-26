import { PreCondition } from "./preCondition.js";

/**
 * The result of comparing two values.
 */
export class Comparison
{
    private readonly name: string;

    private constructor(name: string)
    {
        PreCondition.assertNotEmpty(name, "name");

        this.name = name;
    }

    private static create(name: string): Comparison
    {
        return new Comparison(name);
    }

    /**
     * Get a {@link Comparison} based on the provided difference between two numbers.
     * @param difference The result of subtracting one number from another.
     */
    public static parse(difference: number): Comparison
    {
        let result: Comparison;
        if (difference < 0)
        {
            result = Comparison.LessThan;
        }
        else if (difference === 0)
        {
            result = Comparison.Equal;
        }
        else
        {
            result = Comparison.GreaterThan;
        }
        return result;
    }

    public toString(): string
    {
        return this.name;
    }

    /**
     * The left value is less than the right value.
     */
    public static readonly LessThan = Comparison.create("LessThan");

    /**
     * The two values are equal.
     */
    public static readonly Equal = Comparison.create("Equal");

    /**
     * The left value is greater than the right value.
     */
    public static readonly GreaterThan = Comparison.create("GreaterThan");
}