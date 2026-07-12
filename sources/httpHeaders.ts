import { EqualFunctions } from "./equalFunctions.js";
import { HttpHeader } from "./httpHeader.js";
import { Iterable } from "./iterable.js";
import { Iterator } from "./iterator.js";
import { JavascriptIterable, JavascriptIterator } from "./javascript.js";
import { MutableHttpHeaders } from "./mutableHttpHeaders.js";
import { NotFoundError } from "./notFoundError.js";
import { AsyncResult } from "./asyncResult.js";
import { SyncResult } from "./syncResult.js";
import { ToStringFunctions } from "./toStringFunctions.js";
import { Type } from "./types.js";

/**
 * A collection of {@link HttpHeader}s.
 */
export abstract class HttpHeaders implements Iterable<HttpHeader>
{
    public static readonly contentTypeHeaderName: string = "Content-Type";

    public static create(headers?: JavascriptIterable<HttpHeader>): MutableHttpHeaders
    {
        return MutableHttpHeaders.create(headers);
    }

    /**
     * Get the header with the provided name.
     * @param headerName The name of the header.
     */
    public abstract get(headerName: string): SyncResult<HttpHeader>;

    /**
     * Get the value of the header with the provided name.
     * @param headerName The name of the header.
     */
    public abstract getValue(headerName: string): SyncResult<string>;

    public getContentType(): AsyncResult<HttpHeader>
    {
        return HttpHeaders.getContentType(this);
    }

    public static getContentType(headers: HttpHeaders): AsyncResult<HttpHeader>
    {
        return headers.get(HttpHeaders.contentTypeHeaderName);
    }

    public getContentTypeValue(): AsyncResult<string>
    {
        return HttpHeaders.getContentTypeValue(this);
    }

    public static getContentTypeValue(headers: HttpHeaders): AsyncResult<string>
    {
        return headers.getValue(HttpHeaders.contentTypeHeaderName);
    }

    /**
     * Get an {@link Iterator} that can be used to iterate through the {@link HttpHeader}s in this
     * collection.
     */
    public abstract iterate(): Iterator<HttpHeader>;

    /**
     * Get the {@link HttpHeader}s in this {@link HttpHeaders} object as an array.
     */
    public toArray(): SyncResult<HttpHeader[]>
    {
        return HttpHeaders.toArray(this);
    }

    public static toArray(headers: HttpHeaders): SyncResult<HttpHeader[]>
    {
        return Iterable.toArray(headers);
    }

    public any(): SyncResult<boolean>
    {
        return HttpHeaders.any(this);
    }

    public static any(headers: HttpHeaders): SyncResult<boolean>
    {
        return Iterable.any(headers);
    }

    public getCount(): SyncResult<number>
    {
        return HttpHeaders.getCount(this);
    }

    public static getCount(headers: HttpHeaders): SyncResult<number>
    {
        return Iterable.getCount(headers);
    }

    public equals(right: JavascriptIterable<HttpHeader>, equalFunctions?: EqualFunctions): SyncResult<boolean>
    {
        return HttpHeaders.equals(this, right, equalFunctions);
    }

    public static equals(headers: HttpHeaders, right: JavascriptIterable<HttpHeader>, equalFunctions?: EqualFunctions): SyncResult<boolean>
    {
        return Iterable.equals(headers, right, equalFunctions);
    }

    public toString(toStringFunctions?: ToStringFunctions): string
    {
        return HttpHeaders.toString(this, toStringFunctions);
    }

    public static toString(headers: HttpHeaders, toStringFunctions?: ToStringFunctions): string
    {
        return Iterable.toString(headers, toStringFunctions);
    }

    public concatenate(...toConcatenate: JavascriptIterable<HttpHeader>[]): Iterable<HttpHeader>
    {
        return HttpHeaders.concatenate(this, ...toConcatenate);
    }

    public static concatenate(headers: HttpHeaders, ...toConcatenate: JavascriptIterable<HttpHeader>[]): Iterable<HttpHeader>
    {
        return Iterable.concatenate(headers, ...toConcatenate);
    }

    public map<TOutput>(mapping: (value: HttpHeader) => (TOutput | SyncResult<TOutput>)): Iterable<TOutput>
    {
        return HttpHeaders.map(this, mapping);
    }

    public static map<TOutput>(headers: HttpHeaders, mapping: (value: HttpHeader) => (TOutput | SyncResult<TOutput>)): Iterable<TOutput>
    {
        return Iterable.map(headers, mapping);
    }

    public flatMap<TOutput>(mapping: (value: HttpHeader) => JavascriptIterable<TOutput>): Iterable<TOutput>
    {
        return HttpHeaders.flatMap(this, mapping);
    }

    public static flatMap<TOutput>(headers: HttpHeaders, mapping: (value: HttpHeader) => JavascriptIterable<TOutput>): Iterable<TOutput>
    {
        return Iterable.flatMap(headers, mapping);
    }

    public where(condition: (value: HttpHeader) => boolean): Iterable<HttpHeader>
    {
        return HttpHeaders.where(this, condition);
    }

    public static where(headers: HttpHeaders, condition: (value: HttpHeader) => (boolean | SyncResult<boolean>)): Iterable<HttpHeader>
    {
        return Iterable.where(headers, condition);
    }

    public instanceOf<TOutput extends HttpHeader>(typeOrTypeCheck: Type<TOutput> | ((value: HttpHeader) => value is TOutput)): Iterable<TOutput>
    {
        return HttpHeaders.instanceOf(this, typeOrTypeCheck);
    }

    public static instanceOf<TOutput extends HttpHeader>(headers: HttpHeaders, typeOrTypeCheck: Type<TOutput> | ((value: HttpHeader) => value is TOutput)): Iterable<TOutput>
    {
        return Iterable.instanceOf(headers, typeOrTypeCheck);
    }

    public first(condition?: (value: HttpHeader) => (boolean | SyncResult<boolean>)): SyncResult<HttpHeader>
    {
        return HttpHeaders.first(this, condition);
    }

    public static first(headers: HttpHeaders, condition?: (value: HttpHeader) => (boolean | SyncResult<boolean>)): SyncResult<HttpHeader>
    {
        return Iterable.first(headers, condition);
    }

    public last(condition?: (value: HttpHeader) => (boolean | SyncResult<boolean>)): SyncResult<HttpHeader>
    {
        return HttpHeaders.last(this, condition);
    }

    public static last(headers: HttpHeaders, condition?: (value: HttpHeader) => (boolean | SyncResult<boolean>)): SyncResult<HttpHeader>
    {
        return Iterable.last(headers, condition);
    }

    public [Symbol.iterator](): JavascriptIterator<HttpHeader>
    {
        return HttpHeaders[Symbol.iterator](this);
    }

    public static [Symbol.iterator](headers: HttpHeaders): JavascriptIterator<HttpHeader>
    {
        return Iterable[Symbol.iterator](headers);
    }

    public contains(value: HttpHeader, equalFunctions?: EqualFunctions): SyncResult<boolean>
    {
        return HttpHeaders.contains(this, value, equalFunctions);
    }

    public static contains(headers: HttpHeaders, value: HttpHeader, equalFunctions?: EqualFunctions): SyncResult<boolean>
    {
        return SyncResult.create(() =>
        {
            if (!equalFunctions)
            {
                equalFunctions = EqualFunctions.create();
            }

            return headers.getValue(value.getName())
                .then((headerValue: string) => equalFunctions!.areEqual(headerValue, value.getValue()).await())
                .catch(NotFoundError, () => false)
                .await();
        });
    }
}