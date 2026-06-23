import { Iterator } from "./iterator";
import { JavascriptIterable, JavascriptIterator } from "./javascript";
import { PreCondition } from "./preCondition";
import { isDigit, isLetter } from "./strings";
import { SyncResult } from "./syncResult";
import { Token } from "./Token";
import { isIterator, Type } from "./types";

/**
 * A type that converts a stream of characters into a stream of tokens.
 */
export class Tokenizer implements Iterator<Token>
{
    private readonly characters: Iterator<string>

    private currentToken: Token | undefined;
    private started: boolean;

    private constructor(characters: Iterator<string>)
    {
        this.characters = characters;
        this.started = false;
    }

    public static create(characters: JavascriptIterable<string>): Tokenizer
    {
        PreCondition.assertNotUndefinedAndNotNull(characters, "characters");

        return new Tokenizer(isIterator<string>(characters) ? characters : Iterator.create(characters));
    }

    public hasStarted(): boolean
    {
        return this.started;
    }

    public hasCurrent(): boolean
    {
        return this.currentToken !== undefined;
    }

    public getCurrent(): Token
    {
        PreCondition.assertTrue(this.hasCurrent(), "this.hasCurrent()");

        return this.currentToken!;
    }

    public next(): SyncResult<boolean>
    {
        return SyncResult.create(() =>
        {
            if (!this.hasStarted())
            {
                this.characters.start().await();
                this.started = true;
            }

            if (!this.characters.hasCurrent())
            {
                this.currentToken = undefined;
            }
            else
            {
                switch (this.characters.getCurrent())
                {
                    case " ":
                    case "\t":
                        this.currentToken = Token.whitespace(this.readWhile(c => c === " " || c === "\t"));
                        break;

                    case "\n":
                        this.characters.next().await();
                        this.currentToken = Token.newLine();
                        break;

                    case "\r":
                        if (this.characters.next().await() && this.characters.getCurrent() === "\n")
                        {
                            this.characters.next().await();
                            this.currentToken = Token.newLine("\r\n");
                        }
                        else
                        {
                            this.currentToken = Token.whitespace("\r");
                        }
                        break;

                    case "(":
                        this.characters.next().await();
                        this.currentToken = Token.leftParenthesis();
                        break;

                    case ")":
                        this.characters.next().await();
                        this.currentToken = Token.rightParenthesis();
                        break;

                    case ".":
                        this.characters.next().await();
                        this.currentToken = Token.period();
                        break;

                    case "_":
                        this.characters.next().await();
                        this.currentToken = Token.underscore();
                        break;

                    case "/":
                        this.characters.next().await();
                        this.currentToken = Token.forwardSlash();
                        break;

                    case "\\":
                        this.characters.next().await();
                        this.currentToken = Token.backslash();
                        break;

                    case ":":
                        this.characters.next().await();
                        this.currentToken = Token.colon();
                        break;

                    default:
                        if (isLetter(this.characters.getCurrent()))
                        {
                            this.currentToken = Token.letters(this.readWhile(isLetter));
                        }
                        else if (isDigit(this.characters.getCurrent()))
                        {
                            this.currentToken = Token.digits(this.readWhile(isDigit));
                        }
                        else
                        {
                            this.currentToken = Token.unknown(this.characters.takeCurrent().await());
                        }
                        break;
                }
            }

            return this.hasCurrent();
        });
    }

    private readWhile(condition: (character: string) => boolean): string
    {
        PreCondition.assertNotUndefinedAndNotNull(condition, "condition");
        PreCondition.assertTrue(this.characters.hasCurrent(), "this.characters.hasCurrent()");
        PreCondition.assertTrue(condition(this.characters.getCurrent()), "condition(this.characters.getCurrent())");

        let result: string = "";
        do
        {
            result += this.characters.takeCurrent().await()
        }
        while (this.characters.hasCurrent() && condition(this.characters.getCurrent()));

        return result;
    }

    public start(): SyncResult<this>
    {
        return Iterator.start<Token, this>(this);
    }

    public takeCurrent(): SyncResult<Token>
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

    public toArray(): SyncResult<Token[]>
    {
        return Iterator.toArray(this);
    }

    public concatenate(...toConcatenate: JavascriptIterable<Token>[]): Iterator<Token>
    {
        return Iterator.concatenate(this, ...toConcatenate);
    }

    public where(condition: (value: Token) => (boolean | SyncResult<boolean>)): Iterator<Token>
    {
        return Iterator.where(this, condition);
    }

    public map<TOutput>(mapping: (value: Token) => TOutput | SyncResult<TOutput>): Iterator<TOutput>
    {
        return Iterator.map(this, mapping);
    }

    public flatMap<TOutput>(mapping: (value: Token) => JavascriptIterable<TOutput>): Iterator<TOutput>
    {
        return Iterator.flatMap(this, mapping);
    }

    public whereInstanceOf<U extends Token>(typeCheck: (value: Token) => value is U): Iterator<U>
    {
        return Iterator.whereInstanceOf(this, typeCheck);
    }

    public whereInstanceOfType<U extends Token>(type: Type<U>): Iterator<U>
    {
        return Iterator.whereInstanceOfType(this, type);
    }

    public first(condition?: ((value: Token) => (boolean | SyncResult<boolean>)) | undefined): SyncResult<Token>
    {
        return Iterator.first(this, condition);
    }

    public last(condition?: ((value: Token) => (boolean | SyncResult<boolean>)) | undefined): SyncResult<Token>
    {
        return Iterator.last(this, condition);
    }

    public take(maximumToTake: number): Iterator<Token>
    {
        return Iterator.take(this, maximumToTake);
    }

    public skip(maximumToSkip: number): Iterator<Token>
    {
        return Iterator.skip(this, maximumToSkip);
    }

    public [Symbol.iterator](): JavascriptIterator<Token>
    {
        return Iterator[Symbol.iterator](this);
    }
}