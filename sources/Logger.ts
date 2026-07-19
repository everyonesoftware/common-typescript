/**
 * A type for emitting log messages.
 */
export abstract class Logger
{
    /**
     * Log an informational message.
     * @param message The message to log.
     */
    public abstract info(message: string): void;

    /**
     * Log an error message.
     * @param message The message to log as an error.
     */
    public abstract error(message: string): void;
}

export class ConsoleLogger extends Logger
{
    private constructor()
    {
        super();
    }

    public static create(): ConsoleLogger
    {
        return new ConsoleLogger();
    }

    public info(message: string): void
    {
        console.info(message);
    }

    public error(message: string): void
    {
        console.error(message);
    }
}