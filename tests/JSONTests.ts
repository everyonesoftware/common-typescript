import { ConversionError } from "../sources/ConversionError.js";
import { asJSONData, isJSONData, isUndefined, JSONData, toJSONData } from "../sources/index.js";
import { Test } from "./test.js";
import { TestRunner } from "./testRunner.js";

export function test(runner: TestRunner): void
{
    runner.testFile("JSON.ts", () =>
    {
        runner.testFunction("isJSONData()", () =>
        {
            function isJSONDataTest(value: unknown, expected: boolean): void
            {
                runner.test(`with ${runner.toString(value)}`, (test: Test) =>
                {
                    test.assertEqual(isJSONData(value), expected);
                });
            }

            isJSONDataTest(undefined, false);
            isJSONDataTest(null, true);
            isJSONDataTest("", true);
            isJSONDataTest("hello", true);
            isJSONDataTest("hello there", true);
            isJSONDataTest(1235, true);
            isJSONDataTest(false, true);
            isJSONDataTest(true, true);
            isJSONDataTest({}, true);
            isJSONDataTest({ "a": null }, true);
            isJSONDataTest({ 5: "a" }, true);
            isJSONDataTest({ 4: 7 }, true);
            isJSONDataTest([], true);
            isJSONDataTest([1, 2, "hello"], true);

            isJSONDataTest(() => { }, false);
            isJSONDataTest(runner, false);
            isJSONDataTest({ "a": undefined }, false);
            isJSONDataTest({ "f": () => { } }, false);
            isJSONDataTest([undefined], false);
        });

        runner.testFunction("toJSONData()", () =>
        {
            function toJSONDataErrorTest(value: unknown, expected: Error): void
            {
                runner.test(`with ${runner.toString(value)}`, (test: Test) =>
                {
                    test.assertThrows(() => toJSONData(value).await(), expected);
                })
            }

            toJSONDataErrorTest(undefined, new ConversionError("Unable to convert undefined to JSONData."));

            function toJSONDataTest(value: unknown, expected?: JSONData): void
            {
                if (isUndefined(expected))
                {
                    expected = asJSONData(value);
                }

                runner.test(`with ${runner.toString(value)}`, (test: Test) =>
                {
                    test.assertEqual(expected, toJSONData(value).await());
                });
            }

            toJSONDataTest(null);
            toJSONDataTest(5);
            toJSONDataTest(false);
            toJSONDataTest(true);
            toJSONDataTest("abc");
            toJSONDataTest({});
            toJSONDataTest({ a: undefined }, {});
            toJSONDataTest({ a: () => { } }, {});
            toJSONDataTest({ a: 50 });
            toJSONDataTest({ a: [50, { b: 51 }] });
            toJSONDataTest([]);
            toJSONDataTest([undefined], []);
            toJSONDataTest([
                "https://geojson.org/geojson-ld/geojson-context.jsonld",
                {
                    "@version": "1.1",
                    wx: "https://api.weather.gov/ontology#",
                    geo: "http://www.opengis.net/ont/geosparql#",
                    unit: "http://codes.wmo.int/common/unit/",
                    "@vocab": "https://api.weather.gov/ontology#",
                },
            ]);
        });
    });
}