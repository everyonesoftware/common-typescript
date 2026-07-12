import { Iterator } from "./iterator.js";
import { PreCondition } from "./preCondition.js";
import { Set } from "./set.js";

export class Node<T>
{
    private readonly value: T;
    private connectedNodes: Set<Node<T>>;

    private constructor(value: T)
    {
        this.value = value;
        this.connectedNodes = Set.create();
    }

    public static create<T>(value: T): Node<T>
    {
        return new Node<T>(value);
    }

    public getValue(): T
    {
        return this.value;
    }

    public iterateConnectedNodes(): Iterator<Node<T>>
    {
        return this.connectedNodes.iterate();
    }

    public addConnectedNode(node: Node<T>): void
    {
        PreCondition.assertNotUndefinedAndNotNull(node, "node");

        this.connectedNodes.add(node);
    }
}