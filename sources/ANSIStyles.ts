export class ANSIStyles
{
    private constructor()
    {
    }

    private static color(colorCode: number, text: string): string
    {
        return `\x1b[${colorCode}m${text}\x1b[0m`;
    }

    public static black(text: string): string
    {
        return this.color(30, text);
    }

    public static red(text: string): string
    {
        return this.color(31, text);
    }

    public static green(text: string): string
    {
        return this.color(32, text);
    }

    public static yellow(text: string): string
    {
        return this.color(33, text);
    }

    public static blue(text: string): string
    {
        return this.color(34, text);
    }
}