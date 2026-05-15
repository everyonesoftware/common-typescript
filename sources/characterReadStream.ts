import { PreCondition } from "./preCondition";
import { Result } from "./result";
import { SyncResult } from "./syncResult";

export abstract class CharacterReadStream
{
    /**
     * Read a single character from this stream.
     */
    public abstract readCharacter(): Result<string>;

    public readCharacters(count: number): Result<string>
    {
        return CharacterReadStream.readCharacters(this, count);
    }

    public static readCharacters(readStream: CharacterReadStream, count: number): Result<string>
    {
        let characters: string = "";
        function readUntilCount(countRemaining: number): Result<string>
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
    public readUntil(searchString: string): Result<string>
    {
        return CharacterReadStream.readUntil(this, searchString);
    }

    public static readUntil(readStream: CharacterReadStream, searchString: string): Result<string>
    {
        PreCondition.assertNotUndefinedAndNotNull(readStream, "readStream");
        PreCondition.assertNotEmpty(searchString, "searchString");

        let characters: string = "";
        function readUntilSearchString(): Result<string>
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
    public readLine(): Result<string>
    {
        return CharacterReadStream.readLine(this);
    }

    public static readLine(readStream: CharacterReadStream): Result<string>
    {
        PreCondition.assertNotUndefinedAndNotNull(readStream, "readStream");

        return readStream.readUntil("\n");
    }
}