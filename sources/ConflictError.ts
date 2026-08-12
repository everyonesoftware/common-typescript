import { BaseError } from "./BaseError.js";

/**
 * An error that occurs because a conflict occurred, such as an entity already existing.
 */
export class ConflictError extends BaseError
{
}