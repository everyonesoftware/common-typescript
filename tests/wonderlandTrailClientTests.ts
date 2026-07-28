import { PreConditionError } from "../sources/preConditionError.js";
import { isWonderlandTrailLocation, WonderlandTrailAvailability, WonderlandTrailAvailabilityType, WonderlandTrailClient, WonderlandTrailConnection, WonderlandTrailDirection, WonderlandTrailLocation, WonderlandTrailLocations, WonderlandTrailReservationType } from "../sources/wonderlandTrailClient.js";
import { Test } from "./test.js";
import { TestRunner } from "./testRunner.js";
import { Iterable } from "../sources/iterable.js";
import { DateTime } from "../sources/dateTime.js";
import { Map } from "../sources/map.js";
import { MutableMap } from "../sources/mutableMap.js";
import { NotFoundError } from "../sources/notFoundError.js";
import { HttpClient } from "../sources/httpClient.js";

export function test(runner: TestRunner): void
{
    runner.testFile("wonderlandTrailClient.ts", () =>
    {
        runner.testFunction("isWonderlandTrailLocation()", () =>
        {
            function isWonderlandTrailLocationTest(value: unknown, expected: boolean): void
            {
                runner.test(`with ${runner.toString(value)}`, (test: Test) =>
                {
                    test.assertEqual(isWonderlandTrailLocation(value), expected);
                });
            }

            isWonderlandTrailLocationTest(undefined, false);
            isWonderlandTrailLocationTest(null, false);
            isWonderlandTrailLocationTest(20, false);
            isWonderlandTrailLocationTest({}, false);
            isWonderlandTrailLocationTest(WonderlandTrailLocations.boxCanyon, true);
        });

        runner.testType("WonderlandTrailLocations", () =>
        {
            runner.testFunction("getLocations()", (test: Test) =>
            {
                const locations: Iterable<WonderlandTrailLocation> = WonderlandTrailLocations.getLocations();
                test.assertNotUndefinedAndNotNull(locations);
                test.assertEqual(locations.getCount().await(), 27);
            });

            runner.testFunction("getTrailheads()", (test: Test) =>
            {
                const trailheads: Iterable<WonderlandTrailLocation> = WonderlandTrailLocations.getTrailheads();
                test.assertEqual(6, trailheads.getCount().await());
                test.assertEqual(
                    [
                        WonderlandTrailLocations.sunriseVisitorCenter.name,
                        WonderlandTrailLocations.whiteRiver.name,
                        WonderlandTrailLocations.fryingPanCreek.name,
                        WonderlandTrailLocations.boxCanyon.name,
                        WonderlandTrailLocations.reflectionLakes.name,
                        WonderlandTrailLocations.longmire.name,
                    ],
                    trailheads.map(t => t.name).toArray().await(),
                );
            });
        });

        runner.testType("WonderlandTrailAvailability", () =>
        {
            runner.testFunction("addAvailability()", () =>
            {
                runner.test("with undefined location", (test: Test) =>
                {
                    const availability: WonderlandTrailAvailability = WonderlandTrailAvailability.create();
                    test.assertThrows(() => availability.addAvailability(undefined!, DateTime.parse("2026-03-11").await()), new PreConditionError(
                        "Expression: location",
                        "Expected: not undefined and not null",
                        "Actual: undefined",
                    ));
                });

                runner.test("with null location", (test: Test) =>
                {
                    const availability: WonderlandTrailAvailability = WonderlandTrailAvailability.create();
                    test.assertThrows(() => availability.addAvailability(null!, DateTime.parse("2026-03-11").await()), new PreConditionError(
                        "Expression: location",
                        "Expected: not undefined and not null",
                        "Actual: null",
                    ));
                });

                runner.test("with undefined date", (test: Test) =>
                {
                    const availability: WonderlandTrailAvailability = WonderlandTrailAvailability.create();
                    test.assertThrows(() => availability.addAvailability(WonderlandTrailLocations.boxCanyon, undefined!), new PreConditionError(
                        "Expression: date",
                        "Expected: not undefined and not null",
                        "Actual: undefined",
                    ));
                });

                runner.test("with null date", (test: Test) =>
                {
                    const availability: WonderlandTrailAvailability = WonderlandTrailAvailability.create();
                    test.assertThrows(() => availability.addAvailability(WonderlandTrailLocations.boxCanyon, null!), new PreConditionError(
                        "Expression: date",
                        "Expected: not undefined and not null",
                        "Actual: null",
                    ));
                });

                runner.test("with neither individual nor group site data", (test: Test) =>
                {
                    const availability: WonderlandTrailAvailability = WonderlandTrailAvailability.create();

                    const location: WonderlandTrailLocation = WonderlandTrailLocations.boxCanyon;
                    const date: DateTime = DateTime.parse("2025-07-04").await();
                    test.assertEqual(Map.create(), availability.getAvailability(location))

                    availability.addAvailability(location, date);

                    const expected: MutableMap<string, WonderlandTrailAvailabilityType> = Map.create();
                    expected.set(date.toDateString(), { groupSite: undefined, individualSite: undefined });
                    test.assertEqual(expected, availability.getAvailability(location));
                });

                runner.test("with individual site data", (test: Test) =>
                {
                    const availability: WonderlandTrailAvailability = WonderlandTrailAvailability.create();

                    const location: WonderlandTrailLocation = WonderlandTrailLocations.boxCanyon;
                    const date: DateTime = DateTime.parse("2025-07-04").await();
                    test.assertEqual(Map.create(), availability.getAvailability(location))

                    availability.addAvailability(location, date, WonderlandTrailReservationType.Walkup);

                    const expected: MutableMap<string, WonderlandTrailAvailabilityType> = Map.create();
                    expected.set(date.toDateString(), { groupSite: undefined, individualSite: WonderlandTrailReservationType.Walkup });
                    test.assertEqual(expected, availability.getAvailability(location));
                });

                runner.test("with group site data", (test: Test) =>
                {
                    const availability: WonderlandTrailAvailability = WonderlandTrailAvailability.create();

                    const location: WonderlandTrailLocation = WonderlandTrailLocations.boxCanyon;
                    const date: DateTime = DateTime.parse("2025-07-04").await();
                    test.assertEqual(Map.create(), availability.getAvailability(location))

                    availability.addAvailability(location, date, undefined, WonderlandTrailReservationType.Reserved);

                    const expected: MutableMap<string, WonderlandTrailAvailabilityType> = Map.create();
                    expected.set(date.toDateString(), { groupSite: WonderlandTrailReservationType.Reserved, individualSite: undefined });
                    test.assertEqual(expected, availability.getAvailability(location));
                });
            });

            runner.testFunction("getAvailability()", () =>
            {
                function getAvailabilityErrorTest(location: WonderlandTrailLocation, expected: Error): void
                {
                    runner.test(`with ${runner.toString(location)}`, (test: Test) =>
                    {
                        const availability: WonderlandTrailAvailability = WonderlandTrailAvailability.create();
                        test.assertThrows(() => availability.getAvailability(location), expected);
                    });
                }

                getAvailabilityErrorTest(undefined!, new PreConditionError(
                    "Expression: location",
                    "Expected: not undefined and not null",
                    "Actual: undefined",
                ));
                getAvailabilityErrorTest(null!, new PreConditionError(
                    "Expression: location",
                    "Expected: not undefined and not null",
                    "Actual: null",
                ));

                runner.test("when location isn't found", (test: Test) =>
                {
                    const availability: WonderlandTrailAvailability = WonderlandTrailAvailability.create();
                    const location: WonderlandTrailLocation = WonderlandTrailLocations.boxCanyon;
                    const locationAvailability: MutableMap<string, WonderlandTrailAvailabilityType> = availability.getAvailability(location);
                    test.assertNotUndefinedAndNotNull(locationAvailability);
                    test.assertFalse(locationAvailability.any().await());
                    test.assertSame(locationAvailability, availability.getAvailability(location));
                });

                runner.test("when location is found", (test: Test) =>
                {
                    const availability: WonderlandTrailAvailability = WonderlandTrailAvailability.create();

                    const location: WonderlandTrailLocation = WonderlandTrailLocations.boxCanyon;
                    const date: DateTime = DateTime.parse("2025-07-04").await();
                    availability.addAvailability(location, date, WonderlandTrailReservationType.Reserved, WonderlandTrailReservationType.Walkup);

                    const locationAvailability: MutableMap<string, WonderlandTrailAvailabilityType> = availability.getAvailability(location);
                    const expected: MutableMap<string, WonderlandTrailAvailabilityType> = Map.create();
                    expected.set(date.toDateString(), {
                        groupSite: WonderlandTrailReservationType.Walkup,
                        individualSite: WonderlandTrailReservationType.Reserved,
                    });
                    test.assertEqual(locationAvailability, expected);
                    test.assertSame(locationAvailability, availability.getAvailability(location));
                });
            });

            runner.testFunction("getDayAvailability()", () =>
            {
                function getDayAvailabilityErrorTest(location: WonderlandTrailLocation, date: DateTime, expected: Error): void
                {
                    runner.test(`with ${runner.andList([location, date])}`, (test: Test) =>
                    {
                        const availability: WonderlandTrailAvailability = WonderlandTrailAvailability.create();
                        test.assertThrows(() => availability.getDayAvailability(location, date).await(), expected);
                    });
                }

                getDayAvailabilityErrorTest(undefined!, DateTime.parse("2025-07-04").await(), new PreConditionError(
                    "Expression: location",
                    "Expected: not undefined and not null",
                    "Actual: undefined",
                ));
                getDayAvailabilityErrorTest(null!, DateTime.parse("2025-07-04").await(), new PreConditionError(
                    "Expression: location",
                    "Expected: not undefined and not null",
                    "Actual: null",
                ));
                getDayAvailabilityErrorTest(WonderlandTrailLocations.boxCanyon, undefined!, new PreConditionError(
                    "Expression: date",
                    "Expected: not undefined and not null",
                    "Actual: undefined",
                ));
                getDayAvailabilityErrorTest(WonderlandTrailLocations.boxCanyon, null!, new PreConditionError(
                    "Expression: date",
                    "Expected: not undefined and not null",
                    "Actual: null",
                ));

                runner.test("with not found location or date", (test: Test) =>
                {
                    const availability: WonderlandTrailAvailability = WonderlandTrailAvailability.create();
                    const location: WonderlandTrailLocation = WonderlandTrailLocations.boxCanyon;
                    const date: DateTime = DateTime.parse("2025-07-04").await();

                    test.assertThrows(() => availability.getDayAvailability(location, date).await(), new NotFoundError(
                        "No availability was found for Box Canyon on 2025-07-04.",
                    ));
                });

                runner.test("when location and date are found", (test: Test) =>
                {
                    const availability: WonderlandTrailAvailability = WonderlandTrailAvailability.create();

                    const location: WonderlandTrailLocation = WonderlandTrailLocations.boxCanyon;
                    const date: DateTime = DateTime.parse("2025-07-04").await();
                    availability.addAvailability(location, date, WonderlandTrailReservationType.Reserved, WonderlandTrailReservationType.Walkup);

                    const dayAvailability: WonderlandTrailAvailabilityType = availability.getDayAvailability(location, date).await();
                    const expected: WonderlandTrailAvailabilityType = {
                        groupSite: WonderlandTrailReservationType.Walkup,
                        individualSite: WonderlandTrailReservationType.Reserved,
                    };
                    test.assertEqual(dayAvailability, expected);
                    test.assertSame(dayAvailability, availability.getDayAvailability(location, date).await());
                });
            });
        });

        runner.testType("WonderlandTrailDirection", () =>
        {
            runner.testFunction("toString()", (test: Test) =>
            {
                test.assertEqual("Clockwise", WonderlandTrailDirection.clockwise.toString());
                test.assertEqual("CounterClockwise", WonderlandTrailDirection.counterClockwise.toString());
            });

            runner.testFunction("reverse()", (test: Test) =>
            {
                test.assertSame(WonderlandTrailDirection.counterClockwise, WonderlandTrailDirection.clockwise.reverse());
                test.assertSame(WonderlandTrailDirection.clockwise, WonderlandTrailDirection.counterClockwise.reverse());
            });
        });

        runner.testType("WonderlandTrailConnection", () =>
        {
            runner.testFunction("create()", (test: Test) =>
            {
                const connection: WonderlandTrailConnection = WonderlandTrailConnection.create(
                    WonderlandTrailLocations.boxCanyon,
                    WonderlandTrailLocations.carbonRiver,
                    5000,
                    2000,
                    10,
                    WonderlandTrailDirection.clockwise,
                    Iterable.create([
                        WonderlandTrailLocations.cataractValley,
                        WonderlandTrailLocations.devilsDream,
                    ]),
                );
                test.assertNotUndefinedAndNotNull(connection);
                test.assertEqual(connection.startLocation, WonderlandTrailLocations.boxCanyon);
                test.assertEqual(connection.endLocation, WonderlandTrailLocations.carbonRiver);
                test.assertEqual(connection.distanceMiles, 5000);
                test.assertEqual(connection.ascentFeet, 2000);
                test.assertEqual(connection.descentFeet, 10);
                test.assertEqual(connection.direction, WonderlandTrailDirection.clockwise);
                test.assertEqual(connection.intermediateLocations, Iterable.create([
                    WonderlandTrailLocations.cataractValley,
                    WonderlandTrailLocations.devilsDream,
                ]));
            });

            runner.testFunction("getLocations()", () =>
            {
                runner.test("when connection is not a loop", (test: Test) =>
                {
                    const connection: WonderlandTrailConnection = WonderlandTrailConnection.create(
                        WonderlandTrailLocations.boxCanyon,
                        WonderlandTrailLocations.carbonRiver,
                        5000,
                        2000,
                        10,
                        WonderlandTrailDirection.clockwise,
                        Iterable.create([
                            WonderlandTrailLocations.cataractValley,
                            WonderlandTrailLocations.devilsDream,
                        ]),
                    );
                    test.assertEqual(connection.getLocations(), Iterable.create([
                        WonderlandTrailLocations.boxCanyon,
                        WonderlandTrailLocations.cataractValley,
                        WonderlandTrailLocations.devilsDream,
                        WonderlandTrailLocations.carbonRiver,
                    ]));
                });

                runner.test("when connection is a loop", (test: Test) =>
                {
                    const connection: WonderlandTrailConnection = WonderlandTrailConnection.create(
                        WonderlandTrailLocations.boxCanyon,
                        WonderlandTrailLocations.boxCanyon,
                        5000,
                        2000,
                        10,
                        WonderlandTrailDirection.clockwise,
                        Iterable.create([
                            WonderlandTrailLocations.cataractValley,
                            WonderlandTrailLocations.devilsDream,
                        ]),
                    );
                    test.assertEqual(connection.getLocations(), Iterable.create([
                        WonderlandTrailLocations.boxCanyon,
                        WonderlandTrailLocations.cataractValley,
                        WonderlandTrailLocations.devilsDream,
                    ]));
                });
            });

            runner.testFunction("reverseDirection()", (test: Test) =>
            {
                const connection: WonderlandTrailConnection = WonderlandTrailConnection.create(
                    WonderlandTrailLocations.boxCanyon,
                    WonderlandTrailLocations.carbonRiver,
                    5000,
                    2000,
                    10,
                    WonderlandTrailDirection.clockwise,
                    Iterable.create([
                        WonderlandTrailLocations.cataractValley,
                        WonderlandTrailLocations.devilsDream,
                    ]),
                );
                const reversedConnection: WonderlandTrailConnection = connection.reverseDirection();
                test.assertNotSame(connection, reversedConnection);
                test.assertEqual(reversedConnection.startLocation, WonderlandTrailLocations.carbonRiver);
                test.assertEqual(reversedConnection.endLocation, WonderlandTrailLocations.boxCanyon);
                test.assertEqual(reversedConnection.distanceMiles, 5000);
                test.assertEqual(reversedConnection.ascentFeet, 10);
                test.assertEqual(reversedConnection.descentFeet, 2000);
                test.assertEqual(reversedConnection.direction, WonderlandTrailDirection.counterClockwise);
                test.assertEqual(reversedConnection.intermediateLocations, Iterable.create([
                    WonderlandTrailLocations.cataractValley,
                    WonderlandTrailLocations.devilsDream,
                ]));
            });
        });

        runner.testType("WonderlandTrailClient", () =>
        {
            runner.testFunction("create()", () =>
            {
                runner.test("with undefined HttpClient", (test: Test) =>
                {
                    test.assertThrows(() => WonderlandTrailClient.create(undefined!), new PreConditionError(
                        "Expression: httpClient",
                        "Expected: not undefined and not null",
                        "Actual: undefined",
                    ));
                });

                runner.test("with null HttpClient", (test: Test) =>
                {
                    test.assertThrows(() => WonderlandTrailClient.create(null!), new PreConditionError(
                        "Expression: httpClient",
                        "Expected: not undefined and not null",
                        "Actual: null",
                    ));
                });

                runner.test("with defined HttpClient", (test: Test) =>
                {
                    const httpClient: HttpClient = HttpClient.create();
                    const client: WonderlandTrailClient = WonderlandTrailClient.create(httpClient);
                    test.assertNotUndefinedAndNotNull(client);
                });
            });

            runner.testFunction("getAvailability()", runner.skip(false, "Ignore slow running tests for now"), () =>
            {
                runner.test("with year in the past", async (test: Test) =>
                {
                    const httpClient: HttpClient = HttpClient.create();
                    const client: WonderlandTrailClient = WonderlandTrailClient.create(httpClient);

                    const availability: WonderlandTrailAvailability = await client.getAvailability(4, 2023, true, true, true);
                    test.assertNotUndefinedAndNotNull(availability);
                    test.assertFalse(availability.any());
                });

                runner.test("with month in the past", async (test: Test) =>
                {
                    const httpClient: HttpClient = HttpClient.create();
                    const client: WonderlandTrailClient = WonderlandTrailClient.create(httpClient);

                    const availability: WonderlandTrailAvailability = await client.getAvailability(3, 2026, true, true, true);
                    test.assertNotUndefinedAndNotNull(availability);
                    test.assertFalse(availability.any());
                });

                runner.test("with a future month in the current year", async (test: Test) =>
                {
                    const httpClient: HttpClient = HttpClient.create();
                    const client: WonderlandTrailClient = WonderlandTrailClient.create(httpClient);

                    const availability: WonderlandTrailAvailability = await client.getAvailability({
                        month: 7,
                        year: 2026,
                        allowGroupSites: true,
                        allowIndividualSites: true,
                        allowWalkupPermits: true,
                    });
                    test.assertNotUndefinedAndNotNull(availability);
                    test.assertTrue(availability.any());
                });
            });
        });
    });
}