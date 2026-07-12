import { PreCondition } from "./preCondition.js";
import { hasProperty, isFunction, isObject } from "./types.js";

export class Property<T>
{
    private readonly getter: () => T;
    private readonly setter: (value: T) => void;

    private constructor(getter: () => T, setter: (value: T) => void)
    {
        PreCondition.assertNotUndefinedAndNotNull(getter, "getter");
        PreCondition.assertNotUndefinedAndNotNull(setter, "setter");

        this.getter = getter;
        this.setter = setter;
    }

    public static create<T>(getter: () => T, setter: (value: T) => void): Property<T>;
    public static create<T>(options: { getter: () => T, setter: (value: T) => void }): Property<T>;
    public static create<T>(initialValue: T): Property<T>;
    static create<T>(getterOptionsOrInitialValue: (() => T) | { getter: () => T, setter: (value: T) => void } | T, setter?: (value: T) => void): Property<T>
    {
        let getter: () => T;
        if (isFunction(getterOptionsOrInitialValue))
        {
            getter = getterOptionsOrInitialValue;
        }
        else if (isObject(getterOptionsOrInitialValue) &&
            hasProperty(getterOptionsOrInitialValue, "getter") &&
            hasProperty(getterOptionsOrInitialValue, "setter"))
        {
            const options: { getter: () => T, setter: (value: T) => void } = getterOptionsOrInitialValue;
            getter = options.getter;
            setter = options.setter;
        }
        else
        {
            let initialValue: T = getterOptionsOrInitialValue;
            getter = () => { return initialValue; };
            setter = (value: T) => { initialValue = value; };
        }
        PreCondition.assertNotUndefinedAndNotNull(getter, "getter");
        PreCondition.assertNotUndefinedAndNotNull(setter, "setter");

        return new Property<T>(getter, setter);
    }

    public getValue(): T
    {
        return this.getter();
    }

    public setValue(value: T): this
    {
        this.setter(value);
        return this;
    }

    public toString(): string
    {
        return `${this.getValue()}`;
    }
}