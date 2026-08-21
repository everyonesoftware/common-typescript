import { Event } from "./Event.js";
import { PreCondition } from "./preCondition.js";
import { Property } from "./property.js";
import { SyncDisposable } from "./SyncDisposable.js";
import { isUndefinedOrNull } from "./types.js";

/**
 * A basic {@link Property} implementation that contains its own value.
 */
export class BasicProperty<T> implements Property<T>
{
    private value: T;
    private changedEvent: Event<[T,T]> | undefined;

    private constructor(value: T)
    {
        this.value = value;
    }

    public static create<T>(value: T): BasicProperty<T>
    {
        return new BasicProperty<T>(value);
    }

    public get(): T
    {
        return this.value;
    }

    public set(value: T): this
    {
        if (this.value !== value)
        {
            const oldValue: T = this.value;
            this.value = value;
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