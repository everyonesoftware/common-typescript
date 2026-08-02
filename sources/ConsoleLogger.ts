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

    public logData(data: unknown, level?: LogLevel): void;
    public logData(level: LogLevel, data: unknown): void;
    logData(dataOrLevel: unknown | LogLevel, levelOrData?: LogLevel | unknown): void
    {
        Logger.logData(dataOrLevel, levelOrData, (level: LogLevel, data: unknown) =>
        {
            switch (level)
            {
                case LogLevel.Debug:
                    console.debug(data);
                    break;

                case LogLevel.Info:
                    console.info(data);
                    break;

                case LogLevel.Warning:
                    console.warn(data);
                    break;

                case LogLevel.Error:
                    console.error(data);
                    break;

                default:
                    console.error(`Unsupported LogLevel: ${level}, Data: ${JSON.stringify(data)}`);
                    break;
            }
        });
    }
}