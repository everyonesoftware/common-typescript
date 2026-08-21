import { PreCondition } from "./preCondition.js";
import { Property } from "./property.js";
import { SyncDisposable } from "./SyncDisposable.js";
import { hasProperty, isUndefinedOrNull } from "./types.js";
import { Event } from "./Event.js";

/**
 * Options that can be passed to {@link DynamicProperty.create()}.
 */
export interface DynamicPropertyCreateOptions<T>
{
    /**
     * The function that will be run to get the {@link DynamicProperty}'s value.
     */
    readonly getter: () => T;
    /**
     * The function that will be run to set the {@link DynamicProperty}'s value.
     * @param value The value to set.
     */
    readonly setter: (value: T) => void;
}

function isDynamicPropertyCreateOptions<T>(value: unknown): value is DynamicPropertyCreateOptions<T>
{
    return hasProperty(value, "getter") && hasProperty(value, "setter");
}

/**
 * A {@link Property} type that runs provided functions to get and set its value.
 */
export class DynamicProperty<T> implements Property<T>
{
    private readonly getter: () => T;
    private readonly setter: (value: T) => void;
    private changedEvent: Event<[T,T]> | undefined;

    private constructor(getter: () => T, setter: (value: T) => void)
    {
        PreCondition.assertNotUndefinedAndNotNull(getter, "getter");
        PreCondition.assertNotUndefinedAndNotNull(setter, "setter");

        this.getter = getter;
        this.setter = setter;
    }

    public static create<T>(getter: () => T, setter: (value: T) => void): DynamicProperty<T>;
    public static create<T>(options: DynamicPropertyCreateOptions<T>): DynamicProperty<T>;
    static create<T>(getterOptionsOrInitialValue: (() => T) | DynamicPropertyCreateOptions<T>, setter?: (value: T) => void): DynamicProperty<T>
    {
        let getter: () => T;
        if (isDynamicPropertyCreateOptions<T>(getterOptionsOrInitialValue))
        {
            getter = getterOptionsOrInitialValue.getter;
            setter = getterOptionsOrInitialValue.setter;
        }
        else
        {
            getter = getterOptionsOrInitialValue;
        }
        PreCondition.assertNotUndefinedAndNotNull(getter, "getter");
        PreCondition.assertNotUndefinedAndNotNull(setter, "setter");

        return new DynamicProperty<T>(getter, setter);
    }

    public get(): T
    {
        return this.getter();
    }

    public set(value: T): this
    {
        const oldValue: T = this.get();
        if (oldValue !== value)
        {
            this.setter(value);
            this.changedEvent?.run(value, oldValue);
        }
        return this;
    }

    public onChanged(listener: (newValue: T, oldValue: T) => unknown): SyncDisposable
    {
        PreCondition.assertNotUndefinedAndNotNull(listener, "listener");

        if (isUndefinedOrNull(this.changedEvent))
        {
            this.changedEvent = Event.create();
        }
        return this.changedEvent.subscribe(listener);
    }

    public toString(): string
    {
        return Property.toString(this);
    }
}