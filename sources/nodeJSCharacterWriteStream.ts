import { PromiseAsyncResult } from "./promiseAsyncResult";
import { CharacterWriteStream } from "./characterWriteStream";
import { PreCondition } from "./preCondition";

export class NodeJSCharacterWriteStream extends CharacterWriteStream
{
    private readonly nodeJSWriteStream: NodeJS.WriteStream;

    private constructor(nodeJSWriteStream: NodeJS.WriteStream)
    {
        PreCondition.assertNotUndefinedAndNotNull(nodeJSWriteStream, "nodeJSWriteStream");

        super();

        this.nodeJSWriteStream = nodeJSWriteStream;
    }

    public static create(nodeJSWriteStream: NodeJS.WriteStream): NodeJSCharacterWriteStream
    {
        return new NodeJSCharacterWriteStream(nodeJSWriteStream);
    }

    public writeString(text: string): PromiseAsyncResult<number>
    {
        PreCondition.assertNotUndefinedAndNotNull(text, "text");

        return PromiseAsyncResult.create(new Promise<number>((resolve, reject) =>
        {
            this.nodeJSWriteStream.write(text, (error?: Error | null) =>
            {
                if (error)
                {
                    reject(error);
                }
                else
                {
                    resolve(text.length);
                }
            });
        }));
    }
}