import { List } from "./list.js";
import { Logger } from "./Logger.js";
import { LogLevel } from "./LogLevel.js";
import { PreCondition } from "./preCondition.js";

export class FakeLog
{
    private readonly level: LogLevel;
    private readonly message: string;

    private constructor(level: LogLevel, message: string)
    {
        PreCondition.assertNotUndefinedAndNotNull(level, "level");
        PreCondition.assertNotEmpty(message, "message");

        this.level = level;
        this.message = message;
    }

    public static create(level: LogLevel, message: string): FakeLog
    {
        return new FakeLog(level, message);
    }

    public getLevel(): LogLevel
    {
        return this.level;
    }

    public getMessage(): string
    {
        return this.message;
    }
}

export class FakeLogger extends Logger
{
    private logs: List<FakeLog>;

    private constructor()
    {
        super();

        this.logs = List.create();
    }

    public static create(): FakeLogger
    {
        return new FakeLogger();
    }

    public getLogs(): Iterable<FakeLog>
    {
        return this.logs;
    }

    public clearLogs(): void
    {
        this.logs = List.create();
    }

    public log(message: string, level?: LogLevel): void;
    public log(level: LogLevel, message: string): void;
    log(messageOrLevel: string | LogLevel, levelOrMessage?: LogLevel | string): void
    {
        Logger.log(messageOrLevel, levelOrMessage, (level: LogLevel, message: string) =>
        {
            this.logs.add(FakeLog.create(level, message));
        });
    }
}