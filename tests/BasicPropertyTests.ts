import { BasicProperty, List, SyncDisposable } from "../sources/index.js";
import { Test } from "./test.js";
import { TestRunner } from "./testRunner.js";

export function test(runner: TestRunner): void
{
    runner.testFile("BasicProperty.ts", () =>
    {
        runner.testType("BasicProperty<T>", () =>
        {
            runner.testFunction("create()", () =>
            {
                function createTest<T>(value: T): void
                {
                    runner.test(`with ${runner.toString(value)}`, (test: Test) =>
                    {
                        const property: BasicProperty<T> = BasicProperty.create(value);
                        test.assertNotUndefinedAndNotNull(property);
                        test.assertEqual(value, property.get());
                        test.assertEqual(`${value}`, property.toString());
                    });
                }

                createTest(undefined);
                createTest("");
                createTest(23435);
            });

            runner.testFunction("onChanged()", () =>
            {
                runner.test("when set to current value", (test: Test) =>
                {
                    const eventValues: List<[number, number]> = List.create();
                    const property: BasicProperty<number> = BasicProperty.create(0);

                    const subscription: SyncDisposable = property.onChanged((newValue: number, oldValue: number) => eventValues.add([newValue, oldValue]));
                    test.assertNotUndefinedAndNotNull(subscription);

                    property.set(property.get());
                    test.assertEqual(List.create(), eventValues);

                    test.assertTrue(subscription.dispose().await());

                    property.set(property.get());
                    test.assertEqual(List.create(), eventValues);
                });

                runner.test("when set to different value", (test: Test) =>
                {
                    const eventValues: List<[number, number]> = List.create();
                    const property: BasicProperty<number> = BasicProperty.create(0);

                    const subscription: SyncDisposable = property.onChanged((newValue: number, oldValue: number) => eventValues.add([newValue, oldValue]));
                    test.assertNotUndefinedAndNotNull(subscription);

                    property.set(1);
                    test.assertEqual(List.create([[1, 0]]), eventValues);

                    test.assertTrue(subscription.dispose().await());

                    property.set(2);
                    test.assertEqual(List.create([[1, 0]]), eventValues);
                });
            });
        });
    });
}