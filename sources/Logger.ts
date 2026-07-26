import { LogLevel } from "./LogLevel.js";
import { PreCondition } from "./preCondition.js";
import { isUndefinedOrNull } from "./types.js";

/**
 * A type for emitting log messages.
 */
export abstract class Logger
{
    /**
     * Log the provided message with the provided {@link LogLevel} severity. If no {@link LogLevel}
     * is provided, then it will default to {@link LogLevel.Info}.
     * @param message The message to log
     * @param level The {@link LogLevel} associated with the provided message. If no
     * {@link LogLevel} is provided, then it will default to {@link LogLevel.Info}.
     */
    public abstract log(message: string, level?: LogLevel): void;
    /**
     * Log the provided message with the provided {@link LogLevel} severity.
     * @param level The {@link LogLevel} associated with the provided message.
     * @param message The message to log
     */
    public abstract log(level: LogLevel, message: string): void;

    public static log(messageOrLevel: string | LogLevel, levelOrMessage: LogLevel | string | undefined, logFunction: (level: LogLevel, message: string) => void): void
    {
        let message: string;
        let level: LogLevel;

        if (messageOrLevel instanceof LogLevel)
        {
            level = messageOrLevel;
            message = levelOrMessage as string;

            PreCondition.assertNotUndefinedAndNotNull(level, "level");
            PreCondition.assertNotEmpty(message, "message");
        }
        else
        {
            message = messageOrLevel;
            level = isUndefinedOrNull(levelOrMessage) ? LogLevel.Info : levelOrMessage as LogLevel;

            PreCondition.assertNotEmpty(message, "message");
            PreCondition.assertNotUndefinedAndNotNull(level);
        }

        logFunction(level, message);
    }

    /**
     * Log a trace message.
     * @param message The message to log.
     */
    public trace(message: string): void
    {
        Logger.trace(this, message);
    }

    public static trace(logger: Logger, message: string): void
    {
        PreCondition.assertNotUndefinedAndNotNull(logger, "logger");

        logger.log(message, LogLevel.Trace);
    }

    /**
     * Log a debug message.
     * @param message The message to log.
     */
    public debug(message: string): void
    {
        Logger.debug(this, message);
    }

    public static debug(logger: Logger, message: string): void
    {
        PreCondition.assertNotUndefinedAndNotNull(logger, "logger");

        logger.log(message, LogLevel.Debug);
    }

    /**
     * Log an informational message.
     * @param message The message to log.
     */
    public info(message: string): void
    {
        Logger.info(this, message);
    }

    public static info(logger: Logger, message: string): void
    {
        PreCondition.assertNotUndefinedAndNotNull(logger, "logger");

        logger.log(message, LogLevel.Info);
    }

    /**
     * Log a warning message.
     * @param message The message to log.
     */
    public warning(message: string): void
    {
        Logger.warning(this, message);
    }

    public static warning(logger: Logger, message: string): void
    {
        PreCondition.assertNotUndefinedAndNotNull(logger, "logger");

        logger.log(message, LogLevel.Warning);
    }

    /**
     * Log an error message.
     * @param message The message to log as an error.
     */
    public error(message: string): void
    {
        Logger.error(this, message);
    }

    public static error(logger: Logger, message: string): void
    {
        PreCondition.assertNotUndefinedAndNotNull(logger, "logger");

        logger.log(message, LogLevel.Error);
    }
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

    public log(message: string, level?: LogLevel): void;
    public log(level: LogLevel, message: string): void;
    public log(messageOrLevel: string | LogLevel, levelOrMessage?: LogLevel | string): void
    {
        Logger.log(messageOrLevel, levelOrMessage, (level: LogLevel, message: string) =>
        {
            switch (level)
            {
                case LogLevel.Trace:
                    console.trace(message);
                    break;

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