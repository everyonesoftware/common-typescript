import { PreCondition } from "./preCondition.js";
import { AsyncResult } from "./asyncResult.js";
import { SyncResult } from "./syncResult.js";

export abstract class CharacterReadStream
{
    /**
     * Read a single character from this stream.
     */
    public abstract readCharacter(): AsyncResult<string>;

    public readCharacters(count: number): AsyncResult<string>
    {
        return CharacterReadStream.readCharacters(this, count);
    }

    public static readCharacters(readStream: CharacterReadStream, count: number): AsyncResult<string>
    {
        let characters: string = "";
        function readUntilCount(countRemaining: number): AsyncResult<string>
        {
            return readStream.readCharacter()
                .then((character: string) =>
                {
                    characters += character;
                    return countRemaining === 0
                        ? SyncResult.value(characters)
                        : readUntilCount(countRemaining - 1);
                });
        }
        return readUntilCount(count);
    }

    /**
     * Read characters from this stream until the provided {@link searchString} is found or the end
     * of the stream is reached. The {@link searchString} will be included in the returned string if
     * it is found..
     * @param searchString The string to search for.
     */
    public readUntil(searchString: string): AsyncResult<string>
    {
        return CharacterReadStream.readUntil(this, searchString);
    }

    public static readUntil(readStream: CharacterReadStream, searchString: string): AsyncResult<string>
    {
        PreCondition.assertNotUndefinedAndNotNull(readStream, "readStream");
        PreCondition.assertNotEmpty(searchString, "searchString");

        let characters: string = "";
        function readUntilSearchString(): AsyncResult<string>
        {
            return readStream.readCharacter()
                .then((character: string) =>
                {
                    characters += character;
                    return characters.endsWith(searchString)
                        ? SyncResult.value(characters)
                        : readUntilSearchString();
                });
        }
        return readUntilSearchString();
    }

    /**
     * Read a sequence of characters from this stream until either a newline character ('\\n') or
     * the end of the stream is reached. Terminating newline characters will be included in the
     * returned string.
     */
    public readLine(): AsyncResult<string>
    {
        return CharacterReadStream.readLine(this);
    }

    public static readLine(readStream: CharacterReadStream): AsyncResult<string>
    {
        PreCondition.assertNotUndefinedAndNotNull(readStream, "readStream");

        return readStream.readUntil("\n");
    }
}