import { Property } from "../sources/property.js";
import { Test } from "./test.js";
import { TestRunner } from "./testRunner.js";

export function test(runner: TestRunner): void
{
    runner.testFile("property.ts", () =>
    {
        runner.testType("Property<T>", () =>
        {
            runner.testFunction("create()", () =>
            {
                runner.test("with initialValue", (test: Test) =>
                {
                    const property: Property<number> = Property.create(5);
                    test.assertEqual(5, property.getValue());
                    
                    const setResult: Property<number> = property.setValue(20);
                    test.assertSame(property, setResult);
                    test.assertEqual(20, property.getValue());
                    
                    test.assertEqual("20", property.toString());
                });

                runner.test("with getter and setter functions", (test: Test) =>
                {
                    let propertyValue: string = "hello";

                    const property: Property<string> = Property.create(
                        () => propertyValue,
                        (value: string) => { propertyValue = value; },
                    );
                    test.assertEqual("hello", property.getValue());
                    
                    const setResult: Property<string> = property.setValue("there");
                    test.assertSame(property, setResult);
                    test.assertEqual("there", property.getValue());
                    test.assertEqual("there", propertyValue);
                    
                    test.assertEqual("there", property.toString());
                });

                runner.test("with options", (test: Test) =>
                {
                    let propertyValue: string = "hello";

                    const property: Property<string> = Property.create({
                        getter: () => propertyValue,
                        setter: (value: string) => { propertyValue = value; },
                    });
                    test.assertEqual("hello", property.getValue());
                    
                    const setResult: Property<string> = property.setValue("there");
                    test.assertSame(property, setResult);
                    test.assertEqual("there", property.getValue());
                    test.assertEqual("there", propertyValue);
                    
                    test.assertEqual("there", property.toString());
                });
            });
        });
    });
}