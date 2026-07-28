/**
 * The different data types in a JSON file.
 */
export type JSONData = string | number | boolean | null | { [propertyName: string]: JSONData } | JSONData[];