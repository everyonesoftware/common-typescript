import { depthFirstSearch } from "../sources/depthFirstSearch.js";
import { Node } from "../sources/node.js";
import { Iterator } from "../sources/iterator.js";
import { PreConditionError } from "../sources/preConditionError.js";
import { Test } from "./test.js";
import { TestRunner } from "./testRunner.js";
import { List } from "../sources/list.js";
import { SearchControl } from "../sources/searchControl.js";

export function test(runner: TestRunner): void
{
    runner.testFile("depthFirstSearch.ts", () =>
    {
        runner.testFunction("depthFirstSearch()", () =>
        {
            runner.test("with undefined initialToVisit", (test: Test) =>
            {
                test.assertThrows(() => depthFirstSearch(undefined!, () => {}), new PreConditionError(
                    "Expression: parameters",
                    "Expected:   not undefined and not null",
                    "Actual:     undefined",
                ));
            });

            runner.test("with null initialToVisit", (test: Test) =>
            {
                test.assertThrows(() => depthFirstSearch(null!, () => {}), new PreConditionError(
                    "Expression: parameters",
                    "Expected:   not undefined and not null",
                    "Actual:     null",
                ));
            });

            runner.test("with undefined searchAction", (test: Test) =>
            {
                test.assertThrows(() => depthFirstSearch([], undefined!), new PreConditionError(
                    "Expression: searchAction",
                    "Expected:   not undefined and not null",
                    "Actual:     undefined",
                ));
            });

            runner.test("with null searchAction", (test: Test) =>
            {
                test.assertThrows(() => depthFirstSearch([], null!), new PreConditionError(
                    "Expression: searchAction",
                    "Expected:   not undefined and not null",
                    "Actual:     null",
                ));
            });

            runner.test("with empty initialToVisit", (test: Test) =>
            {
                const iterator: Iterator<number> = depthFirstSearch([], (searchControl: SearchControl<Node<number>,number>, current: Node<number>) =>
                {
                    searchControl.addAllToVisit(current.iterateConnectedNodes());

                    const currentValue: number = current.getValue();
                    if (currentValue >= 7)
                    {
                        searchControl.addResult(currentValue);
                    }
                });
                test.assertEqual([], iterator.toArray().await());
            });

            runner.test("with non-empty initialToVisit with return values", (test: Test) =>
            {
                const nodes: List<Node<number>> = List.create();
                for (let i = 0; i < 10; i++)
                {
                    nodes.add(Node.create(i));
                }
                
                function connectNodes(index1: number, index2: number): void
                {
                    nodes.get(index1).await().addConnectedNode(nodes.get(index2).await());
                }
                connectNodes(0, 1);
                connectNodes(0, 2);
                connectNodes(1, 5);
                connectNodes(2, 4);
                connectNodes(3, 6);
                connectNodes(4, 5);
                connectNodes(4, 6);
                connectNodes(5, 9);
                connectNodes(6, 7);
                connectNodes(7, 3);
                connectNodes(8, 9);

                const iterator: Iterator<number> = depthFirstSearch([nodes.get(0).await()], (searchControl: SearchControl<Node<number>,number>, current: Node<number>) =>
                {
                    searchControl.addAllToVisit(current.iterateConnectedNodes());

                    const currentValue: number = current.getValue();
                    if (currentValue >= 7)
                    {
                        searchControl.addResult(currentValue);
                    }
                });

                test.assertEqual([7, 9], iterator.toArray().await());
            });
        });
    });
}