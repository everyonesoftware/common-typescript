import { CharacterList } from "./characterList";
import { CharacterReadStream } from "./characterReadStream";
import { CharacterWriteStream } from "./characterWriteStream";
import { EmptyError } from "./emptyError";
import { JavascriptIterable } from "./javascript";
import { PreCondition } from "./preCondition";
import { Result } from "./result";
import { join } from "./strings";
import { SyncResult } from "./syncResult";
import { isNumber, isString, isUndefinedOrNull } from "./types";

/**
 * A {@link CharacterReadStream} and {@link CharacterWriteStream} implementation that is implemented using a
 * {@link CharacterList}.
 */
export class CharacterListStream implements CharacterReadStream, CharacterWriteStream
{
    private readonly list: CharacterList;

    private constructor()
    {
        this.list = CharacterList.create();
    }

    public static create(initialValues?: JavascriptIterable<string>): CharacterListStream
    {
        const result: CharacterListStream = new CharacterListStream();
        if (initialValues)
        {
            result.writeCharacters(initialValues).await();
        }
        return result;
    }

    public writeCharacters(characters: JavascriptIterable<string>, startIndex?: number, length?: number): SyncResult<number>
    {
        PreCondition.assertNotUndefinedAndNotNull(characters, "characters");

        const characterString: string = isString(characters) ? characters : join("", characters);
        if (isUndefinedOrNull(startIndex))
        {
            startIndex = 0;
        }
        if (isUndefinedOrNull(length))
        {
            length = characterString.length - startIndex;
        }

        PreCondition.assertInsertIndex(startIndex, characterString.length, "startIndex");
        PreCondition.assertBetween(0, length, characterString.length - startIndex, "length");

        this.list.addAll(characterString.slice(startIndex, length + startIndex));

        return SyncResult.value(length);
    }


    public writeString(text: string): Result<number>
    {
        this.list.addAll(text);

        return SyncResult.value(text.length);
    }

    public writeLine(text?: string): Result<number>
    {
        return CharacterWriteStream.writeLine(this, text);
    }

    /**
     * Get the number of characters that are available to be read.
     */
    public getAvailableCharacterCount(): number
    {
        return this.list.getCount().await();
    }

    public readCharacter(): Result<string>
    {
        return !this.list.any().await()
            ? SyncResult.error(new EmptyError())
            : SyncResult.value(this.list.removeFirst().await());
    }
    
    public readCharacters(count: number): SyncResult<string>;
    public readCharacters(output: string[], startIndex?: number, count?: number): SyncResult<number>;
    readCharacters(countOrOutput: number | string[], startIndex?: number, count?: number): SyncResult<number> | SyncResult<string>
    {
        let result: SyncResult<number> | SyncResult<string>;
        if (isNumber(countOrOutput))
        {
            PreCondition.assertGreaterThanOrEqualTo(countOrOutput, 0, "count");

            if (!this.list.any().await())
            {
                result = SyncResult.error<string>(new EmptyError());
            }
            else
            {
                const bytesReadCount: number = Math.min(countOrOutput, this.list.getCount().await());
                let output: string = "";
                for (let i = 0; i < bytesReadCount; i++)
                {
                    output += this.list.removeFirst().await();
                }
                result = SyncResult.value(output);
            }
        }
        else
        {
            PreCondition.assertNotUndefinedAndNotNull(countOrOutput, "output");

            if (isUndefinedOrNull(startIndex))
            {
                startIndex = 0;
            }
            if (isUndefinedOrNull(count))
            {
                count = countOrOutput.length - startIndex;
            }

            PreCondition.assertInsertIndex(startIndex, countOrOutput.length, "startIndex");
            PreCondition.assertBetween(0, count, countOrOutput.length - startIndex, "count");

            if (!this.list.any().await())
            {
                result = SyncResult.error<number>(new EmptyError());
            }
            else
            {
                const bytesReadCount: number = Math.min(count, this.list.getCount().await());
                for (let i = 0; i < bytesReadCount; i++)
                {
                    countOrOutput[startIndex + i] = this.list.removeFirst().await();
                }
                result = SyncResult.value(bytesReadCount);
            }
        }
        return result;
    }

    public readUntil(searchString: string): Result<string>
    {
        return CharacterReadStream.readUntil(this, searchString);
    }

    public readLine(): Result<string>
    {
        return CharacterReadStream.readLine(this);
    }
}