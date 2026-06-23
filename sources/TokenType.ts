import { PreCondition } from "./preCondition";

export class TokenType
{
    private readonly name: string;

    private constructor(name: string)
    {
        PreCondition.assertNotEmpty(name, "name");

        this.name = name;
    }

    private static create(name: string): TokenType
    {
        return new TokenType(name);
    }

    public static readonly Whitespace: TokenType = TokenType.create("Whitespace");
    public static readonly NewLine: TokenType = TokenType.create("NewLine");
    public static readonly Letters: TokenType = TokenType.create("Letters");
    public static readonly Digits: TokenType = TokenType.create("Digits");
    public static readonly LeftParenthesis: TokenType = TokenType.create("LeftParenthesis");
    public static readonly RightParenthesis: TokenType = TokenType.create("RightParenthesis");
    public static readonly Backslash: TokenType = TokenType.create("Backslash");
    public static readonly ForwardSlash: TokenType = TokenType.create("ForwardSlash");
    public static readonly Unknown: TokenType = TokenType.create("Unknown");
    public static readonly Period: TokenType = TokenType.create("Period");
    public static readonly Underscore: TokenType = TokenType.create("Underscore");
    public static readonly Colon: TokenType = TokenType.create("Colon");

    public toString(): string
    {
        return this.name;
    }
}