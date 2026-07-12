import { PreCondition } from "./preCondition.js";
import { TokenType } from "./TokenType.js";

export class Token
{
    private static readonly newLineToken: Token = Token.create("\n", TokenType.NewLine);
    private static readonly carriageReturnNewLineToken: Token = Token.create("\r\n", TokenType.NewLine);
    private static readonly leftParenthesisToken: Token = Token.create("(", TokenType.LeftParenthesis);
    private static readonly rightParenthesisToken: Token = Token.create(")", TokenType.RightParenthesis);
    private static readonly backslashToken: Token = Token.create("\\", TokenType.Backslash);
    private static readonly forwardSlashToken: Token = Token.create("/", TokenType.ForwardSlash);
    private static readonly periodToken: Token = Token.create(".", TokenType.Period);
    private static readonly underscoreToken: Token = Token.create("_", TokenType.Underscore);
    private static readonly colonToken: Token = Token.create(":", TokenType.Colon);

    private readonly text: string;
    private readonly type: TokenType;

    private constructor(text: string, type: TokenType)
    {
        PreCondition.assertNotEmpty(text, "text");
        PreCondition.assertNotUndefinedAndNotNull(type, "type");

        this.text = text;
        this.type = type;
    }

    private static create(text: string, type: TokenType): Token
    {
        return new Token(text, type);
    }

    public static whitespace(text: string): Token
    {
        return Token.create(text, TokenType.Whitespace);
    }

    public static newLine(text?: string): Token
    {
        text ??= "\n";
        
        let result: Token;
        switch (text)
        {
            case "\n":
                result = Token.newLineToken;
                break;
            
            case "\r\n":
                result = Token.carriageReturnNewLineToken;
                break;

            default:
                result = Token.create(text, TokenType.NewLine);
                break;
        }
        return result;
    }

    public static leftParenthesis(): Token
    {
        return Token.leftParenthesisToken;
    }

    public static rightParenthesis(): Token
    {
        return Token.rightParenthesisToken;
    }

    public static backslash(): Token
    {
        return Token.backslashToken;
    }

    public static forwardSlash(): Token
    {
        return Token.forwardSlashToken;
    }

    public static period(): Token
    {
        return Token.periodToken;
    }

    public static underscore(): Token
    {
        return Token.underscoreToken;
    }

    public static colon(): Token
    {
        return Token.colonToken;
    }

    public static letters(text: string): Token
    {
        return Token.create(text, TokenType.Letters);
    }

    public static digits(text: string): Token
    {
        return Token.create(text, TokenType.Digits);
    }

    public static unknown(text: string): Token
    {
        return Token.create(text, TokenType.Unknown);
    }

    public getText(): string
    {
        return this.text;
    }

    public getType(): TokenType
    {
        return this.type;
    }
}