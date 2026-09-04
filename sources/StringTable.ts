import { AsyncResult } from "./asyncResult.js";
import { CharacterWriteStream } from "./characterWriteStream.js";
import { Indexable } from "./Indexable.js";
import { InMemoryCharacterWriteStream } from "./inMemoryCharacterWriteStream.js";
import { JavascriptIterable } from "./javascript.js";
import { List } from "./list.js";
import { PreCondition } from "./preCondition.js";
import { iterateLines } from "./strings.js";
import { SyncResult } from "./syncResult.js";
import { isArray, isUndefinedOrNull } from "./types.js";

/**
 * A style that can be applied to a {@link StringTable} column when it is being written.
 */
export interface StringTableWriteToColumnStyle
{
    /**
     * How the column's characters should be aligned. If this isn't provided, then the column will
     * default to "left".
     */
    readonly alignment?: "left" | "center" | "right";
}

/**
 * Options that can be provided to the {@link StringTable.writeTo()} function.
 */
export interface StringTableWriteToOptions
{
    /**
     * The text to write between each column. Defaults to ' '.
     */
    readonly betweenColumns?: string;

    /**
     * The styling of the columns of the {@link StringTable}. If a single style is provided then
     * that style will be applied to all columns.
     */
    readonly columnStyle?: StringTableWriteToColumnStyle | StringTableWriteToColumnStyle[];
}

/**
 * A collection of string values that can be written to a {@link CharacterWriteStream} in a table
 * format.
 */
export class StringTable
{
    private readonly rows: List<Indexable<string>>;

    private constructor()
    {
        this.rows = List.create();
    }

    public static create(): StringTable
    {
        return new StringTable();
    }

    public addRow(row: JavascriptIterable<string>): this
    {
        PreCondition.assertNotUndefinedAndNotNull(row, "row");

        this.rows.add(Indexable.create(row));

        return this;
    }

    public addRows(rows: JavascriptIterable<JavascriptIterable<string>>): this
    {
        PreCondition.assertNotUndefinedAndNotNull(rows, "rows");

        for (const row of rows)
        {
            this.addRow(row);
        }

        return this;
    }

    public getRows(): Indexable<Indexable<string>>
    {
        return this.rows;
    }

    private static getColumnWidths(rows: Indexable<Indexable<string>>): Indexable<number>
    {
        const columnWidths: List<number> = List.create();

        const rowCount: number = rows.getCount().await();
        for (let rowIndex = 0; rowIndex < rowCount; ++rowIndex)
        {
            const row: Indexable<string> = rows.get(rowIndex).await();

            const columnCount: number = row.getCount().await();
            for (let columnIndex = 0; columnIndex < columnCount; ++columnIndex)
            {
                const value: string = row.get(columnIndex).await();

                let maxLineLength: number = 0;
                for (const valueLine of iterateLines(value))
                {
                    maxLineLength = Math.max(maxLineLength, valueLine.length);
                }

                if (columnWidths.getCount().await() <= columnIndex)
                {
                    columnWidths.add(maxLineLength);
                }
                else
                {
                    columnWidths.set(columnIndex, Math.max(columnWidths.get(columnIndex).await(), maxLineLength));
                }
            }
        }

        return columnWidths;
    }

    private static getColumnStyle(columnStyles: StringTableWriteToColumnStyle | StringTableWriteToColumnStyle[] | undefined, columnIndex: number): StringTableWriteToColumnStyle | undefined
    {
        let result: StringTableWriteToColumnStyle | undefined;
        if (!isUndefinedOrNull(columnStyles))
        {
            if (!isArray(columnStyles))
            {
                result = columnStyles;
            }
            else if (columnIndex < columnStyles.length)
            {
                result = columnStyles[columnIndex];
            }
            else
            {
                result = columnStyles[columnStyles.length - 1];
            }
        }
        return result;
    }

