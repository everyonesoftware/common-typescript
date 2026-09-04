import { HttpClient } from "../sources/httpClient.js";
import { PreConditionError } from "../sources/preConditionError.js";
import { RecreationDotGovClient, RecreationDotGovDivisionAvailability, RecreationDotGovError, RecreationDotGovPermitItineraryJson } from "../sources/recreationDotGovClient.js";
import { WonderlandTrailClient, WonderlandTrailLocations } from "../sources/wonderlandTrailClient.js";
import { Test } from "./test.js";
import { TestRunner } from "./testRunner.js";
import { hasNetworkAccess } from "./tests.js";

export function test(runner: TestRunner): void
{
    runner.testFile("recreationDotGovClient.ts", runner.skip(), () =>
    {
        runner.testType("RecreationDotGovClient", () =>
        {
            runner.testFunction("create()", () =>
            {
                function createErrorTest(httpClient: HttpClient, expected: Error): void
                {
                    runner.test(`with ${runner.toString(httpClient)}`, (test: Test) =>
                    {
                        test.assertThrows(() => RecreationDotGovClient.create(httpClient), expected);
                    });
                }

                createErrorTest(undefined!, new PreConditionError(
                    "Expression: httpClient",
                    "Expected:   not undefined and not null",
                    "Actual:     undefined",
                ));
                createErrorTest(null!, new PreConditionError(
                    "Expression: httpClient",
                    "Expected:   not undefined and not null",
                    "Actual:     null",
                ));

                runner.test("with default HttpClient", (test: Test) =>
                {
                    const httpClient: HttpClient = HttpClient.create();
                    const recreationDotGovClient: RecreationDotGovClient = RecreationDotGovClient.create(httpClient);
                    test.assertNotUndefinedAndNotNull(recreationDotGovClient);
                });
            });

            runner.testFunction("getPermitItinerary()", () =>
            {
                function getPermitItineraryErrorTest(itineraryId: string, expected: Error): void
                {
                    runner.test(`with ${runner.toString(itineraryId)}`, async (test: Test) =>
                    {
                        const client: RecreationDotGovClient = RecreationDotGovClient.create(HttpClient.create());
                        await test.assertThrowsAsync(async () => await client.getPermitItinerary(itineraryId), expected);
                    });
                }

                getPermitItineraryErrorTest(undefined!, new PreConditionError(
                    "Expression: permitItineraryId",
                    "Expected: not undefined and not null",
                    "Actual: undefined",
                ));
                getPermitItineraryErrorTest(null!, new PreConditionError(
                    "Expression: permitItineraryId",
                    "Expected: not undefined and not null",
                    "Actual: null",
                ));
                getPermitItineraryErrorTest("", new PreConditionError(
                    "Expression: permitItineraryId",
                    "Expected: not empty",
                    "Actual: \"\"",
                ));

                runner.test("with invalid permit itinerary id", runner.skip(!hasNetworkAccess), async (test: Test) =>
                {
                    const client: RecreationDotGovClient = RecreationDotGovClient.create(HttpClient.create());
                    await test.assertThrowsAsync(
                        async () => await client.getPermitItinerary("oopsie!"),
                        new RecreationDotGovError(
                            `No permit itinerary found for id: "oopsie!"`,
                        ),
                    );
                });

                runner.test("with valid permit itinerary id", runner.skip(!hasNetworkAccess), async (test: Test) =>
                {
                    const client: RecreationDotGovClient = RecreationDotGovClient.create(HttpClient.create());
                    const result: RecreationDotGovPermitItineraryJson = await client.getPermitItinerary(WonderlandTrailClient.permitItineraryId);
                    test.assertNotUndefinedAndNotNull(result);
                    test.assertEqual(result.id, WonderlandTrailClient.permitItineraryId);
                    test.assertEqual(result.name, "Mount Rainier National Park Wilderness and Climbing Permits");
                    test.assertNotUndefinedAndNotNull(result.divisions);
                    test.assertTrue(Object.keys(result.divisions).length > 0);
                    for (const division of Object.values(result.divisions))
                    {
                        test.assertNotUndefinedAndNotNull(division.id);
                        test.assertNotUndefinedAndNotNull(division.district);
                        test.assertNotUndefinedAndNotNull(division.name);
                        test.assertNotUndefinedAndNotNull(division.type);
                    }
                });
            });

            runner.testFunction("getDivisionAvailability()", () =>
            {
                function getDivisionAvailabilityErrorTest(itineraryId: string, divisionId: string, month: number, year: number, expected: Error): void
                {
                    runner.test(`with ${runner.andList([itineraryId, divisionId, month, year])}`, async (test: Test) =>
                    {
                        const client = RecreationDotGovClient.create(HttpClient.create());
                        await test.assertThrowsAsync(
                            async () => await client.getDivisionAvailability(itineraryId, divisionId, month, year),
                            expected,
                        );
                    });
                }

                getDivisionAvailabilityErrorTest(undefined!, "fake-division-id", 5, 2026, new PreConditionError(
                    "Expression: permitItineraryId",
                    "Expected: not undefined and not null",
                    "Actual: undefined",
                ));
                getDivisionAvailabilityErrorTest(null!, "fake-division-id", 5, 2026, new PreConditionError(
                    "Expression: permitItineraryId",
                    "Expected: not undefined and not null",
                    "Actual: null",
                ));
                getDivisionAvailabilityErrorTest("", "fake-division-id", 5, 2026, new PreConditionError(
                    "Expression: permitItineraryId",
                    "Expected: not empty",
                    "Actual: \"\"",
                ));
                getDivisionAvailabilityErrorTest("oopsie!", "fake-division-id", 5, 2026, new RecreationDotGovError(
                    `No permit itinerary found for id: "oopsie!"`,
                ));

                runner.test("with invalid division id", runner.skip(!hasNetworkAccess), async (test: Test) =>
                {
                    const client: RecreationDotGovClient = RecreationDotGovClient.create(HttpClient.create());
                    const itineraryId: string = WonderlandTrailClient.permitItineraryId;
                    const divisionId: string = "fake-division-id";
                    const month: number = 5;
                    const year: number = 2026;
                    const earlyAccessPermitLotteryId: string = "";

                    const response: RecreationDotGovDivisionAvailability = await client.getDivisionAvailability(itineraryId, divisionId, month, year, earlyAccessPermitLotteryId);

                    test.assertNotUndefinedAndNotNull(response);
                    test.assertNotUndefinedAndNotNull(response.json);
                    test.assertNotUndefinedAndNotNull(response.dayAvailabilities);
                    test.assertEqual(0, response.dayAvailabilities.getCount().await());
                    test.assertUndefined(response.maximumGroupSize);
                    test.assertUndefined(response.minimumGroupSize);
                });

                runner.test("with Sunrise Camp division id", runner.skip(true, "Skip flaky test"), async (test: Test) =>
                {
                    const client: RecreationDotGovClient = RecreationDotGovClient.create(HttpClient.create());

                    const itineraryId: string = WonderlandTrailClient.permitItineraryId;
                    const divisionId: string = WonderlandTrailLocations.sunriseCamp.divisionId;
                    const month: number = 8;
                    const year: number = 2026;
                    const earlyAccessPermitLotteryId: string = "";

                    const response: RecreationDotGovDivisionAvailability = await client.getDivisionAvailability(itineraryId, divisionId, month, year, earlyAccessPermitLotteryId);

                    test.assertNotUndefinedAndNotNull(response);
                    test.assertNotUndefinedAndNotNull(response.json);
                    test.assertNotUndefinedAndNotNull(response.dayAvailabilities);
                    test.assertEqual(31, response.dayAvailabilities.getCount().await());
                    test.assertNotUndefinedAndNotNull(response.maximumGroupSize);
                    test.assertNotUndefinedAndNotNull(response.minimumGroupSize);
                });

                runner.test("with Indian Bar division id", runner.skip(true, "Ignore test that easily breaks"), async (test: Test) =>
                {
                    const client: RecreationDotGovClient = RecreationDotGovClient.create(HttpClient.create());

                    const itineraryId: string = WonderlandTrailClient.permitItineraryId;
                    const divisionId: string = WonderlandTrailLocations.indianBar.divisionId;
                    const month: number = 7;
                    const year: number = 2026;
                    const earlyAccessPermitLotteryId: string = "";

                    const response: RecreationDotGovDivisionAvailability = await client.getDivisionAvailability(itineraryId, divisionId, month, year, earlyAccessPermitLotteryId);

                    test.assertNotUndefinedAndNotNull(response);
                    test.assertNotUndefinedAndNotNull(response.json);
                    test.assertNotUndefinedAndNotNull(response.dayAvailabilities);
                    test.assertEqual(10, response.dayAvailabilities.getCount().await());
                    test.assertNotUndefinedAndNotNull(response.maximumGroupSize);
                    test.assertNotUndefinedAndNotNull(response.minimumGroupSize);
                });
            });
        });
    });
}