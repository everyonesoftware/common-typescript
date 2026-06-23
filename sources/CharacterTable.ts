import { Indexable } from "./Indexable";
import { JavascriptIterable } from "./javascript";
import { List } from "./list";
import { PreCondition } from "./preCondition";

export class CharacterTable
{
    private readonly rows: List<Indexable<string>>;

    private constructor()
    {
        this.rows = List.create();
    }

    public static create(): CharacterTable
    {
        return new CharacterTable();
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
}