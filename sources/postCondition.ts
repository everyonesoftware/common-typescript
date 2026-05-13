import { JavascriptIterable } from "./javascript";
import { MutableCondition } from "./mutableCondition";
import { PostConditionError } from "./postConditionError";
import { Type } from "./types";

/**
 * A type that encapsulates conditions that should exist before an operation takes place.
 */
export abstract class PostCondition
{
    private static condition: MutableCondition | undefined;

    private static getCondition(): MutableCondition
    {
        if (PostCondition.condition === undefined)
        {
            PostCondition.condition = MutableCondition.create()
                .setCreateErrorFunction((message: string) =>
                {
                    return new PostConditionError(message);
                });
        }
        return PostCondition.condition;
    }

    /**
     * Assert that the provided value is undefined.
     * @param value The value to check.
     * @param expression The name of the expression that produced the value.
     * @param message An additional message that will be included with the error.
     */
    public static assertUndefined(value: unknown, expression?: string, message?: string): asserts value is undefined
    {
        return PostCondition.getCondition().assertUndefined(value, expression, message);
    }

    /**
     * Assert that the provided value is not undefined and not null.
     * @param value The value to check.
     * @param expression The name of the expression that produced the value.
     * @param message An additional message that will be included with the error.
     */
    public static assertNotUndefined<T>(value: T, expression?: string, message?: string): asserts value is NonNullable<T>
    {
        return PostCondition.getCondition().assertNotUndefined(value, expression, message);
    }

    /**
     * Assert that the provided value is not undefined and not null.
     * @param value The value to check.
     * @param expression The name of the expression that produced the value.
     * @param message An additional message that will be included with the error.
     */
    public static assertNotUndefinedAndNotNull<T>(value: T, expression?: string, message?: string): asserts value is NonNullable<T>
    {
        return PostCondition.getCondition().assertNotUndefinedAndNotNull(value, expression, message);
    }

    /**
     * Assert that the provided value is true.
     * @param value The value to check.
     * @param expression The name of the expression that produced the value.
     * @param message An additional message that will be included with the error.
     */
    public static assertTrue(value: boolean, expression?: string, message?: string): asserts value is true
    {
        return PostCondition.getCondition().assertTrue(value, expression, message);
    }

    /**
     * Assert that the provided value is false.
     * @param value The value to check.
     * @param expression The name of the expression that produced the value.
     * @param message An additional message that will be included with the error.
     */
    public static assertFalse(value: boolean, expression?: string, message?: string): asserts value is false
    {
        return PostCondition.getCondition().assertFalse(value, expression, message);
    }

    /**
     * Assert that the provided actual value is the same as the provided expected value.
     * @param expected The expected value.
     * @param actual The actual value.
     * @param expression The expression that produced the actual value.
     * @param message An optional message that describes the scenario.
     */
    public static assertSame<T>(expected: T, actual: T, expression?: string, message?: string): void
    {
        return PostCondition.getCondition().assertSame(expected, actual, expression, message);
    }

    /**
     * Assert that the provided actual value is not the same as the provided expected value.
     * @param expected The expected value.
     * @param actual The actual value.
     * @param expression The expression that produced the actual value.
     * @param message An optional message that describes the scenario.
     */
    public static assertNotSame<T>(expected: T, actual: T, expression?: string, message?: string): void
    {
        return PostCondition.getCondition().assertNotSame(expected, actual, expression, message);
    }

    /**
     * Assert that the provided actual value is equal to the provided expected value.
     * @param expected The expected value.
     * @param actual The actual value.
     * @param expression  The expression that produced the actual value.
     * @param message An optional message that describes the scenario.
     */
    public static assertEqual<T>(expected: T, actual: T, expression?: string, message?: string): void
    {
        return PostCondition.getCondition().assertEqual(expected, actual, expression, message);
    }

    /**
     * Assert that the provided actual value is not equal to the provided expected value.
     * @param notExpected The not expected value.
     * @param actual The actual value.
     * @param expression  The expression that produced the actual value.
     * @param message An optional message that describes the scenario.
     */
    public static assertNotEqual<T>(notExpected: T, actual: T, expression?: string, message?: string): void
    {
        return PostCondition.getCondition().assertNotEqual(notExpected, actual, expression, message);
    }

    /**
     * Assert that the provided value is not empty.
     * @param value The value to check.
     * @param expression  The expression that produced the actual value.
     * @param message An optional message that describes the scenario.
     */
    public static assertNotEmpty(value: JavascriptIterable<unknown> | string | undefined | null, expression?: string, message?: string): void
    {
        return PostCondition.getCondition().assertNotEmpty(value, expression, message);
    }

    /**
     * Assert that the provided value is less than the provided upperBound.
     * @param value The value to check.
     * @param upperBound The upperBound that the value must be less than.
     * @param expression  The expression that produced the actual value.
     * @param message An optional message that describes the scenario.
     */
    public static assertLessThan(value: number, upperBound: number, expression?: string, message?: string): void
    {
        return PostCondition.getCondition().assertLessThan(value, upperBound, expression, message);
    }

