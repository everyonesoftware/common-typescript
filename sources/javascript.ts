/**
 * The built-in {@link Array} type.
 * 
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array
 */
export type JavascriptArray<T> = Array<T>;

/**
 * The built-in {@link Iterator} type.
 * 
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators#iterators
 */
export type JavascriptIterator<T> = Iterator<T>;

/**
 * The built-in {@link IteratorResult} type.
 */
export type JavascriptIteratorResult<T> = IteratorResult<T,T>;

/**
 * Get whether the provided {@link JavascriptIteratorResult} indicates the end of an iteration.
 * @param iteratorResult The {@link JavascriptIteratorResult} to check.
 */
export function isJavascriptIteratorResultDone(iteratorResult: JavascriptIteratorResult<unknown> | undefined): boolean
{
    return iteratorResult?.done !== false;
}

/**
 * The built-in {@link Iterable} type.
 * 
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators#iterables
 */
export type JavascriptIterable<T> = Iterable<T>;

/**
 * Get whether the provided value is an empty {@link JavascriptIterable}.
 * @param value The value to check.
 */
export function isJavascriptIterableEmpty(value: JavascriptIterable<unknown>): boolean
{
    const iterator: JavascriptIterator<unknown> = value[Symbol.iterator]();
    const nextResult: JavascriptIteratorResult<unknown> = iterator.next();
    return isJavascriptIteratorResultDone(nextResult);
}

/**
 * The built-in {@link Map} type.
 * 
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map
 */
export type JavascriptMap<TKey,TValue> = Map<TKey,TValue>;
/**
 * The built-in {@link Map} type.
 * 
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map
 */
export const JavascriptMap = Map;

/**
 * The built-in {@link AsyncIterator} type.
 * 
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/AsyncIterator
 */
export type JavascriptAsyncIterator<T> = AsyncIterator<T>;

export interface JavascriptAsyncIterable<T>
{
    [Symbol.asyncIterator](): JavascriptAsyncIterator<T>;
}

/**
 * The built-in {@link Set} type.
 * 
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set
 */
export type JavascriptSet<T> = Set<T>;
export const JavascriptSet = Set;