import { Iterable, JavascriptIterable, isUndefinedOrNull, Type, SyncResult, PreCondition, AsyncResult } from "../sources//index.js";

/**
 * A type that can be used to make assertions during a test.
 */
export abstract class Test
{
    /**
     * Fail the current test with the provided message.
     * @param message The message that explains why this test failed.
     */
    public abstract fail(message: string): never;

    /**
     * Assert that the provided value is undefined;
     * @param value The value to check.
     */
    public assertUndefined(value: unknown): asserts value is undefined
    {
        Test.assertUndefined(this, value);
    }

    /**
     * Assert that the provided value is undefined.
     * @param test The current {@link Test}.
     * @param value The value to check.
     */
    public static assertUndefined(test: Test, value: unknown): asserts value is undefined
    {
        test.assertSame(value, undefined);
    }

    /**
     * Assert that the provided value is not undefined;
     * @param value The value to check.
     */
    public assertNotUndefined<T>(value: T): asserts value is NonNullable<T>
    {
        Test.assertNotUndefined(this, value);
    }

    /**
     * Assert that the provided value is not undefined.
     * @param test The current {@link Test}.
     * @param value The value to check.
     */
    public static assertNotUndefined<T>(test: Test, value: unknown): asserts value is NonNullable<T>
    {
        test.assertNotSame(value, undefined);
    }

    /**
     * Assert that the provided value is null.
     * @param value The value to check.
     */
    public assertNull(value: unknown): asserts value is null
    {
        Test.assertNull(this, value);
    }

    /**
     * Assert that the provided value is null.
     * @param value The value to check.
     */
    public static assertNull(test: Test, value: unknown): asserts value is null
    {
        test.assertSame(value, null);
    }

    /**
     * Assert that the provided value is not null.
     * @param value The value to check.
     */
    public assertNotNull<T>(value: T): asserts value is NonNullable<T>
    {
        Test.assertNull(this, value);
    }

    /**
     * Assert that the provided value is not null.
     * @param value The value to check.
     */
    public static assertNotNull<T>(test: Test, value: T): asserts value is NonNullable<T>
    {
        test.assertNotSame(value, null);
    }

    /**
     * Assert that the provided value is not undefined and not null.
     * @param value The value to check.
     */
    public assertNotUndefinedAndNotNull<T>(value: T): asserts value is NonNullable<T>
    {
        Test.assertNotUndefinedAndNotNull(this, value);
    }

    /**
     * Assert that the provided value is not undefined and not null.
     * @param value The value to check.
     */
    public static assertNotUndefinedAndNotNull<T>(test: Test, value: T): asserts value is NonNullable<T>
    {
        test.assertNotSame(value, null);
        test.assertNotSame(value, undefined);
    }

    /**
     * Assert that the provided collection is not undefined, not null, and not empty.
     * @param value The value to check.
     */
    public assertNotEmpty(value: JavascriptIterable<unknown>): void
    {
        Test.assertNotEmpty(this, value);
    }

    public static assertNotEmpty(test: Test, value: JavascriptIterable<unknown>): void
    {
        test.assertNotUndefinedAndNotNull(value);
        test.assertTrue(Iterable.any(value).await());
    }

    /**
     * Assert that the provided values point to the same object.
     * @param left The first value.
     * @param right The second value.
     */
    public abstract assertSame<T>(left: T, right: T, message?: string): void;

    /**
     * Assert that the provided values don't point to the same object.
     * @param left The first value.
     * @param right The second value.
     */
    public abstract assertNotSame<T>(left: T, right: T): void;

    /**
     * Assert that the provided values are equal.
     * @param left The first value.
     * @param right The second value.
     * @param message A message that will be shown when the values are not equal.
     */
    public abstract assertEqual<T>(left: T, right: T, message?: string): void;

    /**
     * Assert that the provided values are not equal.
     * @param left The first value.
     * @param right The second value.
     */
    public abstract assertNotEqual<T>(left: T, right: T): void;

    /**
     * Assert that the provided value is false.
     * @param value The value to check.
     */
    public assertFalse(value: boolean): asserts value is false
    {
        Test.assertFalse(this, value);
    }

    public static assertFalse(test: Test, value: boolean, message?: string): asserts value is false
    {
        PreCondition.assertNotUndefinedAndNotNull(test, "test");

        test.assertSame(value, false, message);
    }

    /**
     * Assert that the provided value is true.
     * @param value The value to check.
     */
    public assertTrue(value: boolean, message?: string): asserts value is true
    {
        Test.assertTrue(this, value, message);
    }

    /**
     * Assert that the provided value is true.
     * @param value The value to check.
     */
    public static assertTrue(test: Test, value: boolean, message?: string): asserts value is true
    {
        PreCondition.assertNotUndefinedAndNotNull(test, "test");

        test.assertSame(value, true, message);
    }

    /**
     * Assert that the provided action throws the provided {@link Error} when it is run.
     * @param action The action to run.
     * @param expectedError The optional expected {@link Error} to compare against the thrown
     * {@link Error}. If the expected {@link Error} is not provided, then any {@link Error} will
     * satisfy this assertion.
     */
    public abstract assertThrows(action: SyncResult<unknown> | (() => void), expectedError?: Error): void;

    /**
     * Assert that the provided action throws the provided {@link Error} when it is run.
     * @param action The action to run.
     * @param expectedError The expected {@link Error}.
     */
    public abstract assertThrowsAsync(action: PromiseLike<unknown> | (() => PromiseLike<unknown>), expectedError: Error): AsyncResult<void>;

    /**
     * Assert that the provided value is an instance of the provided {@link Type}.
     * @param value The value to check.
     * @param type The {@link Type} to check.
     * @param expression The expression that produced the value.
     * @param message An optional error message.
     */
    public assertInstanceOf<T>(value: unknown, type: Type<T>, typeCheck?: (value: unknown) => value is T): asserts value is T
    {
        return Test.assertInstanceOf(this, value, type, typeCheck);
    }

    /**
     * Assert that the provided value is an instance of the provided {@link Type}.
     * @param value The value to check.
     * @param type The {@link Type} to check.
     * @param expression The expression that produced the value.
     * @param message An optional error message.
     */
    public static assertInstanceOf<T>(test: Test, value: unknown, type: Type<T>, typeCheck?: (value: unknown) => value is T): asserts value is T
    {
        PreCondition.assertNotUndefinedAndNotNull(type, "type");

        if (isUndefinedOrNull(typeCheck))
        {
            typeCheck = ((value: unknown) => value instanceof type) as (value: unknown) => value is T;
        }

        if (!typeCheck(value))
        {
            test.fail(`Expected value to be of type ${type.name} but found ${value} instead.`);
        }
    }
}