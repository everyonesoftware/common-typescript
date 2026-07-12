import { Comparer } from "./comparer.js";
import { Comparison } from "./comparison.js";

/**
 * A {@link Comparer} that performs {@link string} comparisons.
 */
export class StringComparer extends Comparer<string>
{
    protected constructor()
    {
        super();
    }

    public static create(): StringComparer
    {
        return new StringComparer();
    }

    public override compare(left: string, right: string): Comparison
    {
        return StringComparer.compare(left, right);
    }

    public static compare(left: string, right: string): Comparison
    {
        let result: Comparison | undefined = Comparer.compareSameUndefinedNull(left, right);
        if (result === undefined)
        {
            result = (left < right ? Comparison.LessThan : Comparison.GreaterThan);
        }
        return result;
    }
}