import { PromiseAsyncResult } from "./promiseAsyncResult";
import { PostCondition } from "./postCondition";
import { PreCondition } from "./preCondition";
import { AsyncResult } from "./asyncResult";

export abstract class CharacterWriteStream
{
    /**
     * Write the provided text to this {@link CharacterWriteStream}.
     * @param text The text to write.
     * @returns The number of characters that were written.
     */
    public abstract writeString(text: string): AsyncResult<number>

    /**
     * Write the provided text (if provided) and then write a newline character sequence to this
     * {@link CharacterWriteStream}.
     * @param text The optional text to write before the newline character sequence.
     * @returns The number of characters that were written.
     */
    public writeLine(text?: string): AsyncResult<number>
    {
        return CharacterWriteStream.writeLine(this, text);
    }

    public static writeLine(writeStream: CharacterWriteStream, text?: string): AsyncResult<number>
    {
        PreCondition.assertNotUndefinedAndNotNull(writeStream, "writeStream");

        return PromiseAsyncResult.create(async () =>
        {
            let result: number = 0;

            if (text)
            {
                result += await writeStream.writeString(text);
            }
            result += await writeStream.writeString("\n");

            PostCondition.assertGreaterThan(result, 0, "result");

            return result;
        });
    }
}