import { Iterator } from "../sources/iterator.js";
import { JavascriptIterable } from "../sources/javascript.js";
import { isMap, Map } from "../sources/map.js";
import { MutableMap } from "../sources/mutableMap.js";
import { NotFoundError } from "../sources/notFoundError.js";
import { Test } from "./test.js";
import { TestRunner } from "./testRunner.js";

export function test(runner: TestRunner): void
{
    runner.testFile("map.ts", () =>
    {
        runner.testType("Map<TKey,TValue>", () =>
        {
            runner.testFunction("create()", (test: Test) =>
            {
                const map: MutableMap<number,string> = Map.create();
                test.assertSame(map.getCount().await(), 0);
            });

            mapTests(runner, Map.create);
        });
    });
}

export function mapTests(runner: TestRunner, creator: () => Map<number,string>): void
{
    runner.testType("Map<TKey,TValue>", () =>
    {
        runner.testFunction("creator()", (test: Test) =>
        {
            test.assertNotUndefinedAndNotNull(creator);
            
            const map: Map<number,string> = creator();
            test.assertNotUndefinedAndNotNull(map);
            test.assertEqual(map.getCount().await(), 0);
            test.assertTrue(isMap(map));
        });

        runner.testFunction("containsKey(TKey)", () =>
        {
            runner.test("when it doesn't contain the key", (test: Test) =>
            {
                const map: Map<number,string> = creator();

                test.assertFalse(map.containsKey(50).await());
            });
        });

        runner.testFunction("get(TKey)", () =>
        {
            runner.test("when it doesn't contain the key", (test: Test) =>
            {
                const map: Map<number,string> = creator();

                test.assertThrows(() => map.get(1).await(),
                    new NotFoundError(
                        "The key 1 was not found in the map."));
                test.assertEqual(map.getCount().await(), 0);
            });
        });

        runner.testFunction("toString()", () =>
        {
            function toStringTest(map: Map<number,string>, expected: string): void
            {
                runner.test(`with ${runner.toString(map)}`, (test: Test) =>
                {
                    test.assertEqual(map.toString(), expected);
                });
            }

            toStringTest(creator(), "{}");
        });

        runner.testFunction("iterateKeys()", () =>
        {
            function iterateKeysTests(map: Map<number,string>, expected: JavascriptIterable<number>): void
            {
                runner.test(`with ${runner.toString(map)}`, async (test: Test) =>
                {
                    const keyIterator: Iterator<number> = map.iterateKeys();
                    test.assertEqual(await keyIterator.toArray(), [...expected]);
                });
            }

            iterateKeysTests(creator(), []);
        });

        runner.testFunction("iterateValues()", () =>
        {
            function iterateValuesTests(map: Map<number,string>, expected: JavascriptIterable<string>): void
            {
                runner.test(`with ${runner.toString(map)}`, async (test: Test) =>
                {
                    const valueIterator: Iterator<string> = map.iterateValues();
                    test.assertEqual(await valueIterator.toArray(), [...expected]);
                });
            }

            iterateValuesTests(creator(), []);
        });
    });
}