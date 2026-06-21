import * as assert from "assert";

import { PreCondition } from "../sources/preCondition";
import { isFunction, Type } from "../sources/types";
import { Test } from "./test";
import { SyncResult } from "../sources/syncResult";
import { PromiseAsyncResult } from "../sources/promiseAsyncResult";
import { JavascriptIterable } from "../sources";

/**
 * A {@link Test} type that uses the standard "assert" module to make assertions.
 */
export class AssertTest implements Test
{
    private constructor()
    {
    }

    /**
     * Create a new {@link AssertTest} object.
     */
    public static create(): AssertTest
    {
        return new AssertTest();
    }

    public fail(message: string): never
    {
        PreCondition.assertNotEmpty(message, "message");

        assert.fail(message);
    }

    public assertUndefined(value: unknown): asserts value is undefined
    {
        Test.assertUndefined(this, value);
    }

    public assertNotUndefined<T>(value: T): asserts value is NonNullable<T>
    {
        Test.assertNotUndefined(this, value);
    }

    public assertNull(value: unknown): asserts value is null
    {
        Test.assertNull(this, value);
    }

    public assertNotNull<T>(value: T): asserts value is NonNullable<T>
    {
        Test.assertNotNull(this, value);
    }

    public assertNotUndefinedAndNotNull<T>(value: T): asserts value is NonNullable<T>
    {
        Test.assertNotUndefinedAndNotNull(this, value);
    }

    public assertNotEmpty(value: JavascriptIterable<unknown>): void
    {
        Test.assertNotEmpty(this, value);
    }

    public assertSame<T>(left: T, right: T): void
    {
        assert.strictEqual(left, right);
    }

    public assertNotSame<T>(left: T, right: T): void
    {
        assert.notStrictEqual(left, right);
    }

    public assertEqual<T>(left: T, right: T, message?: string): void
    {
        assert.deepStrictEqual(left, right, message);
    }

    public assertNotEqual<T>(left: T, right: T): void
    {
        assert.notDeepStrictEqual(left, right);
    }

    public assertFalse(value: boolean): void
    {
        Test.assertFalse(this, value);
    }

    public assertTrue(value: boolean): void
    {
        Test.assertTrue(this, value);
    }

    public assertThrows(action: SyncResult<unknown> | (() => void), expectedError?: Error): void
    {
        if (!isFunction(action))
        {
            const syncResult: SyncResult<unknown> = action;
            action = () => { syncResult.await(); };
        }
        assert.throws(action, expectedError);
    }

    public assertThrowsAsync(action: Promise<unknown> | (() => Promise<unknown>), expectedError: Error): PromiseAsyncResult<void>
    {
        const promiseOrAsyncAction = isFunction(action)
            ? async () => await action()
            : action;
        return PromiseAsyncResult.create(assert.rejects(promiseOrAsyncAction, expectedError));
    }

    public assertInstanceOf<T>(value: unknown, type: Type<T>, typeCheck?: (value: unknown) => value is T): asserts value is T
    {
        Test.assertInstanceOf(this, value, type, typeCheck);
    }
}