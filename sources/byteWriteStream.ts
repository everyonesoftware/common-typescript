import { AsyncResult } from "./asyncResult";

/**
 * A stream that writes bytes.
 */
export abstract class ByteWriteStream
{
    /**
     * Write the provided bytes to this {@link ByteWriteStream}.
     * @param bytes The bytes to write.
     * @param startIndex The index to start writing from.
     * @param length The number of bytes to write.
     * @returns The number of bytes that were written.
     */
    public abstract writeBytes(bytes: Uint8Array | number[], startIndex?: number, length?: number): AsyncResult<number>
}