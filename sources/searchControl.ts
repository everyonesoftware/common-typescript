import { JavascriptIterable } from "./javascript.js";

/**
 * An object that can be used to implement a search algorithm.
 */
export abstract class SearchControl<TVisit,TResult>
{
    /**
     * Add the provided value to the to-visit list.
     * @param value The value to add to the to-visit list.
     */
    public abstract addToVisit(value: TVisit): void;

    /**
     * Add the provided values to the to-visit list.
     * @param values The values to add to the to-visit list.
     */
    public abstract addAllToVisit(values: JavascriptIterable<TVisit>): void;

    /**
     * Get whether the provided value has already been visited.
     * @param value The value to check.
     */
    public abstract hasVisited(value: TVisit): boolean;

    /**
     * Add the provided value to the list of values to be returned.
     * @param value The value to add.
     */
    public abstract addResult(value: TResult): void;

    /**
     * Add the provided values to the list of values to be returned.
     * @param values The values to add.
     */
    public abstract addResults(values: JavascriptIterable<TResult>): void;

    /**
     * Immediately stop the search.
     */
    public abstract break(): never;
}