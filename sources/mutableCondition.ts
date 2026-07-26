import { AssertMessageParameters } from "./assertMessageParameters.js";
import { Bytes } from "./bytes.js";
import { Comparer } from "./comparer.js";
import { Comparison } from "./comparison.js";
import { Condition } from "./condition.js";
import { EqualFunctions } from "./equalFunctions.js";
import { isJavascriptIterableEmpty, JavascriptIterable } from "./javascript.js";
import { ToStringFunctions } from "./toStringFunctions.js";
import {
    hasFunction, hasProperty, instanceOf, isJavascriptIterable, isString, isUndefinedOrNull, Type
} from "./types.js";

/**
 * A collection of condition methods that can be used to assert the state of an application.
 */
export class MutableCondition implements Condition
{
    private toStringFunctions: ToStringFunctions;
    private equalFunctions: EqualFunctions;
    private createErrorFunction: (message: string) => Error;

    protected constructor()
    {
        this.toStringFunctions = ToStringFunctions.create();
        this.equalFunctions = EqualFunctions.create();
        this.createErrorFunction = MutableCondition.defaultCreateErrorFunction;
    }

    private static defaultCreateErrorFunction(message: string): Error
    {
        return new Error(message);
    }

    /**
     * Create a new {@link MutableCondition} object.
     */
    public static create(): MutableCondition
    {
        return new MutableCondition();
    }

    /**
     * Set the {@link ToStringFunctions} that will be used to convert values to their {@link String}
     * representations.
     * @param toStringFunctions The {@link ToStringFunctions} that will be used to convert values to
     * their {@link String} representations.
     * @returns This object for method chaining.
     */
    public setToStringFunctions(toStringFunctions: ToStringFunctions): this
    {
        this.assertNotUndefinedAndNotNull(toStringFunctions, "toStringFunctions");

        this.toStringFunctions = toStringFunctions;

        return this;
    }

    /**
     * Set the {@link EqualFunctions} that will be used to determine if values are equal.
     * @param equalFunctions The {@link EqualFunctions} that will be used to determine if values are
     * equal.
     * @returns This object for method chaining.
     */
    public setEqualFunctions(equalFunctions: EqualFunctions): this
    {
        this.assertNotUndefinedAndNotNull(equalFunctions, "equalFunctions");

        this.equalFunctions = equalFunctions;

        return this;
    }

    /**
     * Set the {@link Function} that will be used to create {@link Error}s.
     * @param createErrorFunction The {@link Function} to use to create {@link Error}.
     * @returns This object for method chaining.
     */
    public setCreateErrorFunction(createErrorFunction: (message: string) => Error): this
    {
        this.assertNotUndefinedAndNotNull(createErrorFunction, "createErrorFunction");

        this.createErrorFunction = createErrorFunction;
        return this;
    }

    public assertUndefined(value: unknown, expression?: string, message?: string): asserts value is undefined
    {
        Condition.assertUndefined(this, value, expression, message);
    }

    public assertNotUndefined<T>(value: T, expression?: string, message?: string): asserts value is NonNullable<T>
    {
        Condition.assertNotUndefined(this, value, expression, message);
    }

    /**
     * Get whether the provided values are equal.
     * @param left The left part of the comparison.
     * @param right The right part of the comparison.
     */
    public areEqual(left: unknown, right: unknown): boolean
    {
        return this.equalFunctions.areEqual(left, right).await();
    }

    /**
     * Get the {@link String} representation of the provided value.
     * @param value The value to get the {@link String} representation of.
     */
    public toValueString(value: unknown): string
    {
        return this.toStringFunctions.toString(value);
    }

    /**
     * Create an {@link Error} based on the provided {@link AssertMessageParameters}.
     * @param parameters The {@link AssertMessageParameters} that define how the should be made.
     */
    public createError(parameters: AssertMessageParameters): Error
    {
        const message: string = MutableCondition.createErrorMessage(parameters);
        return this.createErrorFunction(message);
    }

    /**
     * Create an error message based on the provided parameters.
     * @param parameters The parameters to use to create the error message.
     */
    public static createErrorMessage(parameters: AssertMessageParameters): string
    {
        let result: string = "";

        if (parameters.message)
        {
            result += `Message: ${parameters.message}`;
        }

        if (parameters.expression)
        {
            if (result)
            {
                result += "\n";
            }
            result += `Expression: ${parameters.expression}`;
        }

        if (result)
        {
            result += "\n";
        }
        result += `Expected: ${parameters.expected}`;

        if (result)
        {
            result += "\n";
        }
        result += `Actual: ${parameters.actual}`;

        return result;
    }

