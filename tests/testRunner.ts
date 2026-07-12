import { andList } from "../sources/english.js";
import { Iterable } from "../sources/iterable.js";
import { PreCondition } from "../sources/preCondition.js";
import { ToStringFunctions } from "../sources/toStringFunctions.js";
import { isBoolean, Type } from "../sources/types.js";
import { Test } from "./test.js";
import { TestSkip } from "./testSkip.js";

/**
 * A type that can be used to run tests.
 */
export abstract class TestRunner
{
    /**
     * Get a {@link string} that concatenates the {@link string} representation of each
     * of the provided values into an "and-list".
     * @param values The values to concatenate.
     */
    public andList(values: unknown[] | Iterable<unknown>): string
    {
        return TestRunner.andList(this, values);
    }

    /**
     * Get a {@link string} that concatenates the {@link string} representation of each
     * of the provided values into an "and-list".
     * @param values The values to concatenate.
     */
    public static andList(runner: TestRunner, values: unknown[] | Iterable<unknown>): string
    {
        PreCondition.assertNotUndefinedAndNotNull(runner, "runner");
        PreCondition.assertNotUndefinedAndNotNull(values, "values");

        return andList(values.map((value: unknown) => runner.toString(value)));
    }

    /**
     * Get the {@link string} representation of the provided value.
     * @param value The value to get the {@link string} representation of.
     */
    public toString(value: unknown): string
    {
        return TestRunner.toString(this, value);
    }

    /**
     * Get the {@link string} representation of the provided value.
     * @param value The value to get the {@link string} representation of.
     */
    public static toString(_runner: TestRunner, value: unknown): string
    {
        const toStringFunctions: ToStringFunctions = ToStringFunctions.create();
        return toStringFunctions.toString(value);
    }

    public skip(message?: string): TestSkip;
    /**
     * Create a {@link TestSkip} object that will prevent tests from being run.
     * @param shouldSkip Whether these tests should be skipped.
     * @param message The message that explains why the tests are being skipped.
     */
    public skip(shouldSkip: boolean, message?: string): TestSkip;
    skip(messageOrShouldSkip?: string | boolean | undefined, message?: string): TestSkip
    {
        let shouldSkip: boolean;
        if (!isBoolean(messageOrShouldSkip))
        {
            shouldSkip = true;
            message = messageOrShouldSkip;
        }
        else
        {
            shouldSkip = messageOrShouldSkip;
        }
        return TestRunner.skip(this, shouldSkip, message);
    }

    /**
     * Create a {@link TestSkip} object that will prevent tests from being run.
     * @param shouldSkip Whether these tests should be skipped.
     * @param message The message that explains why the tests are being skipped.
     */
    public static skip(_runner: TestRunner, shouldSkip?: boolean, message?: string): TestSkip
    {
        return TestSkip.create(shouldSkip, message);
    }

    /**
     * Create a test group that will test the provided file.
     * @param fileName The name of the file that is being tested.
     * @param testAction The action that will run the tests.
     */
    public abstract testFile(fileName: string, testAction: (() => void) | ((test: Test) => void)): void;
    /**
     * Create a test group that will test the provided file.
     * @param fileName The name of the file that is being tested.
     * @param skip A value that indicates whether these tests should be skipped.
     * @param testAction The action that will run the tests.
     */
    public abstract testFile(fileName: string, skip: TestSkip | undefined, testAction: (() => void) | ((test: Test) => void)): void;

    /**
     * Create a test group that will test the provided type.
     * @param type The {@link Type} or name of the type that is being tested.
     * @param testAction The action that will run the tests.
     */
    public abstract testType(typeNameOrType: string | Type<unknown>, testAction: (() => void) | ((test: Test) => void)): void;
    /**
     * Create a test group that will test the provided type.
     * @param type The {@link Type} or name of the type that is being tested.
     * @param skip A value that indicates whether these tests should be skipped.
     * @param testAction The action that will run the tests.
     */
    public abstract testType(typeNameOrType: string | Type<unknown>, skip: TestSkip | undefined, testAction: (() => void) | ((test: Test) => void)): void;

    /**
     * Create a test group that will test the provided function.
     * @param functionSignature The signature of the function that is being tested.
     * @param testAction The action that will run the tests.
     */
    public abstract testFunction(functionSignature: string, testAction: (() => void) | ((test: Test) => void)): void;
    /**
     * Create a test group that will test the provided function.
     * @param functionSignature The signature of the function that is being tested.
     * @param testAction The action that will run the tests.
     */
    public abstract testFunction(functionSignature: string, skip: TestSkip | undefined, testAction: (() => void) | ((test: Test) => void)): void;

    /**
     * Create and run a test group with the provided name.
     * @param testGroupName The name of the test group to run.
     * @param testAction The action that runs the test group.
     */
    public abstract testGroup(testGroupName: string, testAction: () => void): void;
    /**
     * Create and run a test group with the provided name.
     * @param testGroupName The name of the test group to run.
     * @param testAction The action that runs the test group.
     */
    public abstract testGroup(testGroupName: string, skip: TestSkip | undefined, testAction: () => void): void;

    /**
     * Create and run a test with the provided name.
     * @param testName The name of the test to run.
     * @param testAction The action that runs the test.
     */
    public abstract test(testName: string, testAction: (test: Test) => void): void;
    /**
     * Create and run a test with the provided name.
     * @param testName The name of the test to run.
     * @param testAction The action that runs the test.
     */
    public abstract test(testName: string, skip: TestSkip | undefined, testAction: (test: Test) => void): void;
}