    public writeTo(writeStream: InMemoryCharacterWriteStream, options?: StringTableWriteToOptions): SyncResult<number>
    public writeTo(writeStream: CharacterWriteStream, options?: StringTableWriteToOptions): AsyncResult<number>
    writeTo(writeStream: CharacterWriteStream, options?: StringTableWriteToOptions): AsyncResult<number>
    {
        PreCondition.assertNotUndefinedAndNotNull(writeStream, "writeStream");

        const betweenColumns: string = options?.betweenColumns ?? "";
        const rowCount: number = this.rows.getCount().await();
        const columnWidths: Indexable<number> = StringTable.getColumnWidths(this.rows); List.create();

        let result: AsyncResult<number>;
        if (writeStream instanceof InMemoryCharacterWriteStream)
        {
            result = SyncResult.create(() =>
            {
                let result: number = 0;
                for (let rowIndex = 0; rowIndex < rowCount; ++rowIndex)
                {
                    if (rowIndex > 0)
                    {
                        result += writeStream.writeLine().await();
                    }

                    const row: Indexable<string> = this.rows.get(rowIndex).await();

                    const rowValueLines: List<string[]> = List.create();

                    const columnCount: number = row.getCount().await();
                    let maxValueLineCount: number = 0;
                    for (let columnIndex = 0; columnIndex < columnCount; columnIndex++)
                    {
                        const value: string = row.get(columnIndex).await();
                        const valueLines: string[] = iterateLines(value).toArray().await();
                        rowValueLines.add(valueLines);

                        maxValueLineCount = Math.max(maxValueLineCount, valueLines.length);
                    }

                    for (let lineIndex = 0; lineIndex < maxValueLineCount; lineIndex++)
                    {
                        if (lineIndex > 0)
                        {
                            result += writeStream.writeLine().await();
                        }

                        for (let columnIndex = 0; columnIndex < columnCount; columnIndex++)
                        {
                            if (columnIndex > 0)
                            {
                                result += writeStream.writeString(betweenColumns).await();
                            }

                            const valueLines: string[] = rowValueLines.get(columnIndex).await();

                            let valueLine: string = "";
                            if (lineIndex < valueLines.length)
                            {
                                valueLine = valueLines[lineIndex];
                            }

                            const columnWidth: number = columnWidths.get(columnIndex).await();
                            const columnStyle: StringTableWriteToColumnStyle | undefined = StringTable.getColumnStyle(options?.columnStyle, columnIndex);
                            let leftPaddingCount: number = 0;
                            let rightPaddingCount: number = 0;
                            const totalPadding: number = columnWidth - valueLine.length;
                            if (columnStyle?.alignment === "right")
                            {
                                leftPaddingCount = totalPadding;
                            }
                            else if (columnStyle?.alignment === "center")
                            {
                                leftPaddingCount = Math.floor(totalPadding / 2);
                                rightPaddingCount = totalPadding - leftPaddingCount;
                            }
                            else
                            {
                                rightPaddingCount = totalPadding;
                            }

                            result += writeStream.writeString(" ".repeat(leftPaddingCount)).await();
                            result += writeStream.writeString(valueLine).await();
                            if (columnIndex < columnCount - 1)
                            {
                                result += writeStream.writeString(" ".repeat(rightPaddingCount)).await();
                            }
                        }
                    }
                }

                return result;
            });
        }
        else
        {
            result = AsyncResult.create(async () =>
            {
                let result: number = 0;
                for (let rowIndex = 0; rowIndex < rowCount; ++rowIndex)
                {
                    if (rowIndex > 0)
                    {
                        result += await writeStream.writeLine();
                    }

                    const row: Indexable<string> = this.rows.get(rowIndex).await();

                    const rowValueLines: List<string[]> = List.create();

                    const rowColumnCount: number = row.getCount().await();
                    let maxValueLineCount: number = 0;
                    for (let columnIndex = 0; columnIndex < rowColumnCount; columnIndex++)
                    {
                        const value: string = row.get(columnIndex).await();
                        const valueLines: string[] = iterateLines(value).toArray().await();
                        rowValueLines.add(valueLines);

                        maxValueLineCount = Math.max(maxValueLineCount, valueLines.length);
                    }

                    for (let lineIndex = 0; lineIndex < maxValueLineCount; lineIndex++)
                    {
                        if (lineIndex > 0)
                        {
                            result += await writeStream.writeLine();
                        }

                        for (let columnIndex = 0; columnIndex < rowColumnCount; columnIndex++)
                        {
                            if (columnIndex > 0)
                            {
                                result += await writeStream.writeString(betweenColumns);
                            }

                            const valueLines: string[] = rowValueLines.get(columnIndex).await();

                            let valueLine: string = "";
                            if (lineIndex < valueLines.length)
                            {
                                valueLine = valueLines[lineIndex];
                            }

                            const columnWidth: number = columnWidths.get(columnIndex).await();
                            const columnStyle: StringTableWriteToColumnStyle | undefined = StringTable.getColumnStyle(options?.columnStyle, columnIndex);
                            let leftPaddingCount: number = 0;
                            let rightPaddingCount: number = 0;
                            const totalPadding: number = columnWidth - valueLine.length;
                            if (columnStyle?.alignment === "right")
                            {
                                leftPaddingCount = totalPadding;
                            }
                            else if (columnStyle?.alignment === "center")
                            {
                                leftPaddingCount = Math.floor(totalPadding / 2);
                                rightPaddingCount = totalPadding - leftPaddingCount;
                            }
                            else
                            {
                                rightPaddingCount = totalPadding;
                            }

                            result += await writeStream.writeString(" ".repeat(leftPaddingCount));
                            result += await writeStream.writeString(valueLine);

                            if (columnIndex < rowColumnCount - 1)
                            {
                                // No need to write the right padding for the last column.
                                result += await writeStream.writeString(" ".repeat(rightPaddingCount));
                            }
                        }
                    }
                }

                return result;
            });
        }
        return result;
    }

    public toString(options: StringTableWriteToOptions = {}): string
    {
        const stream: InMemoryCharacterWriteStream = InMemoryCharacterWriteStream.create();
        this.writeTo(stream, options).await();
        return stream.getWrittenText();
    }
}