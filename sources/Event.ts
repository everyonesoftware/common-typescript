import { List } from "./list.js";
import { PreCondition } from "./preCondition.js";
import { SyncDisposable } from "./SyncDisposable.js";

/**
 * An object that can have subscriber functions added and then have those functions invoked when the
 * {@link Event} is triggered.
 */
export class Event<TArgs extends unknown[]>
{
    private readonly subscriptions: List<(...args: TArgs) => unknown>;

    private constructor()
    {
        this.subscriptions = List.create();
    }

    /**
     * Create a new {@link Event} object.
     */
    public static create<TArgs extends unknown[]>(): Event<TArgs>
    {
        return new Event<TArgs>();
    }

    /**
     * Add the provided subscription function to this {@link Event}'s list of functions to be run
     * when this {@link Event} is run.
     * @param subscription The subscription function to add.
     * @returns A {@link SyncDisposable} that can be disposed to remove the subscription from this
     * {@link Event}.
     */
    public subscribe(subscription: (...args: TArgs) => unknown): SyncDisposable
    {
        PreCondition.assertNotUndefinedAndNotNull(subscription, "subscription");

        this.subscriptions.add(subscription);

        return SyncDisposable.create(() => this.subscriptions.remove(subscription).await());
    }

    /**
     * Run the subscription functions that have been subscribed to this {@link Event}.
     * @param args The arguments that will be passed to each of the subscription functions.
     */
    public run(...args: TArgs): void
    {
        for (const subscription of this.subscriptions)
        {
            subscription(...args);
        }
    }
}