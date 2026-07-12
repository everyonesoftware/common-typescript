import { ByteList } from "./byteList.js";
import { ByteReadStream } from "./byteReadStream.js";
import { ByteWriteStream } from "./byteWriteStream.js";
import { EmptyError } from "./emptyError.js";
import { PreCondition } from "./preCondition.js";
import { SyncResult } from "./syncResult.js";
import { isArray, isNumber, isUndefinedOrNull } from "./types.js";

/**
 * A {@link ByteReadStream} and {@link ByteWriteStream} implementation that is implemented using a
 * {@link ByteList}.
 */
export class ByteListStream implements ByteReadStream, ByteWriteStream
{
    private readonly list: ByteList;

    private constructor()
    {
        this.list = ByteList.create();
    }

    public static create(initialValues?: Uint8Array | number[]): ByteListStream
    {
        const result: ByteListStream = new ByteListStream();
        if (initialValues)
        {
            result.writeBytes(initialValues).await();
        }
        return result;
    }

    /**
     * Get the number of bytes that are available to be read.
     */
    public getAvailableByteCount(): number
    {
        return this.list.getCount().await();
    }

    public writeBytes(bytes: Uint8Array | number[], startIndex?: number, length?: number): SyncResult<number>
    {
        PreCondition.assertNotUndefinedAndNotNull(bytes, "bytes");

        if (isArray(bytes))
        {
            bytes = new Uint8Array(bytes);
        }
        if (isUndefinedOrNull(startIndex))
        {
            startIndex = 0;
        }
        if (isUndefinedOrNull(length))
        {
            length = bytes.length - startIndex;
        }

        PreCondition.assertInsertIndex(startIndex, bytes.length, "startIndex");
        PreCondition.assertBetween(0, length, bytes.length - startIndex, "length");

        this.list.addAll(bytes.subarray(startIndex, length + startIndex));

        return SyncResult.value(length);
    }

    public readBytes(count: number): SyncResult<Uint8Array>;
    public readBytes(output: Uint8Array, startIndex?: number, count?: number): SyncResult<number>;
    readBytes(countOrOutput: number | Uint8Array, startIndex?: number, count?: number): SyncResult<number> | SyncResult<Uint8Array>
    {
        let result: SyncResult<number> | SyncResult<Uint8Array>;
        if (isNumber(countOrOutput))
        {
            PreCondition.assertGreaterThanOrEqualTo(countOrOutput, 0, "count");

            if (!this.list.any().await())
            {
                result = SyncResult.error<Uint8Array>(new EmptyError());
            }
            else
            {
                const bytesReadCount: number = Math.min(countOrOutput, this.list.getCount().await());
                const output: Uint8Array = new Uint8Array(bytesReadCount);
                for (let i = 0; i < bytesReadCount; i++)
                {
                    output[i] = this.list.removeFirst().await();
                }
                result = SyncResult.value(output);
            }
        }
        else
        {
            PreCondition.assertNotUndefinedAndNotNull(countOrOutput, "output");

            if (isUndefinedOrNull(startIndex))
            {
                startIndex = 0;
            }
            if (isUndefinedOrNull(count))
            {
                count = countOrOutput.length - startIndex;
            }

            PreCondition.assertInsertIndex(startIndex, countOrOutput.length, "startIndex");
            PreCondition.assertBetween(0, count, countOrOutput.length - startIndex, "count");

            if (!this.list.any().await())
            {
                result = SyncResult.error<number>(new EmptyError());
            }
            else
            {
                const bytesReadCount: number = Math.min(count, this.list.getCount().await());
                for (let i = 0; i < bytesReadCount; i++)
                {
                    countOrOutput[startIndex + i] = this.list.removeFirst().await();
                }
                result = SyncResult.value(bytesReadCount);
            }
        }
        return result;
    }
}