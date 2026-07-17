import { AsyncIterator } from "./asyncIterator.js";
import { AsyncResult } from "./asyncResult.js";
import { CharacterReadStream } from "./characterReadStream.js";
import { JavascriptAsyncIterator } from "./javascript.js";
import { NotFoundError } from "./notFoundError.js";
import { PreCondition } from "./preCondition.js";
import { Type } from "./types.js";

export class CharacterReadStreamAsyncIterator implements AsyncIterator<string>
{
    private readonly readStream: CharacterReadStream;
    private current: string;
    private started: boolean;

    private constructor(readStream: CharacterReadStream)
    {
        PreCondition.assertNotUndefinedAndNotNull(readStream, "readStream");

        this.readStream = readStream;
        this.current = "";
        this.started = false;
    }

    public static create(readStream: CharacterReadStream): CharacterReadStreamAsyncIterator
    {
        return new CharacterReadStreamAsyncIterator(readStream);
    }

    public next(): AsyncResult<boolean>
    {
        return AsyncResult.create(async () =>
        {
            this.started = true;

            this.current = await this.readStream.readCharacter()
                .catch(NotFoundError, () => "");

            return this.hasCurrent();
        });
    }

    public hasStarted(): boolean
    {
        return this.started;
    }

    public hasCurrent(): boolean
    {
        return this.current !== "";
    }

    public getCurrent(): string
    {
        PreCondition.assertTrue(this.hasCurrent(), "this.hasCurrent()");

        return this.current;
    }

    public start(): AsyncResult<this>
    {
        return AsyncIterator.start<string,this>(this);
    }

    public takeCurrent(): AsyncResult<string>
    {
        return AsyncIterator.takeCurrent(this);
    }

    public any(): AsyncResult<boolean>
    {
        return AsyncIterator.any(this);
    }

    public getCount(): AsyncResult<number>
    {
        return AsyncIterator.getCount(this);
    }

    public toArray(): AsyncResult<string[]>
    {
        return AsyncIterator.toArray(this);
    }

    public where(condition: (value: string) => boolean | PromiseLike<boolean>): AsyncIterator<string>
    {
        return AsyncIterator.where(this, condition);
    }

    public map<TOutput>(mapping: (value: string) => (TOutput | PromiseLike<TOutput>)): AsyncIterator<TOutput>
    {
        return AsyncIterator.map(this, mapping);
    }

    public whereInstanceOf<U extends string>(typeCheck: (value: string) => value is U): AsyncIterator<U>
    {
        return AsyncIterator.whereInstanceOf(this, typeCheck);
    }

    public whereInstanceOfType<U extends string>(type: Type<U>): AsyncIterator<U>
    {
        return AsyncIterator.whereInstanceOfType(this, type);
    }

    public first(condition?: (value: string) => (boolean | PromiseLike<boolean>)): AsyncResult<string>
    {
        return AsyncIterator.first(this, condition);
    }

    public last(condition?: (value: string) => (boolean | PromiseLike<boolean>)): AsyncResult<string>
    {
        return AsyncIterator.last(this, condition);
    }

    public take(maximumToTake: number): AsyncIterator<string>
    {
        return AsyncIterator.take(this, maximumToTake);
    }

    public skip(maximumToSkip: number): AsyncIterator<string>
    {
        return AsyncIterator.skip(this, maximumToSkip);
    }

    public [Symbol.asyncIterator](): JavascriptAsyncIterator<string>
    {
        return AsyncIterator[Symbol.asyncIterator](this);
    }
}