    /**
     * Assert that the provided value is less than or equal to the provided upperBound.
     * @param value The value to check.
     * @param upperBound The upperBound that the value must be less than.
     * @param expression  The expression that produced the actual value.
     * @param message An optional message that describes the scenario.
     */
    public static assertLessThanOrEqualTo(value: number, upperBound: number, expression?: string, message?: string): void
    {
        return PostCondition.getCondition().assertLessThanOrEqualTo(value, upperBound, expression, message);
    }

    /**
     * Assert that the provided value is greater than or equal to the provided lowerBound.
     * @param value The value to check.
     * @param lowerBound The lowerBound that the value must be greater than or equal to.
     * @param expression  The expression that produced the actual value.
     * @param message An optional message that describes the scenario.
     */
    public static assertGreaterThanOrEqualTo(value: number, lowerBound: number, expression?: string, message?: string): void
    {
        return PostCondition.getCondition().assertGreaterThanOrEqualTo(value, lowerBound, expression, message);
    }

    /**
     * Assert that the provided value is greater than the provided lowerBound.
     * @param value The value to check.
     * @param lowerBound The lowerBound that the value must be greater than.
     * @param expression  The expression that produced the actual value.
     * @param message An optional message that describes the scenario.
     */
    public static assertGreaterThan(value: number, lowerBound: number, expression?: string, message?: string): void
    {
        return PostCondition.getCondition().assertGreaterThan(value, lowerBound, expression, message);
    }

    /**
     * Assert that the value is greater than or equal to the lowerBound and less than or equal to
     * the upperBound.
     * @param lowerBound The lowerBound that the value must be greater than or equal to.
     * @param value The value to check.
     * @param upperBound The upperBound that the value must be less than or equal to.
     * @param expression  The expression that produced the actual value.
     * @param message An optional message that describes the scenario.
     */
    public static assertBetween(lowerBound: number, value: number, upperBound: number, expression?: string, message?: string): void
    {
        return PostCondition.getCondition().assertBetween(lowerBound, value, upperBound, expression, message);
    }

    /**
     * Assert that the index is within the access bounds of an indexable with the provided count.
     * @param index The index to check.
     * @param count The number of elements in the indexable.
     * @param expression  The expression that produced the actual value.
     * @param message An optional message that describes the scenario.
     */
    public static assertAccessIndex(index: number, count: number, expression?: string, message?: string): void
    {
        return PostCondition.getCondition().assertAccessIndex(index, count, expression, message);
    }

    /**
     * Assert that the index is within the insertion bounds of a {@link List} with the provided count.
     * @param index The index to check.
     * @param count The number of elements in the indexable.
     * @param expression  The expression that produced the actual value.
     * @param message An optional message that describes the scenario.
     */
    public static assertInsertIndex(index: number, count: number, expression?: string, message?: string): void
    {
        return PostCondition.getCondition().assertInsertIndex(index, count, expression, message);
    }

    /**
     * Assert that the value is one of the possibilities.
     * @param possibilities The possible values that the value can be.
     * @param value The value to check.
     * @param expression The expression that produced the value.
     * @param message An optional error message.
     */
    public static assertOneOf<T>(possibilities: JavascriptIterable<T>, value: T, expression?: string, message?: string): void
    {
        return PostCondition.getCondition().assertOneOf(possibilities, value, expression, message);
    }

    /**
     * Assert that the value is within the bounds of a byte.
     * @param value The value to check.
     * @param expression The expression that produced the value.
     * @param message An optional error message.
     */
    public static assertByte(value: number, expression?: string, message?: string): void
    {
        return PostCondition.getCondition().assertByte(value, expression, message);
    }

    /**
     * Assert that the value is an integer.
     * @param value The value to check.
     * @param expression The expression that produced the value.
     * @param message An optional error message.
     */
    public static assertInteger(value: number, expression?: string, message?: string): void
    {
        return PostCondition.getCondition().assertInteger(value, expression, message);
    }

    /**
     * Assert that the value is a characer (single character string).
     * @param value The value to check.
     * @param expression The expression that produced the value.
     * @param message An optional error message.
     */
    public static assertCharacter(value: string, expression?: string, message?: string): void
    {
        return PostCondition.getCondition().assertCharacter(value, expression, message);
    }

    /**
     * Assert that the provided value is an instance of the provided {@link Type}.
     * @param value The value to check.
     * @param type The {@link Type} to check.
     * @param expression The expression that produced the value.
     * @param message An optional error message.
     */
    public assertInstanceOf<T>(value: unknown, type: Type<T>, typeCheck?: (value: unknown) => value is T, expression?: string, message?: string): asserts value is T;
    public assertInstanceOf<T>(parameters: { value: unknown, type: Type<T>, typeCheck?: (value: unknown) => value is T, expression?: string, message?: string }): void;
    assertInstanceOf<T>(parametersOrValue: unknown | { value: unknown, type: Type<T>, typeCheck?: (value: unknown) => value is T, expression?: string, message?: string }, type?: Type<T>, typeCheck?: (value: unknown) => value is T, expression?: string, message?: string): void
    {
        return PostCondition.getCondition().assertInstanceOf(parametersOrValue, type, typeCheck, expression, message);
    }
}