    public assertNotUndefinedAndNotNull<T>(value: T, expression?: string, message?: string): asserts value is NonNullable<T>
    {
        if (value === undefined || value === null)
        {
            throw this.createError({
                expected: `not ${this.toValueString(undefined)} and not ${this.toValueString(null)}`,
                actual: this.toValueString(value),
                expression: expression,
                message: message,
            });
        }
    }

    public assertTrue(value: boolean, expression?: string, message?: string): asserts value is true
    {
        Condition.assertTrue(this, value, expression, message);
    }

    public assertFalse(value: boolean, expression?: string, message?: string): asserts value is false
    {
        if (value !== false)
        {
            throw this.createError({
                expected: this.toValueString(false),
                actual: this.toValueString(value),
                expression: expression,
                message: message,
            });
        }
    }

    public assertSame<T>(expected: T, actual: T, expression?: string, message?: string): void
    {
        if (expected !== actual)
        {
            throw this.createError({
                expected: this.toValueString(expected),
                actual: this.toValueString(actual),
                expression: expression,
                message: message,
            });
        }
    }

    public assertNotSame<T>(expected: T, actual: T, expression?: string, message?: string): void
    {
        if (expected === actual)
        {
            throw this.createError({
                expected: `not ${this.toValueString(expected)}`,
                actual: this.toValueString(actual),
                expression: expression,
                message: message,
            });
        }
    }

    public assertEqual<T>(expected: T, actual: T, expression?: string, message?: string): void
    {
        let comparison: Comparison | undefined = Comparer.compareSameUndefinedNull(expected, actual);
        if (comparison === undefined && this.areEqual(expected, actual))
        {
            comparison = Comparison.Equal;
        }

        if (comparison !== Comparison.Equal)
        {
            throw this.createError({
                expected: this.toValueString(expected),
                actual: this.toValueString(actual),
                expression: expression,
                message: message,
            });
        }
    }

    public assertNotEqual<T>(notExpected: T, actual: T, expression?: string, message?: string): void
    {
        let comparison: Comparison | undefined = Comparer.compareSameUndefinedNull(notExpected, actual);
        if (comparison === undefined && this.areEqual(notExpected, actual))
        {
            comparison = Comparison.Equal;
        }

        if (comparison === Comparison.Equal)
        {
            throw this.createError({
                expected: `not ${this.toValueString(notExpected)}`,
                actual: this.toValueString(actual),
                expression: expression,
                message: message,
            });
        }
    }

    public assertNotEmpty<T extends JavascriptIterable<unknown> | string | null | undefined>(value: T, expression?: string, message?: string): asserts value is NonNullable<T>
    {
        this.assertNotUndefinedAndNotNull(value, expression, message);
        if ((isString(value) && value.length === 0) ||
            (isJavascriptIterable(value) && isJavascriptIterableEmpty(value)))
        {
            throw this.createError({
                expected: "not empty",
                actual: this.toValueString(value),
                expression: expression,
                message: message,
            });
        }
    }

    public assertLessThan(value: number, upperBound: number, expression?: string, message?: string): void
    {
        if (!(value < upperBound))
        {
            throw this.createError({
                expected: `less than ${this.toValueString(upperBound)}`,
                actual: this.toValueString(value),
                expression: expression,
                message: message,
            });
        }
    }

    public assertLessThanOrEqualTo(value: number, upperBound: number, expression?: string, message?: string): void
    {
        if (!(value <= upperBound))
        {
            throw this.createError({
                expected: `less than or equal to ${this.toValueString(upperBound)}`,
                actual: this.toValueString(value),
                expression: expression,
                message: message,
            });
        }
    }

    public assertGreaterThanOrEqualTo(value: number, lowerBound: number, expression?: string, message?: string): void
    {
        if (!(lowerBound <= value))
        {
            throw this.createError({
                expected: `greater than or equal to ${this.toValueString(lowerBound)}`,
                actual: this.toValueString(value),
                expression: expression,
                message: message,
            });
        }
    }

    public assertGreaterThan(value: number, lowerBound: number, expression?: string, message?: string): void
    {
        if (!(lowerBound < value))
        {
            throw this.createError({
                expected: `greater than ${this.toValueString(lowerBound)}`,
                actual: this.toValueString(value),
                expression: expression,
                message: message,
            });
        }
    }

