import { AsyncResult } from "./asyncResult.js";

/**
 * A stream that reads bytes.
 */
export abstract class ByteReadStream
{
    /**
     * Attempt to read the provided {@link count} number of bytes. Returns the bytes that were read.
     * The number of bytes returned may be less than the number requested.
     * @param count The number of bytes to attempt to read.
     */
    public abstract readBytes(count: number): AsyncResult<Uint8Array>;
    /**
     * Attempt to read bytes into the provided output array. Returns the number of bytes that were
     * read.
     * @param output The array that the read bytes will be written to.
     * @param startIndex The index in the {@link output} array to start writting the read bytes to.
     * Defaults to 0.
     * @param count The maximum number of bytes to read. Defaults to the length of the output array
     * minus the startIndex.
     */
    public abstract readBytes(output: Uint8Array, startIndex?: number, count?: number): AsyncResult<number>;
}