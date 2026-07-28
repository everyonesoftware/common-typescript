import { JSONData } from "./JSON.js";
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
     * @param message The message to log.
     * @param level The {@link LogLevel} associated with the provided message. If no
     * {@link LogLevel} is provided, then it will default to {@link LogLevel.Info}.
     */
    public abstract log(message: string, level?: LogLevel): void;
    /**
     * Log the provided message with the provided {@link LogLevel} severity.
     * @param level The {@link LogLevel} associated with the provided message.
     * @param message The message to log.
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

    /**
     * Log the provided data with the provided {@link LogLevel} severity. If no {@link LogLevel}
     * is provided, then it will default to {@link LogLevel.Info}.
     * @param data The data to log.
     * @param level The {@link LogLevel} associated with the provided data. If no
     * {@link LogLevel} is provided, then it will default to {@link LogLevel.Info}.
     */
    public logData(data: JSONData, level?: LogLevel): void;
    /**
     * Log the provided data with the provided {@link LogLevel} severity.
     * @param level The {@link LogLevel} associated with the provided data.
     * @param data The data to log.
     */
    public logData(level: LogLevel, data: JSONData): void;
    logData(dataOrLevel: JSONData | LogLevel, levelOrData?: LogLevel | JSONData): void
    {
        Logger.logData(dataOrLevel, levelOrData, (level: LogLevel, data: JSONData) =>
        {
            this.log(level, JSON.stringify(data));
        });
    }

    public static logData(dataOrLevel: JSONData | LogLevel, levelOrData: LogLevel | JSONData | undefined, logDataFunction: (level: LogLevel, data: JSONData) => void): void
    {
        let data: JSONData;
        let level: LogLevel;

        if (dataOrLevel instanceof LogLevel)
        {
            level = dataOrLevel;
            data = levelOrData as JSONData;

            PreCondition.assertNotUndefinedAndNotNull(level, "level");
            PreCondition.assertNotUndefined(data, "data");
        }
        else
        {
            data = dataOrLevel;
            level = isUndefinedOrNull(levelOrData) ? LogLevel.Info : levelOrData as LogLevel;

            PreCondition.assertNotUndefined(data, "data");
            PreCondition.assertNotUndefinedAndNotNull(level);
        }

        logDataFunction(level, data);
    }

    /**
     * Log debug data.
     * @param data The data to log.
     */
    public debugData(data: string): void
    {
        Logger.debugData(this, data);
    }

    public static debugData(logger: Logger, data: JSONData): void
    {
        PreCondition.assertNotUndefinedAndNotNull(logger, "logger");

        logger.logData(data, LogLevel.Debug);
    }

    /**
     * Log informational data.
     * @param data The data to log.
     */
    public infoData(data: JSONData): void
    {
        Logger.infoData(this, data);
    }

    public static infoData(logger: Logger, data: JSONData): void
    {
        PreCondition.assertNotUndefinedAndNotNull(logger, "logger");

        logger.logData(data, LogLevel.Info);
    }

    /**
     * Log warning data.
     * @param data The data to log.
     */
    public warningData(data: JSONData): void
    {
        Logger.warningData(this, data);
    }

    public static warningData(logger: Logger, data: JSONData): void
    {
        PreCondition.assertNotUndefinedAndNotNull(logger, "logger");

        logger.logData(data, LogLevel.Warning);
    }

    /**
     * Log error data.
     * @param data The data to log as an error.
     */
    public errorData(data: JSONData): void
    {
        Logger.errorData(this, data);
    }

    public static errorData(logger: Logger, data: JSONData): void
    {
        PreCondition.assertNotUndefinedAndNotNull(logger, "logger");

        logger.logData(data, LogLevel.Error);
    }
}