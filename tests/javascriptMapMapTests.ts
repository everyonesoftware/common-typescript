import { JavascriptMapMap } from "../sources/javascriptMapMap.js";
import { mapTests } from "./mapTests.js";
import { Test } from "./test.js";
import { TestRunner } from "./testRunner.js";

export function test(runner: TestRunner): void
{
    runner.testFile("javascriptMapMap.ts", () =>
    {
        runner.testType("JavascriptMapMap<TKey,TValue>", () =>
        {
            runner.testFunction("create()", (test: Test) =>
            {
                const map: JavascriptMapMap<number,string> = JavascriptMapMap.create();
                test.assertEqual(map.getCount().await(), 0);
            });

            mapTests(runner, JavascriptMapMap.create);
        });
    });
}
