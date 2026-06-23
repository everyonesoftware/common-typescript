import { Iterable } from "./iterable";
import { Iterator } from "./iterator";
import { JavascriptAsyncIterable, JavascriptAsyncIterator, JavascriptIterable, JavascriptIterator } from "./javascript";

/**
 * A {@link Type} that can be used to pass types as parameters.
 */
export type Type<T> = Function & { prototype: T };

/**
 * Get whether the provided value is an instance of {@link Type} {@link T}.
 * @param typeOrTypeCheck The {@link Type} to look for or type check {@link Function} to determine
 * if the provided value is a {@link T}.
 * @param value The value to check.
 */
export function instanceOf<T>(value: unknown, typeCheck: (value: unknown) => value is T): value is T;
/**
 * Get whether the provided value is an instance of {@link Type} {@link T}.
 * @param typeOrTypeCheck The {@link Type} to look for or type check {@link Function} to determine
 * if the provided value is a {@link T}.
 * @param value The value to check.
 */
export function instanceOf<T>(value: unknown, type: Type<T>, typeCheck?: (value: unknown) => value is T): value is T;
export function instanceOf<T>(value: unknown, typeOrTypeCheck: Type<T> | ((value: unknown) => value is T), typeCheck?: (value: unknown) => value is T): value is T
{
    let result: boolean;
    if (!isUndefinedOrNull(typeCheck))
    {
        result = typeCheck(value);
    }
    else if (value instanceof typeOrTypeCheck)
    {
        result = true;
    }
    else if (isFunctionWithParameterCount(typeOrTypeCheck, 1))
    {
        typeCheck = typeOrTypeCheck as ((value: unknown) => value is T);
        result = typeCheck(value);
    }
    else
    {
        result = false;
    }
    return result;
}

/**
 * Get whether the provided value is an instance of the provided {@link Type}. This will return
 * false if value only implements the provided {@link Type} but doesn't extend it.
 * @param value The value to check.
 * @param type The {@link Type} to see if value is an instance of.
 */
export function instanceOfType<T>(value: unknown, type: Type<T>): value is T
{
    return value instanceof type;
}

/**
 * If the provided {@link value} is of type {@link T} (according to the provided {@link typeCheck}),
 * then return the {@link value}. Otherwise return undefined.
 * @param value The value to check.
 * @param typeOrTypeCheck The {@link Type} to look for or type check {@link Function} to determine
 * if the provided value is a {@link T}.
 */
export function as<T>(value: unknown, typeOrTypeCheck: Type<T> | ((value: unknown) => value is T)): T | undefined
{
    return instanceOf(value, typeOrTypeCheck) ? value as T : undefined;
}

/**
 * Get whether the provided value is undefined.
 * @param value The value to check.
 */
export function isUndefined(value: unknown): value is undefined
{
    return value === undefined;
}

/**
 * Get whether the provided value is null.
 * @param value The value to check.
 */
export function isNull(value: unknown): value is null
{
    return value === null;
}

/**
 * Return the provided value if it is null, otherwise return undefined.
 * @param value The value to check.
 */
export function asNull(value: unknown): null | undefined
{
    return as(value, isNull);
}

/**
 * Get whether the provided value is undefined or null.
 * @param value The value to check.
 */
export function isUndefinedOrNull(value: unknown): value is undefined | null
{
    return isUndefined(value) || isNull(value);
}

/**
 * Get whether the provided value is a {@link boolean}.
 * @param value The value to check.
 */
export function isBoolean(value: unknown): value is boolean
{
    return typeof value === "boolean";
}

/**
 * Return the provided value if it is a boolean, otherwise return undefined.
 * @param value The value to check.
 */
export function asBoolean(value: unknown): boolean | undefined
{
    return as(value, isBoolean);
}

/**
 * Get whether the provided value is a {@link number}.
 * @param value The value to check.
 */
export function isNumber(value: unknown): value is number
{
    return typeof value === "number";
}

/**
 * Return the provided value if it is a number, otherwise return undefined.
 * @param value The value to check.
 */
export function asNumber(value: unknown): number | undefined
{
    return as(value, isNumber);
}

/**
 * Get whether the provided value is a {@link string}.
 * @param value The value to check.
 */
export function isString(value: unknown): value is string
{
    return typeof value === "string";
}

/**
 * Return the provided value if it is a string, otherwise return undefined.
 * @param value The value to check.
 */
export function asString(value: unknown): string | undefined
{
    return as(value, isString);
}

/**
 * Get whether the provided value is a {@link function}.
 * @param value The value to check.
 */
export function isFunction(value: unknown): value is Function
{
    return typeof value === "function";
}

/**
 * Return the provided value if it is a function, otherwise return undefined.
 * @param value The value to check.
 */
export function asFunction(value: unknown): Function | undefined
{
    return as(value, isFunction);
}

/**
 * Get the number of parameters that the provided {@link Function} takes.
 * @param value The {@link Function} to get the parameter count for.
 */
export function getParameterCount(value: Function): number
{
    return value.length;
}

/**
 * Get whether the provided value is a function with the provided parameter count.
 * @param value The value to check.
 * @param parameterCount The number of parameters the function must have.
 */
