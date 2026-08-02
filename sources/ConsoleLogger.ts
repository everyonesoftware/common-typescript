import { Logger } from "./Logger.js";
import { LogLevel } from "./LogLevel.js";

/**
 * A {@link Logger} that logs using {@link console}'s logging functions.
 */
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

    public log(message: string, level?: LogLevel): void;
    public log(level: LogLevel, message: string): void;
    public log(messageOrLevel: string | LogLevel, levelOrMessage?: LogLevel | string): void
    {
        Logger.log(messageOrLevel, levelOrMessage, (level: LogLevel, message: string) =>
        {
            switch (level)
            {
                case LogLevel.Debug:
                    console.debug(message);
                    break;

                case LogLevel.Info:
                    console.info(message);
                    break;

                case LogLevel.Warning:
                    console.warn(message);
                    break;

                case LogLevel.Error:
                    console.error(message);
                    break;

                default:
                    console.error(`Unsupported LogLevel: ${level}, Message: ${message}`);
                    break;
            }
        });
    }
}