import { ConversionError } from "../sources/ConversionError.js";
import { asJSONData, isJSONArrayData, isJSONData, isJSONObjectData, isUndefined, JSONData, toJSONData } from "../sources/index.js";
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

        runner.testFunction("isJSONObjectData()", () =>
        {
            function isJSONObjectDataTest(value: unknown, expected: boolean): void
            {
                runner.test(`with ${runner.toString(value)}`, (test: Test) =>
                {
                    test.assertEqual(isJSONObjectData(value), expected);
                });
            }

            isJSONObjectDataTest({}, true);
            isJSONObjectDataTest({ "a": null }, true);
            isJSONObjectDataTest({ 5: "a" }, true);
            isJSONObjectDataTest({ 4: 7 }, true);

            isJSONObjectDataTest(undefined, false);
            isJSONObjectDataTest(null, false);
            isJSONObjectDataTest("", false);
            isJSONObjectDataTest("hello", false);
            isJSONObjectDataTest("hello there", false);
            isJSONObjectDataTest(1235, false);
            isJSONObjectDataTest(false, false);
            isJSONObjectDataTest(true, false);
            isJSONObjectDataTest([], false);
            isJSONObjectDataTest([1, 2, "hello"], false);
            isJSONObjectDataTest(() => { }, false);
            isJSONObjectDataTest(runner, false);
            isJSONObjectDataTest({ "a": undefined }, false);
            isJSONObjectDataTest({ "f": () => { } }, false);
            isJSONObjectDataTest([undefined], false);
        });

        runner.testFunction("isJSONArrayData()", () =>
        {
            function isJSONArrayDataTest(value: unknown, expected: boolean): void
            {
                runner.test(`with ${runner.toString(value)}`, (test: Test) =>
                {
                    test.assertEqual(isJSONArrayData(value), expected);
                });
            }

            isJSONArrayDataTest([], true);
            isJSONArrayDataTest([1, 2, "hello"], true);

            isJSONArrayDataTest({}, false);
            isJSONArrayDataTest({ "a": null }, false);
            isJSONArrayDataTest({ 5: "a" }, false);
            isJSONArrayDataTest({ 4: 7 }, false);
            isJSONArrayDataTest(undefined, false);
            isJSONArrayDataTest(null, false);
            isJSONArrayDataTest("", false);
            isJSONArrayDataTest("hello", false);
            isJSONArrayDataTest("hello there", false);
            isJSONArrayDataTest(1235, false);
            isJSONArrayDataTest(false, false);
            isJSONArrayDataTest(true, false);
            isJSONArrayDataTest(() => { }, false);
            isJSONArrayDataTest(runner, false);
            isJSONArrayDataTest({ "a": undefined }, false);
            isJSONArrayDataTest({ "f": () => { } }, false);
            isJSONArrayDataTest([undefined], false);
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