export function isFunctionWithParameterCount(value: unknown, parameterCount: number): value is Function
{
    return isFunction(value) && getParameterCount(value) === parameterCount;
}

/**
 * Return the provided value if it is a function with the provided {@link parameterCount}, otherwise
 * return undefined.
 * @param value The value to check.
 */
export function asFunctionWithParameterCount(value: unknown, parameterCount: number): Function | undefined
{
    return as(value, (v: unknown) => isFunctionWithParameterCount(v, parameterCount));
}

/**
 * Get whether the provided value is an {@link Array}.
 * @param value The value to check.
 */
export function isArray(value: unknown): value is unknown[]
{
    return Array.isArray(value);
}

/**
 * Return the provided value if it is an array, otherwise return undefined.
 * @param value The value to check.
 */
export function asArray(value: unknown): unknown[] | undefined
{
    return as(value, isArray);
}

/**
 * Get whether the provided value is an {@link Object} or is null.
 * @param value The value to check.
 */
export function isObjectOrArrayOrNull(value: unknown): value is {} | unknown[] | null
{
    return typeof value === "object";
}

/**
 * Return the provided value if it is an array, otherwise return undefined.
 * @param value The value to check.
 */
export function asObjectOrArrayOrNull(value: unknown): {} | unknown[] | null | undefined
{
    return as(value, isObjectOrArrayOrNull);
}

/**
 * Get whether the provided value is an {@link Object}.
 * @param value The value to check.
 * @returns 
 */
export function isObject(value: unknown): value is {}
{
    return isObjectOrArrayOrNull(value) && !!value && !isArray(value);
}

/**
 * Return the provided value if it is an {@link Object}, otherwise return undefined.
 * @param value The value to check.
 */
export function asObject(value: unknown): {} | undefined
{
    return as(value, isObject);
}

/**
 * Get an {@link Iterator} that can be used to iterate through the properties of the provided value.
 * @param value The value to iterate over.
 */
export function getPropertyNames(value: {}): Iterable<string>
{
    return Iterable.create(Object.keys(value));
}

/**
 * Get whether the provided value has a property with the provided key.
 * @param value The value to check.
 * @param propertyKey The key of the property to look for.
 */
export function hasProperty<TValue, TPropertyKey extends PropertyKey>(value: TValue, propertyKey: TPropertyKey): value is TValue & Record<TPropertyKey, unknown>
{
    return value !== undefined && value !== null && (value as any)[propertyKey] !== undefined;
}

/**
 * Get whether the value has a function with the provided name.
 * @param value The value to check.
 * @param functionName The name of the function to look for.
 */
export function hasFunction<TValue, TPropertyKey extends PropertyKey>(value: TValue, functionName: TPropertyKey, parameterCount?: number): value is TValue & Record<TPropertyKey,Function>
{
    let result: boolean = false;
    if (value !== undefined && value !== null)
    {
        const func: unknown = (value as any)[functionName];
        if (isUndefinedOrNull(parameterCount))
        {
            result = isFunction(func);
        }
        else
        {
            result = isFunctionWithParameterCount(func, parameterCount);
        }
    }
    return result;
}

/**
 * Get whether the provided value is a {@link JavascriptIterator}.
 * @param value The value to check.
 */
export function isJavascriptIterator<T>(value: unknown): value is JavascriptIterator<T>
{
    return hasFunction(value, "next");
}

/**
 * Get whether the provided value is a {@link JavascriptIterable}.
 * @param value The value to check.
 */
export function isJavascriptIterable<T>(value: unknown): value is JavascriptIterable<T>
{
    return hasFunction(value, Symbol.iterator);
}

export function isIterator<T>(value: unknown): value is Iterator<T>
{
    return isJavascriptIterable(value) &&
        hasFunction(value, "next", 0) &&
        hasFunction(value, "hasCurrent", 0);
}

export function isIterable<T>(value: unknown): value is Iterable<T>
{
    return isJavascriptIterable(value) &&
        hasFunction(value, "iterate", 0);
}

/**
 * Get whether the provided value is a {@link JavascriptAsyncIterator}.
 * @param value The value to check.
 */
export function isJavascriptAsyncIterator<T>(value: unknown): value is JavascriptAsyncIterator<T>
{
    return hasFunction(value, "next");
}

/**
 * Get whether the provided value is a {@link JavascriptAsyncIterable}.
 * @param value The value to check.
 */
export function isJavascriptAsyncIterable<T>(value: unknown): value is JavascriptAsyncIterable<T>
{
    return hasFunction(value, Symbol.asyncIterator);
}

export function isAsyncIterable<T>(value: unknown): value is AsyncIterable<T>
{
    return isJavascriptAsyncIterable(value) &&
        hasFunction(value, "iterate", 0);
}

/**
 * Get the name of the provided {@link Type}.
 * @param type The {@link Type} to get the name of.
 */
export function getName(type: Type<unknown>): string
{
    return type.name;
}

export function isPromiseLike<T>(value: unknown): value is PromiseLike<T>
{
    return hasFunction(value, "then", 2);
}

export function isPromise<T>(value: unknown): value is Promise<T>
{
    return isPromiseLike<T>(value) &&
        hasFunction(value, "catch", 1) &&
        hasFunction(value, "finally", 1);
}