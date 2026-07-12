import { Comparison } from "./comparison.js";

/**
 * A type that can be used to compare values.
 */
export abstract class Comparer<TLeft, TRight = TLeft>
{
    /**
     * Compare the two provided values.
     * @param left The left value to compare.
     * @param right The right value to compare.
     */
    public abstract compare(left: TLeft, right: TRight): Comparison;

    /**
     * Get whether the left value is less than the right value.
     * @param left The left value to compare.
     * @param right The right value to compare.
     */
    public lessThan(left: TLeft, right: TRight): boolean
    {
        return this.compare(left, right) === Comparison.LessThan;
    }

    /**
     * Get whether the left value is less than or equal to the right value.
     * @param left The left value to compare.
     * @param right The right value to compare.
     */
    public lessThanOrEqual(left: TLeft, right: TRight): boolean
    {
        return this.compare(left, right) !== Comparison.GreaterThan;
    }

    /**
     * Get whether the left value equals the right value.
     * @param left The left value to compare.
     * @param right The right value to compare.
     */
    public equal(left: TLeft, right: TRight): boolean
    {
        return this.compare(left, right) === Comparison.Equal;
    }

    /**
     * Get whether the left value is greater than or equal to the right value.
     * @param left The left value to compare.
     * @param right The right value to compare.
     */
    public greaterThanOrEqualTo(left: TLeft, right: TRight): boolean
    {
        return this.compare(left, right) !== Comparison.LessThan;
    }

    /**
     * Get whether the left value is greater than the right value.
     * @param left The left value to compare.
     * @param right The right value to compare.
     */
    public greaterThan(left: TLeft, right: TRight): boolean
    {
        return this.compare(left, right) === Comparison.GreaterThan;
    }

    /**
     * Attempt to compare the left and right values. The comparison will be done on whether they are
     * the same value (left === right) or whether one is undefined or null. If they aren't the same
     * value and neither is undefined or null, then this function can't compare them and will return
     * undefined.
     * @param left The left value of the comparison.
     * @param right The right value of the comparison.
     */
    public static compareSameUndefinedNull(left: unknown, right: unknown): Comparison | undefined
    {
        let result: Comparison | undefined = undefined;
        if (left === right)
        {
            result = Comparison.Equal;
        }
        else if (left === undefined)
        {
            result = Comparison.LessThan;
        }
        else if (right === undefined)
        {
            result = Comparison.GreaterThan;
        }
        else if (left === null)
        {
            result = Comparison.LessThan;
        }
        else if (right === null)
        {
            result = Comparison.GreaterThan;
        }
        return result;
    }

    /**
     * Get whether the left and right values are equal. The comparison will be done on whether they
     * are the same value (left === right) or whether one is undefined or null. If they aren't the
     * same value and neither is undefined or null, then this function can't determine whether they
     * are equal and will return undefined.
     * @param left The left value of the comparison.
     * @param right The right value of the comparison.
     */
    public static equalSameUndefinedNull(left: unknown, right: unknown): boolean | undefined
    {
        let result: Comparison | undefined = Comparer.compareSameUndefinedNull(left, right);
        return result === undefined ? undefined : result === Comparison.Equal;
    }

    public static compareNumbers(left: number | undefined | null, right: number | undefined | null): Comparison
    {
        let result: Comparison | undefined = Comparer.compareSameUndefinedNull(left, right);
        if (result === undefined)
        {
            if (left! < right!)
            {
                result = Comparison.LessThan;
            }
            // else if (left === right)
            // {
            //     result = Comparison.Equal;
            // }
            else
            {
                result = Comparison.GreaterThan;
            }
        }
        return result;
    }
}