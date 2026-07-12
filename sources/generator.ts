import { Iterator } from "./iterator.js";
import { JavascriptIterable, JavascriptIterator } from "./javascript.js";
import { List } from "./list.js";
import { PreCondition } from "./preCondition.js";
import { SyncResult } from "./syncResult.js";
import { Type } from "./types.js";

/**
 * A control that can be used to interact with a {@link Generator} while it is generating values.
 */
export interface GeneratorControl<T>
{
    /**
     * Add the provided value to the list of values that the {@link Generator} will return.
     * @param value The value to add to the {@link Generator}'s list of values.
     */
    addValue(value: T): void;

    /**
     * Add the provided values to the list of values that the {@link Generator} will return.
     * @param returnValues The values to add to the {@link Generator}'s list of values.
     */
    addValues(returnValues: JavascriptIterable<T>): void;

    /**
     * Get whether the {@link Generator} currently has a value.
     */
    hasCurrent(): boolean;

    /**
     * Get the current value of the {@link Generator}.
     */
    getCurrent(): T;
}

class InnerGeneratorControl<T> implements GeneratorControl<T>
{
    private readonly returnValues: List<T>;
    private done: boolean;

    private constructor()
    {
        this.returnValues = List.create();
        this.done = false;
    }

    public static create<T>(): InnerGeneratorControl<T>
    {
        return new InnerGeneratorControl<T>();
    }

    public addValue(returnValue: T): void
    {
        PreCondition.assertFalse(this.isDone(), "this.isDone()");

        this.returnValues.add(returnValue);
    }

    public addValues(returnValues: JavascriptIterable<T>): void
    {
        PreCondition.assertFalse(this.isDone(), "this.isDone()");

        this.returnValues.addAll(returnValues);
    }

    public hasCurrent(): boolean
    {
        return this.returnValues.any().await();
    }

    public getCurrent(): T
    {
        PreCondition.assertTrue(this.hasCurrent(), "this.hasCurrent()");
        PreCondition.assertFalse(this.isDone(), "this.isDone()");

        return this.returnValues.first().await();
    }

    public removeCurrent(): void
    {
        PreCondition.assertTrue(this.hasCurrent(), "this.hasCurrent()");
        PreCondition.assertFalse(this.isDone(), "this.isDone()");

        this.returnValues.removeFirst().await();
    }

    public setDone(): void
    {
        PreCondition.assertFalse(this.hasCurrent(), "this.hasCurrent()");
        PreCondition.assertFalse(this.isDone(), "this.isDone()");

        this.done = true;
    }

    public isDone(): boolean
    {
        return this.done;
    }
}

export class Generator<T> implements Iterator<T>
{
    private readonly control: InnerGeneratorControl<T>;
    private readonly generatorAction: (control: GeneratorControl<T>) => (void | T);
    private started: boolean;

    private constructor(generatorAction: (control: GeneratorControl<T>) => (void | T))
    {
        PreCondition.assertNotUndefinedAndNotNull(generatorAction, "generatorAction");

        this.control = InnerGeneratorControl.create();
        this.generatorAction = generatorAction;
        this.started = false;
    }

    public static create<T>(generatorAction: (control: GeneratorControl<T>) => (void | T)): Generator<T>
    {
        return new Generator<T>(generatorAction);
    }

    public next(): SyncResult<boolean>
    {
        return SyncResult.create(() =>
        {
            if (!this.control.isDone())
            {
                if (!this.hasStarted())
                {
                    this.started = true;
                }
                else
                {
                    this.control.removeCurrent();
                }

                if (!this.control.hasCurrent())
                {
                    const actionResult: void | T = this.generatorAction(this.control);
                    if (actionResult !== undefined)
                    {
                        this.control.addValue(actionResult);
                    }

                    if (!this.control.hasCurrent())
                    {
                        this.control.setDone();
                    }
                }
            }

            return this.hasCurrent();
        });
    }

    public hasStarted(): boolean
    {
        return this.started;
    }

    public hasCurrent(): boolean
    {
        return this.control.hasCurrent();
    }

    public getCurrent(): T
    {
        PreCondition.assertTrue(this.hasCurrent(), "this.hasCurrent()");

        return this.control.getCurrent();
    }

    public start(): SyncResult<this>
    {
        return Iterator.start<T, this>(this);
    }

    public takeCurrent(): SyncResult<T>
    {
        return Iterator.takeCurrent(this);
    }

    public any(): SyncResult<boolean>
    {
        return Iterator.any(this);
    }

    public getCount(): SyncResult<number>
    {
        return Iterator.getCount(this);
    }

    public toArray(): SyncResult<T[]>
    {
        return Iterator.toArray(this);
    }

    public concatenate(...toConcatenate: JavascriptIterable<T>[]): Iterator<T>
    {
        return Iterator.concatenate(this, ...toConcatenate);
    }

    public where(condition: (value: T) => (boolean | SyncResult<boolean>)): Iterator<T>
    {
        return Iterator.where(this, condition);
    }

    public map<TOutput>(mapping: (value: T) => TOutput | SyncResult<TOutput>): Iterator<TOutput>
    {
        return Iterator.map(this, mapping);
    }

    public flatMap<TOutput>(mapping: (value: T) => JavascriptIterable<TOutput>): Iterator<TOutput>
    {
        return Iterator.flatMap(this, mapping);
    }

    public whereInstanceOf<U extends T>(typeCheck: (value: T) => value is U): Iterator<U>
    {
        return Iterator.whereInstanceOf(this, typeCheck);
    }

    public whereInstanceOfType<U extends T>(type: Type<U>): Iterator<U>
    {
        return Iterator.whereInstanceOfType(this, type);
    }

    public first(condition?: ((value: T) => (boolean | SyncResult<boolean>)) | undefined): SyncResult<T>
    {
        return Iterator.first(this, condition);
    }

    public last(condition?: ((value: T) => (boolean | SyncResult<boolean>)) | undefined): SyncResult<T>
    {
        return Iterator.last(this, condition);
    }

    public take(maximumToTake: number): Iterator<T>
    {
        return Iterator.take(this, maximumToTake);
    }

    public skip(maximumToSkip: number): Iterator<T>
    {
        return Iterator.skip(this, maximumToSkip);
    }

    public [Symbol.iterator](): JavascriptIterator<T>
    {
        return Iterator[Symbol.iterator](this);
    }
}