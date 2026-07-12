import { EqualFunctions } from "./equalFunctions.js";
import { HttpHeader } from "./httpHeader.js";
import { HttpHeaders } from "./httpHeaders.js";
import { Iterable } from "./iterable.js";
import { Iterator } from "./iterator.js";
import { JavascriptIterable, JavascriptIterator } from "./javascript.js";
import { List } from "./list.js";
import { NotFoundError } from "./notFoundError.js";
import { PreCondition } from "./preCondition.js";
import { escapeAndQuote } from "./strings.js";
import { SyncResult } from "./syncResult.js";
import { ToStringFunctions } from "./toStringFunctions.js";
import { isString, Type } from "./types.js";

export class MutableHttpHeaders implements HttpHeaders
{
    private readonly headers: List<HttpHeader>;

    private constructor(headers?: JavascriptIterable<HttpHeader>)
    {
        this.headers = List.create();
        if (headers)
        {
            this.setAll(headers);
        }
    }

    public static create(headers?: JavascriptIterable<HttpHeader>): MutableHttpHeaders
    {
        return new MutableHttpHeaders(headers);
    }

    public iterate(): Iterator<HttpHeader>
    {
        return this.headers.iterate();
    }

    public get(headerName: string): SyncResult<HttpHeader>
    {
        PreCondition.assertNotEmpty(headerName, "headerName");

        return SyncResult.create(() =>
        {
            let result: HttpHeader | undefined;

            const lowerHeaderName: string = headerName.toLowerCase();
            for (const header of this.headers)
            {
                if (header.getName().toLowerCase() === lowerHeaderName)
                {
                    result = header
                    break;
                }
            }
            if (result === undefined)
            {
                throw new NotFoundError(`No HttpHeader found with the name ${escapeAndQuote(headerName)}.`);
            }

            return result;
        });
    }

    public getValue(headerName: string): SyncResult<string>
    {
        return this.get(headerName)
            .then((header: HttpHeader) => header.getValue());
    }

    /**
     * Set a {@link HttpHeader} value in this collection. This will overwrite any existing 
     * {@link HttpHeader} with the same name.
     * @param headerName The name of the header to set.
     * @param headerValue The value of the header to set.
     */
    public set(headerName: string, headerValue: string): this;
    public set(header: HttpHeader): this;
    set(headerOrHeaderName: HttpHeader | string, headerValue?: string): this
    {
        let headerName: string;
        if (isString(headerOrHeaderName))
        {
            headerName = headerOrHeaderName;
        }
        else
        {
            headerName = headerOrHeaderName.getName();
            headerValue = headerOrHeaderName.getValue();
        }
        PreCondition.assertNotEmpty(headerName, "headerName");
        PreCondition.assertNotUndefinedAndNotNull(headerValue, "headerValue");

        let insertIndex: number = 0;
        for (let insertIndex = 0; insertIndex < this.headers.getCount().await(); insertIndex++)
        {
            const header: HttpHeader = this.headers.get(insertIndex).await();
            if (header.getName() === headerName)
            {
                this.headers.removeAt(insertIndex);
                break;
            }
        }
        this.headers.insert(insertIndex, HttpHeader.create(headerName, headerValue));

        return this;
    }

    public setAll(headers: JavascriptIterable<HttpHeader>): this
    {
        PreCondition.assertNotUndefinedAndNotNull(headers, "headers");

        for (const header of headers)
        {
            this.set(header);
        }

        return this;
    }

    public setContentType(contentType: string): this
    {
        return this.set(HttpHeaders.contentTypeHeaderName, contentType);
    }

    public getContentType(): SyncResult<HttpHeader>
    {
        return this.get(HttpHeaders.contentTypeHeaderName);
    }

    public getContentTypeValue(): SyncResult<string>
    {
        return this.getValue(HttpHeaders.contentTypeHeaderName);
    }

    public getCount(): SyncResult<number>
    {
        return this.headers.getCount();
    }

    public toArray(): SyncResult<HttpHeader[]>
    {
        return HttpHeaders.toArray(this);
    }

    public any(): SyncResult<boolean>
    {
        return HttpHeaders.any(this);
    }

    public equals(right: JavascriptIterable<HttpHeader>, equalFunctions?: EqualFunctions): SyncResult<boolean>
    {
        return HttpHeaders.equals(this, right, equalFunctions);
    }

    public toString(toStringFunctions?: ToStringFunctions): string
    {
        return HttpHeaders.toString(this, toStringFunctions);
    }

    public concatenate(...toConcatenate: JavascriptIterable<HttpHeader>[]): Iterable<HttpHeader>
    {
        return HttpHeaders.concatenate(this, ...toConcatenate);
    }

    public map<TOutput>(mapping: (value: HttpHeader) => (TOutput | SyncResult<TOutput>)): Iterable<TOutput>
    {
        return HttpHeaders.map(this, mapping);
    }

    public flatMap<TOutput>(mapping: (value: HttpHeader) => JavascriptIterable<TOutput>): Iterable<TOutput>
    {
        return HttpHeaders.flatMap(this, mapping);
    }

    public where(condition: (value: HttpHeader) => (boolean | SyncResult<boolean>)): Iterable<HttpHeader>
    {
        return HttpHeaders.where(this, condition);
    }

    public instanceOf<TOutput extends HttpHeader>(typeOrTypeCheck: Type<TOutput> | ((value: HttpHeader) => value is TOutput)): Iterable<TOutput>
    {
        return HttpHeaders.instanceOf(this, typeOrTypeCheck);
    }

    public first(condition?: (value: HttpHeader) => (boolean | SyncResult<boolean>)): SyncResult<HttpHeader>
    {
        return HttpHeaders.first(this, condition);
    }

    public last(condition?: (value: HttpHeader) => (boolean | SyncResult<boolean>)): SyncResult<HttpHeader>
    {
        return HttpHeaders.last(this, condition);
    }

    public [Symbol.iterator](): JavascriptIterator<HttpHeader>
    {
        return HttpHeaders[Symbol.iterator](this);
    }

    public contains(value: HttpHeader, equalFunctions?: EqualFunctions): SyncResult<boolean>
    {
        return HttpHeaders.contains(this, value, equalFunctions);
    }
}