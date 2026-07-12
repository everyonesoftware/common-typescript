import { Indexable } from "./Indexable.js";
import { JavascriptIterable } from "./javascript.js";
import { List } from "./list.js";
import { PreCondition } from "./preCondition.js";

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