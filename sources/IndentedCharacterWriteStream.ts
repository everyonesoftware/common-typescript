import { AsyncResult } from "./asyncResult";
import { CharacterWriteStream } from "./characterWriteStream";
import { List } from "./list";
import { PreCondition } from "./preCondition";
import { isNumber, isString, isUndefinedOrNull } from "./types";

export class IndentedCharacterWriteStream extends CharacterWriteStream
{
    private readonly innerStream: CharacterWriteStream;
    private currentIndentationList: List<string>;
    private currentIndentation: string;
    private singleIndent: string;
    private atLineStart: boolean;

    private constructor(innerStream: CharacterWriteStream)
    {
        PreCondition.assertNotUndefinedAndNotNull(innerStream, "innerStream");

        super();

        this.innerStream = innerStream;
        this.currentIndentationList = List.create();
        this.currentIndentation = "";
        this.singleIndent = "  ";
        this.atLineStart = true;
    }

    public static create(innerStream: CharacterWriteStream): IndentedCharacterWriteStream
    {
        return new IndentedCharacterWriteStream(innerStream);
    }

    public getSingleIndent(): string
    {
        return this.singleIndent;
    }

    public setSingleIndent(singleIndent: string): this
    {
        PreCondition.assertNotUndefinedAndNotNull(singleIndent, "singleIndent");

        this.singleIndent = singleIndent;

        return this;
    }

    public getCurrentIndentationCount(): number
    {
        return this.currentIndentationList.getCount().await();
    }

    public getCurrentIndentation(): string
    {
        return this.currentIndentation;
    }

    public addIndentation(singleIndent?: string): this
    {
        if (isUndefinedOrNull(singleIndent))
        {
            singleIndent = this.singleIndent;
        }

        this.currentIndentationList.add(singleIndent);
        if (singleIndent)
        {
            this.currentIndentation = this.currentIndentation + singleIndent;
        }

        return this;
    }

    public removeIndentation(): string
    {
        PreCondition.assertGreaterThanOrEqualTo(this.getCurrentIndentationCount(), 1, "this.getCurrentIndentationCount()");

        const result: string = this.currentIndentationList.removeLast().await();
        if (result)
        {
            this.currentIndentation = this.currentIndentation.substring(0, this.currentIndentation.length - result.length);
        }

        return result;
    }

    public indent(action: () => (void | number | PromiseLike<void | number>)): AsyncResult<number>;
    public indent(singleIndent: string, action: () => (void | number | PromiseLike<void | number>)): AsyncResult<number>;
    indent(actionOrSingleIndent: (() => (void | number | PromiseLike<void | number>)) | string, action?: () => (void | number | PromiseLike<void | number>)): AsyncResult<number>
    {
        let singleIndent: string | undefined;
        if (isString(actionOrSingleIndent))
        {
            singleIndent = actionOrSingleIndent;
            action = action!;
        }
        else
        {
            action = actionOrSingleIndent;
        }

        PreCondition.assertNotUndefinedAndNotNull(action, "action");

        return AsyncResult.create(async () =>
        {
            let result: void | number;
            this.addIndentation(singleIndent);
            try
            {
                result = await action();
                if (!isNumber(result))
                {
                    result = 0;
                }
            }
            finally
            {
                this.removeIndentation();
            }
            return result;
        });

    }

    public writeString(text: string): AsyncResult<number>
    {
        return AsyncResult.create(async () =>
        {
            let result: number = 0;

            const textLength: number = text.length;
            let startIndex: number = 0;
            while (startIndex < textLength)
            {
                const newLineCharacterIndex: number = text.indexOf("\n", startIndex);
                const atLineStartAfterWrite: boolean = (newLineCharacterIndex !== -1);
                const nextLineStartIndex: number = (atLineStartAfterWrite ? newLineCharacterIndex + 1 : textLength);
                if ((newLineCharacterIndex === startIndex) ||
                    (newLineCharacterIndex === startIndex + 1 && text[startIndex] === "\r"))
                {
                    // Current line is empty. Write the line without any indentation.
                    result += await this.innerStream.writeString(text.substring(startIndex, nextLineStartIndex))
                    startIndex = nextLineStartIndex;
                }
                else
                {
                    // Current line is not empty. Write current indentation and then write the line.
                    if (this.atLineStart && this.currentIndentation)
                    {
                        result += await this.innerStream.writeString(this.currentIndentation);
                    }

                    result += await this.innerStream.writeString(text.substring(startIndex, nextLineStartIndex));
                    startIndex = nextLineStartIndex;
                }
                this.atLineStart = atLineStartAfterWrite;
            }

            return result;
        });
    }
}