    public assertBetween(lowerBound: number, value: number, upperBound: number, expression?: string, message?: string): void
    {
        this.assertLessThanOrEqualTo(lowerBound, upperBound, "lowerBound");
        if (isUndefinedOrNull(value) || !(lowerBound <= value && value <= upperBound))
        {
            throw this.createError({
                expected: (lowerBound === upperBound
                    ? this.toValueString(lowerBound)
                    : `between ${this.toValueString(lowerBound)} and ${this.toValueString(upperBound)}`),
                actual: this.toValueString(value),
                expression: expression,
                message: message,
            });
        }
    }

    public assertAccessIndex(index: number, count: number, expression?: string, message?: string): void
    {
        this.assertGreaterThanOrEqualTo(count, 1, "count");
        this.assertInteger(index, expression);
        this.assertBetween(0, index, count - 1, expression, message);
    }

    public assertInsertIndex(index: number, count: number, expression?: string, message?: string): void
    {
        this.assertGreaterThanOrEqualTo(count, 0, "count");
        this.assertInteger(index, expression);
        this.assertBetween(0, index, count, expression, message);
    }

    public assertOneOf<T>(possibilities: JavascriptIterable<T>, value: T, expression?: string, message?: string): void
    {
        this.assertNotUndefinedAndNotNull(possibilities, "possibilities");

        let found: boolean = false;
        for (const possibility of possibilities)
        {
            if (this.areEqual(possibility, value))
            {
                found = true;
                break;
            }
        }

        if (!found)
        {
            throw this.createError({
                expected: `one of ${this.toValueString(possibilities)}`,
                actual: this.toValueString(value),
                expression: expression,
                message: message,
            });
        }
    }

    public assertByte(value: number, expression?: string, message?: string): void
    {
        this.assertBetween(Bytes.minimumValue, value, Bytes.maximumValue, expression, message);
        this.assertInteger(value, "value");
    }

    public assertInteger(value: number, expression?: string, message?: string): void
    {
        if (value % 1 !== 0)
        {
            throw this.createError({
                expected: `integer`,
                actual: this.toValueString(value),
                expression: expression,
                message: message,
            });
        }
    }

    public assertCharacter(value: string, expression?: string, message?: string): void
    {
        if (!value || value.length !== 1)
        {
            throw this.createError({
                expected: `character`,
                actual: this.toValueString(value),
                expression: expression,
                message: message,
            });
        }
    }

    public assertInstanceOf<T>(value: unknown, type: Type<T>, typeCheck?: (value: unknown) => value is T, expression?: string, message?: string): asserts value is T;
    public assertInstanceOf<T>(parameters: { value: unknown, type: Type<T>, typeCheck?: (value: unknown) => value is T, expression?: string, message?: string }): void;
    public assertInstanceOf<T>(parametersOrValue: unknown | { value: unknown, type: Type<T>, typeCheck?: (value: unknown) => value is T, expression?: string, message?: string }, type?: Type<T>, typeCheck?: (value: unknown) => value is T, expression?: string, message?: string): void;
    public assertInstanceOf<T>(parametersOrValue: unknown | { value: unknown, type: Type<T>, typeCheck?: (value: unknown) => value is T, expression?: string, message?: string }, type?: Type<T>, typeCheck?: (value: unknown) => value is T, expression?: string, message?: string): void
    {
        let value: unknown;
        if (hasProperty(parametersOrValue, "value") &&
            hasProperty(parametersOrValue, "type"))
        {
            value = parametersOrValue.value;
            type = parametersOrValue.type as Type<T>;
            if (hasFunction(parametersOrValue, "typeCheck"))
            {
                typeCheck = parametersOrValue.typeCheck as (value: unknown) => value is T;
            }
            if (hasProperty(parametersOrValue, "expression"))
            {
                expression = parametersOrValue.expression as string;
            }
            if (hasProperty(parametersOrValue, "message"))
            {
                message = parametersOrValue.message as string;
            }
        }
        else
        {
            value = parametersOrValue;
        }

        if (!instanceOf(value, type!, typeCheck))
        {
            throw this.createError({
                expected: `instance of ${type!.name}`,
                actual: this.toValueString(value),
                expression: expression,
                message: message,
            });
        }
    }
}