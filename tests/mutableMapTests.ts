import { Iterator } from "../sources/iterator.js";
import { JavascriptIterable } from "../sources/javascript.js";
import { isMap } from "../sources/map.js";
import { MutableMap } from "../sources/mutableMap.js";
import { NotFoundError } from "../sources/notFoundError.js";
import { mapTests } from "./mapTests.js";
import { Test } from "./test.js";
import { TestRunner } from "./testRunner.js";

export function test(runner: TestRunner): void
{
    runner.testFile("mutableMap.ts", () =>
    {
        runner.testType("MutableMap<TKey,TValue>", () =>
        {
            runner.testFunction("create()", (test: Test) =>
            {
                const map: MutableMap<number,string> = MutableMap.create();
                test.assertSame(map.getCount().await(), 0);
            });

            mutableMapTests(runner, MutableMap.create);
        });
    });
}

export function mutableMapTests(runner: TestRunner, creator: () => MutableMap<number,string>): void
{
    runner.testType("MutableMap<TKey,TValue>", () =>
    {
        mapTests(runner, creator);

        runner.testFunction("creator()", (test: Test) =>
        {
            test.assertNotUndefinedAndNotNull(creator);
            
            const map: MutableMap<number,string> = creator();
            test.assertNotUndefinedAndNotNull(map);
            test.assertEqual(map.getCount().await(), 0);
            test.assertTrue(isMap(map));
        });

        runner.testFunction("containsKey(TKey)", () =>
        {
            runner.test("when it doesn't contain the key", (test: Test) =>
            {
                const map: MutableMap<number,string> = creator();

                test.assertFalse(map.containsKey(50).await());
            });

            runner.test("when it contains the key", (test: Test) =>
            {
                const map: MutableMap<number,string> = creator().set(50, "fifty");

                test.assertTrue(map.containsKey(50).await());
            });
        });

        runner.testFunction("get(TKey)", () =>
        {
            runner.test("when it contains the key", (test: Test) =>
            {
                const map: MutableMap<number,string> = creator().set(1, "one");
                test.assertEqual(map.getCount().await(), 1);
                test.assertEqual(map.get(1).await(), "one");
                test.assertEqual(map.getCount().await(), 1);
            });

            runner.test("when it doesn't contain the key", (test: Test) =>
            {
                const map: MutableMap<number,string> = creator();

                test.assertThrows(() => map.get(1).await(),
                    new NotFoundError(
                        "The key 1 was not found in the map."));
                test.assertEqual(map.getCount().await(), 0);
            });
        });

        runner.testFunction("set(TKey,TValue)", () =>
        {
            function setTest(map: MutableMap<number,string>, key: number, value: string): void
            {
                runner.test(`with ${runner.andList([map, key, value])}`, (test: Test) =>
                {
                    const setResult: MutableMap<number,string> = map.set(key, value);
                    test.assertSame(setResult, map);
                    test.assertSame(map.get(key).await(), value);
                });
            }

            setTest(creator(), 0, "zero");
            setTest(creator(), 1, "1");
            setTest(creator(), -1, "negative one");

            setTest(creator(), undefined!, "hello");
            setTest(creator(), null!, "oops");
            setTest(creator(), 10, undefined!);
            setTest(creator(), 11, null!);

            setTest(creator().set(1, "1"), 1, "one");
        });

        runner.testFunction("toString()", () =>
        {
            function toStringTest(map: MutableMap<number,string>, expected: string): void
            {
                runner.test(`with ${runner.toString(map)}`, (test: Test) =>
                {
                    test.assertEqual(map.toString(), expected);
                });
            }

            toStringTest(creator(), "{}");
            toStringTest(creator().set(1, "one"), `{1:"one"}`);
            toStringTest(creator().set(2, "2").set(1, "one"), `{2:"2",1:"one"}`);
        });

        runner.testFunction("iterateKeys()", () =>
        {
            function iterateKeysTests(map: MutableMap<number,string>, expected: JavascriptIterable<number>): void
            {
                runner.test(`with ${runner.toString(map)}`, async (test: Test) =>
                {
                    const keyIterator: Iterator<number> = map.iterateKeys();
                    test.assertEqual(await keyIterator.toArray(), [...expected]);
                });
            }

            iterateKeysTests(creator(), []);
            iterateKeysTests(creator().set(5, "five"), [5]);
            iterateKeysTests(creator().set(5, "five").set(6, "six"), [5, 6]);
            iterateKeysTests(creator().set(5, "5").set(6, "6").set(7, "7"), [5, 6, 7]);
        });

        runner.testFunction("iterateValues()", () =>
        {
            function iterateValuesTests(map: MutableMap<number,string>, expected: JavascriptIterable<string>): void
            {
                runner.test(`with ${runner.toString(map)}`, async (test: Test) =>
                {
                    const valueIterator: Iterator<string> = map.iterateValues();
                    test.assertEqual(await valueIterator.toArray(), [...expected]);
                });
            }

            iterateValuesTests(creator(), []);
            iterateValuesTests(creator().set(5, "five"), ["five"]);
            iterateValuesTests(creator().set(5, "five").set(6, "six"), ["five", "six"]);
            iterateValuesTests(creator().set(5, "5").set(6, "6").set(7, "7"), ["5", "6", "7"]);
        });
    });
}