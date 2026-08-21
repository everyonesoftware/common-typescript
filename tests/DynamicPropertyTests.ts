import { DynamicProperty } from "../sources/DynamicProperty.js";
import { Property } from "../sources/property.js";
import { Test } from "./test.js";
import { TestRunner } from "./testRunner.js";

export function test(runner: TestRunner): void
{
    runner.testFile("DynamicProperty.ts", () =>
    {
        runner.testType("DynamicProperty<T>", () =>
        {
            runner.testFunction("create()", () =>
            {
                runner.test("with getter and setter functions", (test: Test) =>
                {
                    let propertyValue: string = "hello";

                    const property: DynamicProperty<string> = DynamicProperty.create(
                        () => propertyValue,
                        (value: string) => { propertyValue = value; },
                    );
                    test.assertEqual("hello", property.get());
                    
                    const setResult: DynamicProperty<string> = property.set("there");
                    test.assertSame(property, setResult);
                    test.assertEqual("there", property.get());
                    test.assertEqual("there", propertyValue);
                    
                    test.assertEqual("there", property.toString());
                });

                runner.test("with options", (test: Test) =>
                {
                    let propertyValue: string = "hello";

                    const property: DynamicProperty<string> = DynamicProperty.create({
                        getter: () => propertyValue,
                        setter: (value: string) => { propertyValue = value; },
                    });
                    test.assertEqual("hello", property.get());
                    
                    const setResult: Property<string> = property.set("there");
                    test.assertSame(property, setResult);
                    test.assertEqual("there", property.get());
                    test.assertEqual("there", propertyValue);
                    
                    test.assertEqual("there", property.toString());
                });
            });
        });
    });
}