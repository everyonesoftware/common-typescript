import { DateTime } from "./dateTime";
import { HttpClient } from "./httpClient";
import { HttpIncomingResponse } from "./httpIncomingResponse";
import { HttpOutgoingRequest } from "./httpOutgoingRequest";
import { Iterable } from "./iterable";
import { PreCondition } from "./preCondition";
import { RecreationDotGovClient, RecreationDotGovDivisionAvailability, RecreationDotGovDivisionDayAvailability } from "./recreationDotGovClient";
import { Result } from "./result";
import { Map } from "./map";
import { List } from "./list";
import { JavascriptIterable } from "./javascript";
import { hasProperty, isNumber, isObject, isUndefinedOrNull } from "./types";
import { MutableMap } from "./mutableMap";
import { NotFoundError } from "./notFoundError";
import { Iterator } from "./iterator";
import { Stack } from "./stack";
import { ListStack } from "./listStack";
import { PromiseAsyncResult } from "./promiseAsyncResult";
import { SyncResult } from "./syncResult";

export interface WonderlandTrailLocation
{
    readonly name: string;
    readonly trailhead: boolean;
    readonly foodCacheStorage: boolean;
    readonly divisionId: string;
    readonly groupSiteDivisionId: string;
}

export function isWonderlandTrailLocation(value: unknown): value is WonderlandTrailLocation
{
    return isObject(value) &&
        hasProperty(value, "name") &&
        hasProperty(value, "trailhead") &&
        hasProperty(value, "foodCacheStorage") &&
        hasProperty(value, "divisionId") &&
        hasProperty(value, "groupSiteDivisionId");
}

export abstract class WonderlandTrailLocations
{
    public static readonly graniteCreek: WonderlandTrailLocation = {
        name: "Granite Creek",
        trailhead: false,
        foodCacheStorage: false,
        divisionId: "46753170009",
        groupSiteDivisionId: "46753170010",
    };

    public static readonly sunriseCamp: WonderlandTrailLocation = {
        name: "Sunrise Camp",
        trailhead: false,
        foodCacheStorage: false,
        divisionId: "46753170058",
        groupSiteDivisionId: "46753170059",
    };

    public static readonly sunriseVisitorCenter: WonderlandTrailLocation = {
        name: "Sunrise Visitor Center",
        trailhead: true,
        foodCacheStorage: true,
        divisionId: "",
        groupSiteDivisionId: "",
    };

    public static readonly whiteRiver: WonderlandTrailLocation = {
        name: "White River",
        trailhead: true,
        foodCacheStorage: true,
        divisionId: "46753170066",
        groupSiteDivisionId: "46753170067",
    };

    public static readonly fryingPanCreek: WonderlandTrailLocation = {
        name: "Fryingpan Creek",
        trailhead: true,
        foodCacheStorage: false,
        divisionId: "",
        groupSiteDivisionId: ""
    };

    public static readonly summerland: WonderlandTrailLocation = {
        name: "Summerland",
        trailhead: false,
        foodCacheStorage: false,
        divisionId: "46753170056",
        groupSiteDivisionId: "46753170057",
    };

    public static readonly indianBar: WonderlandTrailLocation = {
        name: "Indian Bar",
        trailhead: false,
        foodCacheStorage: false,
        divisionId: "46753170046",
        groupSiteDivisionId: "46753170047",
    };

    public static readonly nickelCreek: WonderlandTrailLocation = {
        name: "Nickel Creek",
        trailhead: false,
        foodCacheStorage: false,
        divisionId: "46753170051",
        groupSiteDivisionId: "46753170052",
    };

    public static readonly boxCanyon: WonderlandTrailLocation = {
        name: "Box Canyon",
        trailhead: true,
        foodCacheStorage: false,
        divisionId: "",
        groupSiteDivisionId: "",
    };

    public static readonly mapleCreek: WonderlandTrailLocation = {
        name: "Maple Creek",
        trailhead: false,
        foodCacheStorage: false,
        divisionId: "46753170027",
        groupSiteDivisionId: "46753170028",
    };

    public static readonly reflectionLakes: WonderlandTrailLocation = {
        name: "Reflection Lakes",
        trailhead: true,
        foodCacheStorage: false,
        divisionId: "",
        groupSiteDivisionId: "",
    };

    public static readonly paradiseRiver: WonderlandTrailLocation = {
        name: "Paradise River",
        trailhead: false,
        foodCacheStorage: false,
        divisionId: "46753170031",
        groupSiteDivisionId: "46753170032",
    };

    public static readonly longmire: WonderlandTrailLocation = {
        name: "Longmire",
        trailhead: true,
        foodCacheStorage: true,
        divisionId: "",
        groupSiteDivisionId: "",
    };

    public static readonly pyramidCreek: WonderlandTrailLocation = {
        name: "Pyramid Creek",
        trailhead: false,
        foodCacheStorage: false,
        divisionId: "46753170033",
        groupSiteDivisionId: "",
    };

    public static readonly devilsDream: WonderlandTrailLocation = {
        name: "Devil's Dream",
        trailhead: false,
        foodCacheStorage: false,
        divisionId: "46753170040",
        groupSiteDivisionId: "46753170041",
    };

    public static readonly southPuyallupRiver: WonderlandTrailLocation = {
        name: "South Puyallup River",
        trailhead: false,
        foodCacheStorage: false,
        divisionId: "46753170035",
        groupSiteDivisionId: "46753170036",
    };

    public static readonly klapatchePark: WonderlandTrailLocation = {
        name: "Klapatche Park",
        trailhead: false,
        foodCacheStorage: false,
        divisionId: "46753170024",
        groupSiteDivisionId: "",
    };

    public static readonly northPuyallupRiver: WonderlandTrailLocation = {
        name: "North Puyallup River",
        trailhead: false,
        foodCacheStorage: false,
        divisionId: "46753170029",
        groupSiteDivisionId: "46753170030",
    };

    public static readonly goldenLakes: WonderlandTrailLocation = {
        name: "Golden Lakes",
        trailhead: false,
        foodCacheStorage: false,
        divisionId: "46753170022",
        groupSiteDivisionId: "46753170023",
    };

    public static readonly southMowichRiver: WonderlandTrailLocation = {
        name: "South Mowich River",
        trailhead: false,
        foodCacheStorage: false,
        divisionId: "46753170019",
        groupSiteDivisionId: "46753170020",
    };

    public static readonly mowichLake: WonderlandTrailLocation = {
        name: "Mowich Lake",
        trailhead: false,
        foodCacheStorage: false,
        divisionId: "46753170015",
        groupSiteDivisionId: "46753170016",
    };

    public static readonly eaglesRoost: WonderlandTrailLocation = {
        name: "Eagle's Roost",
        trailhead: false,
        foodCacheStorage: false,
        divisionId: "46753170006",
        groupSiteDivisionId: "",
    };

    public static readonly cataractValley: WonderlandTrailLocation = {
        name: "Cataract Valley",
        trailhead: false,
        foodCacheStorage: false,
        divisionId: "46753170003",
        groupSiteDivisionId: "46753170004",
    };

    public static readonly ipsutCreek: WonderlandTrailLocation = {
        name: "Ipsut Creek",
        trailhead: false,
        foodCacheStorage: false,
        divisionId: "46753170011",
        groupSiteDivisionId: "46753170012",
    };

    public static readonly carbonRiver: WonderlandTrailLocation = {
        name: "Carbon River",
        trailhead: false,
        foodCacheStorage: false,
        divisionId: "46753170001",
        groupSiteDivisionId: "46753170002",
    };

    public static readonly dickCreek: WonderlandTrailLocation = {
        name: "Dick Creek",
        trailhead: false,
        foodCacheStorage: false,
        divisionId: "46753170005",
        groupSiteDivisionId: "",
    };

    public static readonly mysticLake: WonderlandTrailLocation = {
        name: "Mystic Lake",
        trailhead: false,
        foodCacheStorage: false,
        divisionId: "46753170017",
        groupSiteDivisionId: "46753170018",
    };

    public static getLocations(): Iterable<WonderlandTrailLocation>
    {
        return Iterable.create([
            this.graniteCreek,
            this.sunriseCamp,
            this.sunriseVisitorCenter,
            this.whiteRiver,
            this.fryingPanCreek,
            this.summerland,
            this.indianBar,
            this.nickelCreek,
            this.boxCanyon,
            this.mapleCreek,
            this.reflectionLakes,
            this.paradiseRiver,
            this.longmire,
            this.pyramidCreek,
            this.devilsDream,
            this.southPuyallupRiver,
            this.klapatchePark,
            this.northPuyallupRiver,
            this.goldenLakes,
            this.southMowichRiver,
            this.mowichLake,
            this.eaglesRoost,
            this.cataractValley,
            this.ipsutCreek,
            this.carbonRiver,
            this.dickCreek,
            this.mysticLake,
        ]);
    }

    public static getTrailheads(): Iterable<WonderlandTrailLocation>
    {
        return this.getLocations().where(location => location.trailhead);
    }
}

export enum WonderlandTrailReservationType
{
    Reserved,
    Walkup,
}

export interface WonderlandTrailAvailabilityType
{
    readonly individualSite?: WonderlandTrailReservationType;
    readonly groupSite?: WonderlandTrailReservationType;
}

export class WonderlandTrailAvailability
{
    private readonly availabilityMap: MutableMap<WonderlandTrailLocation, MutableMap<string, WonderlandTrailAvailabilityType>>;

    private constructor()
    {
        this.availabilityMap = Map.create();
    }

    public static create(): WonderlandTrailAvailability
    {
        return new WonderlandTrailAvailability();
    }

    public any(): boolean
    {
        return this.availabilityMap.any().await();
    }

    public addAvailability(location: WonderlandTrailLocation, date: DateTime, individualSite?: WonderlandTrailReservationType, groupSite?: WonderlandTrailReservationType): void
    {
        PreCondition.assertNotUndefinedAndNotNull(location, "location");
        PreCondition.assertNotUndefinedAndNotNull(date, "date");

        const locationAvailability: MutableMap<string, WonderlandTrailAvailabilityType> | undefined = this.getAvailability(location);

        const dateString: string = date.toDateString();
        const locationDayAvailability: WonderlandTrailAvailabilityType = locationAvailability.getOrSet(dateString, () => { return {}; }).await();
        locationAvailability.set(dateString, {
            individualSite: individualSite ?? locationDayAvailability.individualSite,
            groupSite: groupSite ?? locationDayAvailability.groupSite,
        });
    }

    public getAvailability(location: WonderlandTrailLocation): MutableMap<string, WonderlandTrailAvailabilityType>
    {
        PreCondition.assertNotUndefinedAndNotNull(location, "location");

        return this.availabilityMap.getOrSet(location, () => MutableMap.create()).await();
    }

    public getDayAvailability(location: WonderlandTrailLocation, date: DateTime): SyncResult<WonderlandTrailAvailabilityType>
    {
        PreCondition.assertNotUndefinedAndNotNull(location, "location");
        PreCondition.assertNotUndefinedAndNotNull(date, "date");

        return this.getAvailability(location).get(date.toDateString())
            .convertError(NotFoundError, () => new NotFoundError(`No availability was found for ${location.name} on ${date.toDateString()}.`));
    }
}

export class WonderlandTrailDirection
{
    private readonly value: string;

    private constructor(value: string)
    {
        PreCondition.assertNotEmpty(value, "value");

        this.value = value;
    }

    public static readonly clockwise = new WonderlandTrailDirection("Clockwise");
    public static readonly counterClockwise = new WonderlandTrailDirection("CounterClockwise");

    public toString(): string
    {
        return this.value;
    }

    public reverse(): WonderlandTrailDirection
    {
        return this === WonderlandTrailDirection.clockwise ? WonderlandTrailDirection.counterClockwise : WonderlandTrailDirection.clockwise;
    }
}

export class WonderlandTrailConnection
{
    public readonly startLocation: WonderlandTrailLocation;
    public readonly endLocation: WonderlandTrailLocation;
    public readonly distanceMiles: number;
    public readonly ascentFeet: number;
    public readonly descentFeet: number;
    public readonly direction: WonderlandTrailDirection;
    public readonly intermediateLocations: Iterable<WonderlandTrailLocation>;

    private constructor(startLocation: WonderlandTrailLocation, endLocation: WonderlandTrailLocation, distanceMiles: number, ascentFeet: number, descentFeet: number, direction: WonderlandTrailDirection, intermediateLocations: Iterable<WonderlandTrailLocation>)
    {
        PreCondition.assertNotUndefinedAndNotNull(startLocation, "startLocation");
        PreCondition.assertNotUndefinedAndNotNull(endLocation, "endLocation");
        PreCondition.assertGreaterThanOrEqualTo(distanceMiles, 0, "distanceMiles");
        PreCondition.assertGreaterThanOrEqualTo(ascentFeet, 0, "ascentFeet");
        PreCondition.assertGreaterThanOrEqualTo(descentFeet, 0, "descentFeet");
        PreCondition.assertNotUndefinedAndNotNull(intermediateLocations, "intermediateLocations");

        this.startLocation = startLocation;
        this.endLocation = endLocation;
        this.distanceMiles = distanceMiles;
        this.ascentFeet = ascentFeet;
        this.descentFeet = descentFeet;
        this.direction = direction;
        this.intermediateLocations = intermediateLocations;
    }

    public static create(startLocation: WonderlandTrailLocation, endLocation: WonderlandTrailLocation, distanceMiles: number, ascentFeet: number, descentFeet: number, direction: WonderlandTrailDirection, intermediateLocations: Iterable<WonderlandTrailLocation>): WonderlandTrailConnection
    {
        return new WonderlandTrailConnection(startLocation, endLocation, distanceMiles, ascentFeet, descentFeet, direction, intermediateLocations);
    }

    public getLocations(): Iterable<WonderlandTrailLocation>
    {
        const result: List<WonderlandTrailLocation> = List.create();
        WonderlandTrailConnection.ensureExists(result, this.startLocation);
        WonderlandTrailConnection.ensureAllExist(result, this.intermediateLocations);
        WonderlandTrailConnection.ensureExists(result, this.endLocation);
        return result;
    }

    private static ensureExists(list: List<WonderlandTrailLocation>, location: WonderlandTrailLocation): void
    {
        if (!list.contains(location).await())
        {
            list.add(location);
        }
    }

    private static ensureAllExist(list: List<WonderlandTrailLocation>, locations: JavascriptIterable<WonderlandTrailLocation>): void
    {
        for (const location of locations)
        {
            WonderlandTrailConnection.ensureExists(list, location);
        }
    }

    public reverseDirection(): WonderlandTrailConnection
    {
        return WonderlandTrailConnection.create(
            this.endLocation,
            this.startLocation,
            this.distanceMiles,
            this.descentFeet,
            this.ascentFeet,
            this.direction.reverse(),
            this.intermediateLocations,
        )
    }

    public join(connection: WonderlandTrailConnection): WonderlandTrailConnection
    {
        const intermediateLocations: List<WonderlandTrailLocation> = List.create();
        WonderlandTrailConnection.ensureAllExist(intermediateLocations, this.intermediateLocations);
        WonderlandTrailConnection.ensureExists(intermediateLocations, this.endLocation);
        WonderlandTrailConnection.ensureExists(intermediateLocations, connection.startLocation);
        WonderlandTrailConnection.ensureAllExist(intermediateLocations, connection.intermediateLocations);

        return WonderlandTrailConnection.create(
            this.startLocation,
            connection.endLocation,
            this.distanceMiles + connection.distanceMiles,
            this.ascentFeet + connection.ascentFeet,
            this.descentFeet + connection.descentFeet,
            this.direction,
            intermediateLocations,
        );
    }

    public containsLocation(location: WonderlandTrailLocation): boolean
    {
        return this.getLocations().contains(location).await();
    }

    public isLoop(): boolean
    {
        return this.startLocation === this.endLocation;
    }
}

export class WonderlandTrailConnections
{
    private connections: MutableMap<WonderlandTrailLocation, List<WonderlandTrailConnection>>;
    public readonly addReverseConnectionDefault: boolean;

    private constructor(addReverseConnectionDefault: boolean)
    {
        this.connections = Map.create();
        this.addReverseConnectionDefault = addReverseConnectionDefault;
    }

    public static create(addReverseConnectionDefault?: boolean): WonderlandTrailConnections
    {
        return new WonderlandTrailConnections(!!addReverseConnectionDefault);
    }

    public static createDefault(): WonderlandTrailConnections
    {
        return WonderlandTrailConnections.create(true)
            .addConnection({
                startLocation: WonderlandTrailLocations.whiteRiver,
                endLocation: WonderlandTrailLocations.fryingPanCreek,
                distanceMiles: 2.7,
                ascentFeet: 100,
                descentFeet: 600,
            })
            .addConnection({
                startLocation: WonderlandTrailLocations.fryingPanCreek,
                endLocation: WonderlandTrailLocations.summerland,
                distanceMiles: 4.3,
                ascentFeet: 2200,
                descentFeet: 100,
            })
            .addConnection({
                startLocation: WonderlandTrailLocations.summerland,
                endLocation: WonderlandTrailLocations.indianBar,
                distanceMiles: 4.7,
                ascentFeet: 1200,
                descentFeet: 2100,
            })
            .addConnection({
                startLocation: WonderlandTrailLocations.indianBar,
                endLocation: WonderlandTrailLocations.nickelCreek,
                distanceMiles: 6.8,
                ascentFeet: 1400,
                descentFeet: 3200,
            })
            .addConnection({
                startLocation: WonderlandTrailLocations.nickelCreek,
                endLocation: WonderlandTrailLocations.boxCanyon,
                distanceMiles: 0.9,
                ascentFeet: 100,
                descentFeet: 400,
            })
            .addConnection({
                startLocation: WonderlandTrailLocations.boxCanyon,
                endLocation: WonderlandTrailLocations.mapleCreek,
                distanceMiles: 2.7,
                ascentFeet: 500,
                descentFeet: 700,
            })
            .addConnection({
                startLocation: WonderlandTrailLocations.mapleCreek,
                endLocation: WonderlandTrailLocations.reflectionLakes,
                distanceMiles: 4.7,
                ascentFeet: 2300,
                descentFeet: 200,
            })
            .addConnection({
                startLocation: WonderlandTrailLocations.reflectionLakes,
                endLocation: WonderlandTrailLocations.paradiseRiver,
                distanceMiles: 2.6,
                ascentFeet: 200,
                descentFeet: 1200,
            })
            .addConnection({
                startLocation: WonderlandTrailLocations.paradiseRiver,
                endLocation: WonderlandTrailLocations.longmire,
                distanceMiles: 3.6,
                ascentFeet: 100,
                descentFeet: 1200,
            })
            .addConnection({
                startLocation: WonderlandTrailLocations.longmire,
                endLocation: WonderlandTrailLocations.pyramidCreek,
                distanceMiles: 3.3,
                ascentFeet: 1400,
                descentFeet: 400,
            })
            .addConnection({
                startLocation: WonderlandTrailLocations.pyramidCreek,
                endLocation: WonderlandTrailLocations.devilsDream,
                distanceMiles: 2.5,
                ascentFeet: 1400,
                descentFeet: 100,
            })
            .addConnection({
                startLocation: WonderlandTrailLocations.devilsDream,
                endLocation: WonderlandTrailLocations.southPuyallupRiver,
                distanceMiles: 6.5,
                ascentFeet: 1900,
                descentFeet: 2700,
            })
            .addConnection({
                startLocation: WonderlandTrailLocations.southPuyallupRiver,
                endLocation: WonderlandTrailLocations.klapatchePark,
                distanceMiles: 4.1,
                ascentFeet: 2100,
                descentFeet: 800,
            })
            .addConnection({
                startLocation: WonderlandTrailLocations.klapatchePark,
                endLocation: WonderlandTrailLocations.northPuyallupRiver,
                distanceMiles: 2.6,
                ascentFeet: 100,
                descentFeet: 1900,
            })
            .addConnection({
                startLocation: WonderlandTrailLocations.northPuyallupRiver,
                endLocation: WonderlandTrailLocations.goldenLakes,
                distanceMiles: 5.1,
                ascentFeet: 1900,
                descentFeet: 600,
            })
            .addConnection({
                startLocation: WonderlandTrailLocations.goldenLakes,
                endLocation: WonderlandTrailLocations.southMowichRiver,
                distanceMiles: 5.8,
                ascentFeet: 200,
                descentFeet: 2400,
            })
            .addConnection({
                startLocation: WonderlandTrailLocations.southMowichRiver,
                endLocation: WonderlandTrailLocations.mowichLake,
                distanceMiles: 4.4,
                ascentFeet: 2400,
                descentFeet: 300,
            })
            .addConnection({
                startLocation: WonderlandTrailLocations.mowichLake,
                endLocation: WonderlandTrailLocations.ipsutCreek,
                distanceMiles: 5.6,
                ascentFeet: 400,
                descentFeet: 3000,
            })
            .addConnection({
                startLocation: WonderlandTrailLocations.ipsutCreek,
                endLocation: WonderlandTrailLocations.carbonRiver,
                distanceMiles: 4,
                ascentFeet: 1300,
                descentFeet: 400,
            })
            .addConnection({
                startLocation: WonderlandTrailLocations.mowichLake,
                endLocation: WonderlandTrailLocations.eaglesRoost,
                distanceMiles: 2,
                ascentFeet: 500,
                descentFeet: 600,
            })
            .addConnection({
                startLocation: WonderlandTrailLocations.eaglesRoost,
                endLocation: WonderlandTrailLocations.cataractValley,
                distanceMiles: 12.4,
                ascentFeet: 3300,
                descentFeet: 3700,
            })
            .addConnection({
                startLocation: WonderlandTrailLocations.cataractValley,
                endLocation: WonderlandTrailLocations.carbonRiver,
                distanceMiles: 1.6,
                ascentFeet: 100,
                descentFeet: 1300,
            })
            .addConnection({
                startLocation: WonderlandTrailLocations.carbonRiver,
                endLocation: WonderlandTrailLocations.dickCreek,
                distanceMiles: 1.3,
                ascentFeet: 1000,
                descentFeet: 100,
            })
            .addConnection({
                startLocation: WonderlandTrailLocations.dickCreek,
                endLocation: WonderlandTrailLocations.mysticLake,
                distanceMiles: 3.7,
                ascentFeet: 2100,
                descentFeet: 600,
            })
            .addConnection({
                startLocation: WonderlandTrailLocations.mysticLake,
                endLocation: WonderlandTrailLocations.graniteCreek,
                distanceMiles: 4.1,
                ascentFeet: 1500,
                descentFeet: 1200,
            })
            .addConnection({
                startLocation: WonderlandTrailLocations.graniteCreek,
                endLocation: WonderlandTrailLocations.sunriseCamp,
                distanceMiles: 4.6,
                ascentFeet: 1400,
                descentFeet: 1000,
            })
            .addConnection({
                startLocation: WonderlandTrailLocations.sunriseCamp,
                endLocation: WonderlandTrailLocations.whiteRiver,
                distanceMiles: 3.5,
                ascentFeet: 100,
                descentFeet: 2100,
            })
            .addConnection({
                startLocation: WonderlandTrailLocations.sunriseCamp,
                endLocation: WonderlandTrailLocations.sunriseVisitorCenter,
                distanceMiles: 1.4,
                ascentFeet: 400,
                descentFeet: 200,
            })
            .addConnection({
                startLocation: WonderlandTrailLocations.sunriseVisitorCenter,
                endLocation: WonderlandTrailLocations.whiteRiver,
                distanceMiles: 3.1,
                ascentFeet: 0,
                descentFeet: 2200,
            });
    }

    public iterateConnections(startLocation?: WonderlandTrailLocation, endLocation?: WonderlandTrailLocation, direction?: WonderlandTrailDirection): Iterator<WonderlandTrailConnection>;
    public iterateConnections(properties: { startLocation?: WonderlandTrailLocation, endLocation?: WonderlandTrailLocation, direction?: WonderlandTrailDirection }): Iterator<WonderlandTrailConnection>;
    iterateConnections(startLocationOrProperties?: WonderlandTrailLocation | { startLocation?: WonderlandTrailLocation, endLocation?: WonderlandTrailLocation, direction?: WonderlandTrailDirection }, endLocation?: WonderlandTrailLocation, direction?: WonderlandTrailDirection): Iterator<WonderlandTrailConnection>
    {
        let startLocation: WonderlandTrailLocation | undefined;
        if (isWonderlandTrailLocation(startLocationOrProperties))
        {
            startLocation = startLocationOrProperties;
        }
        else if (startLocationOrProperties)
        {
            startLocation = startLocationOrProperties.startLocation;
            endLocation = startLocationOrProperties.endLocation;
            direction = startLocationOrProperties.direction;
        }

        let result: Iterator<WonderlandTrailConnection>;
        if (!startLocation)
        {
            result = this.connections.iterateValues().flatMap(x => x);
        }
        else
        {
            result = this.connections.get(startLocation)
                .catch(NotFoundError, () => Iterable.create<WonderlandTrailConnection>())
                .await()
                .iterate();
        }

        if (endLocation)
        {
            result = result.where(connection => connection.endLocation == endLocation);
        }

        if (direction != null)
        {
            result = result.where(connection => connection.direction == direction);
        }

        return result;
    }

    private addConnectionInner(connection: WonderlandTrailConnection): void
    {
        const startLocationConnections: List<WonderlandTrailConnection> = this.connections.getOrSet(connection.startLocation, () => List.create()).await();
        startLocationConnections.add(connection);
    }

    public addConnection(connection: WonderlandTrailConnection, addReverseConnection?: boolean): this;
    public addConnection(startLocation: WonderlandTrailLocation, endLocation: WonderlandTrailLocation, distanceMiles: number, ascentFeet: number, descentFeet: number, direction?: WonderlandTrailDirection, intermediateLocations?: Iterable<WonderlandTrailLocation>, addReverseConnection?: boolean): this
    public addConnection(properties: { startLocation: WonderlandTrailLocation, endLocation: WonderlandTrailLocation, distanceMiles: number, ascentFeet: number, descentFeet: number, direction?: WonderlandTrailDirection, intermediateLocations?: Iterable<WonderlandTrailLocation>, addReverseConnection?: boolean }): this
    addConnection(connectionStartLocationOrProperties: WonderlandTrailLocation | { startLocation: WonderlandTrailLocation, endLocation: WonderlandTrailLocation, distanceMiles: number, ascentFeet: number, descentFeet: number, direction?: WonderlandTrailDirection, intermediateLocations?: Iterable<WonderlandTrailLocation>, addReverseConnection?: boolean }, addReverseConnectionOrEndLocation?: boolean | WonderlandTrailLocation, distanceMiles?: number, ascentFeet?: number, descentFeet?: number, direction?: WonderlandTrailDirection, intermediateLocations?: Iterable<WonderlandTrailLocation>, addReverseConnection?: boolean): this
    {
        let startLocation: WonderlandTrailLocation;
        let endLocation: WonderlandTrailLocation;
        if (isWonderlandTrailLocation(connectionStartLocationOrProperties))
        {
            startLocation = connectionStartLocationOrProperties;
        }
        else if (connectionStartLocationOrProperties instanceof WonderlandTrailConnection)
        {
            startLocation = connectionStartLocationOrProperties.startLocation;
            endLocation = connectionStartLocationOrProperties.endLocation;
            distanceMiles = connectionStartLocationOrProperties.distanceMiles;
            ascentFeet = connectionStartLocationOrProperties.ascentFeet;
            descentFeet = connectionStartLocationOrProperties.descentFeet;
            direction = connectionStartLocationOrProperties.direction;
            intermediateLocations = connectionStartLocationOrProperties.intermediateLocations;
            addReverseConnection = !!addReverseConnectionOrEndLocation;
        }
        else
        {
            startLocation = connectionStartLocationOrProperties.startLocation;
            endLocation = connectionStartLocationOrProperties.endLocation;
            distanceMiles = connectionStartLocationOrProperties.distanceMiles;
            ascentFeet = connectionStartLocationOrProperties.ascentFeet;
            descentFeet = connectionStartLocationOrProperties.descentFeet;
            direction = connectionStartLocationOrProperties.direction;
            intermediateLocations = connectionStartLocationOrProperties.intermediateLocations;
            addReverseConnection = connectionStartLocationOrProperties.addReverseConnection;
        }

        const connection: WonderlandTrailConnection = WonderlandTrailConnection.create(
            startLocation,
            endLocation!,
            distanceMiles!,
            ascentFeet!,
            descentFeet!,
            direction ?? WonderlandTrailDirection.clockwise,
            intermediateLocations ?? Iterable.create(),
        );

        this.addConnectionInner(connection);
        if (addReverseConnection ?? this.addReverseConnectionDefault)
        {
            this.addConnectionInner(connection.reverseDirection());
        }

        return this;
    }

    public containsConnection(connection: WonderlandTrailConnection): boolean
    {
        PreCondition.assertNotUndefinedAndNotNull(connection, "connection");

        const startLocationConnections: Iterable<WonderlandTrailConnection> | undefined = this.connections.get(connection.startLocation).catch(() => undefined).await();
        return startLocationConnections?.contains(connection)?.await() === true;
    }

    public reverseDirection(): WonderlandTrailConnections
    {
        const result: WonderlandTrailConnections = WonderlandTrailConnections.create(this.addReverseConnectionDefault);
        for (const connection of this.iterateConnections())
        {
            result.addConnection(connection.reverseDirection());
        }
        return result;
    }

    public expandConnections(startLocation?: WonderlandTrailLocation, endLocation?: WonderlandTrailLocation, direction?: WonderlandTrailDirection): WonderlandTrailConnections
    {
        if (isUndefinedOrNull(direction))
        {
            direction = WonderlandTrailDirection.clockwise;
        }

        const result: WonderlandTrailConnections = WonderlandTrailConnections.create(this.addReverseConnectionDefault);

        const toVisit: ListStack<WonderlandTrailConnection> = Stack.create();
        toVisit.addAll(this.iterateConnections(startLocation, undefined, direction));

        while (toVisit.any().await())
        {
            const currentConnection: WonderlandTrailConnection = toVisit.remove().await();
            result.addConnection(currentConnection, false);

            if (!currentConnection.isLoop() && currentConnection.endLocation !== endLocation)
            {
                for (const endLocationConnection of this.iterateConnections(currentConnection.endLocation, undefined, direction))
                {
                    if (!result.containsConnection(endLocationConnection) &&
                        !toVisit.contains(endLocationConnection))
                    {
                        toVisit.add(endLocationConnection);
                    }

                    if (!currentConnection.intermediateLocations.contains(endLocationConnection.endLocation))
                    {
                        toVisit.add(currentConnection.join(endLocationConnection));
                    }
                }
            }
        }

        return result;
    }
}

export class WonderlandTrailItinerary
{
    public readonly startDay: DateTime;
    private readonly connections: List<WonderlandTrailConnection>;
    private readonly availabilityTypes: List<WonderlandTrailAvailabilityType>;

    private constructor(startDay: DateTime)
    {
        PreCondition.assertNotUndefinedAndNotNull(startDay, "startDay");

        this.startDay = startDay;
        this.connections = List.create();
        this.availabilityTypes = List.create();
    }

    public static create(startDay: DateTime): WonderlandTrailItinerary
    {
        return new WonderlandTrailItinerary(startDay);
    }

    public clone(): WonderlandTrailItinerary
    {
        return WonderlandTrailItinerary.create(this.startDay)
            .addConnections(this.connections)
            .addAvailabilityTypes(this.availabilityTypes);
    }

    public getConnections(): Iterable<WonderlandTrailConnection>
    {
        return this.connections;
    }

    public getEndDay(): DateTime
    {
        return this.startDay.addDays(this.getDayCount() - 1);
    }

    public getDayCount(): number
    {
        return this.connections.getCount().await();
    }

    public getStartLocation(): SyncResult<WonderlandTrailLocation>
    {
        return this.connections.first().then(firstConnection => firstConnection.startLocation);
    }

    public getIntermediateLocations(): Iterable<WonderlandTrailLocation>
    {
        const result: List<WonderlandTrailLocation> = List.create();
        for (const connection of this.connections)
        {
            if (result.any().await())
            {
                result.add(connection.startLocation);
            }
            result.addAll(connection.intermediateLocations);
        }
        return result;
    }

    public getEndLocation(): SyncResult<WonderlandTrailLocation>
    {
        return this.connections.last().then(lastConnection => lastConnection.endLocation);
    }

    public getPath(): Iterable<WonderlandTrailLocation>
    {
        const result: List<WonderlandTrailLocation> = List.create();
        for (const connection of this.connections)
        {
            if (!result.any().await())
            {
                result.add(connection.startLocation);
            }
            result.add(connection.endLocation);
        }
        return result;
    }

    public getPathStrings(includeAvailabilityTypes?: boolean): Iterable<string>
    {
        includeAvailabilityTypes = includeAvailabilityTypes ?? true;

        const result: List<string> = List.create();
        let availabilityTypeIndex: number = 0;
        const availabilityTypeCount: number = this.availabilityTypes.getCount().await();

        for (const connection of this.connections)
        {
            if (!result.any().await())
            {
                result.add(connection.startLocation.name);
            }

            let pathString: string = connection.endLocation.name;
            if (includeAvailabilityTypes && availabilityTypeIndex < availabilityTypeCount)
            {
                pathString += " ";

                const availabilityType: WonderlandTrailAvailabilityType = this.availabilityTypes.get(availabilityTypeIndex).await();
                availabilityTypeIndex++;

                if (availabilityType.individualSite !== undefined)
                {
                    if (availabilityType.groupSite !== undefined)
                    {
                        pathString += `(Individual ${availabilityType.individualSite}/Group ${availabilityType.groupSite})`;
                    }
                    else
                    {
                        pathString += `(Individual ${availabilityType.individualSite})`;
                    }
                }
                else
                {
                    pathString += `(Group ${availabilityType.groupSite})`;
                }
            }

            result.add(pathString);
        }

        return result;
    }

    public contains(parameters: {
        location: WonderlandTrailLocation,
        checkItineraryStartLocation?: boolean,
        checkItineraryIntermediateLocations?: boolean,
        checkItineraryEndLocation?: boolean,
    }): boolean
    {
        PreCondition.assertNotUndefinedAndNotNull(parameters, "parameters");

        const location: WonderlandTrailLocation = parameters.location;
        const checkItineraryStartLocation: boolean = parameters.checkItineraryStartLocation ?? true;
        const checkItineraryIntermediateLocations: boolean = parameters.checkItineraryIntermediateLocations ?? true;
        const checkItineraryEndLocation: boolean = parameters.checkItineraryEndLocation ?? true;

        PreCondition.assertNotUndefinedAndNotNull(location, "location");

        let result: boolean = false;

        const connectionCount: number = this.connections.getCount().await();
        for (let i = 0; i < connectionCount; i++)
        {
            if (i !== 0 || checkItineraryStartLocation)
            {
                result = (this.connections.get(i).await().startLocation === location);
                if (result)
                {
                    break;
                }
            }

            if (checkItineraryIntermediateLocations)
            {
                result = this.connections.get(i).await().intermediateLocations.contains(location).await();
                if (result)
                {
                    break;
                }
            }

            if (i === connectionCount - 1 && checkItineraryEndLocation)
            {
                result = (this.connections.get(i).await().endLocation === location);
                if (result)
                {
                    break;
                }
            }
        }

        return result;
    }

    public containsAny(parameters: {
        connection: WonderlandTrailConnection,
        checkConnectionStartLocation?: boolean,
        checkConnectionIntermediateLocations?: boolean,
        checkConnectionEndLocation?: boolean,
        checkItineraryStartLocation?: boolean,
        checkItineraryIntermediateLocations?: boolean,
        checkItineraryEndLocation?: boolean,
    }): boolean
    {
        PreCondition.assertNotUndefinedAndNotNull(parameters, "parameters");

        const connection: WonderlandTrailConnection = parameters.connection;
        const checkConnectionStartLocation: boolean = parameters.checkConnectionStartLocation ?? true;
        const checkConnectionIntermediateLocations: boolean = parameters.checkConnectionIntermediateLocations ?? true;
        const checkConnectionEndLocation: boolean = parameters.checkConnectionEndLocation ?? true;
        const checkItineraryStartLocation: boolean = parameters.checkItineraryStartLocation ?? true;
        const checkItineraryIntermediateLocations: boolean = parameters.checkItineraryIntermediateLocations ?? true;
        const checkItineraryEndLocation: boolean = parameters.checkItineraryEndLocation ?? true;

        PreCondition.assertNotUndefinedAndNotNull(connection, "connection");

        let result: boolean = false;

        if (!result && checkConnectionStartLocation)
        {
            result = this.contains({
                location: connection.startLocation,
                checkItineraryStartLocation,
                checkItineraryIntermediateLocations,
                checkItineraryEndLocation,
            });
        }

        if (!result && checkConnectionIntermediateLocations)
        {
            for (const connectionIntermediateLocation of connection.intermediateLocations)
            {
                result = this.contains({
                    location: connectionIntermediateLocation,
                    checkItineraryStartLocation,
                    checkItineraryIntermediateLocations,
                    checkItineraryEndLocation,
                });
                if (result)
                {
                    break;
                }
            }
        }

        if (!result && checkConnectionEndLocation)
        {
            result = this.contains({
                location: connection.endLocation,
                checkItineraryStartLocation,
                checkItineraryIntermediateLocations,
                checkItineraryEndLocation,
            });
        }

        return result;
    }

    public addConnection(connection: WonderlandTrailConnection): this
    {
        PreCondition.assertNotUndefinedAndNotNull(connection, "connection");

        this.connections.add(connection);

        return this;
    }

    public addConnections(connections: JavascriptIterable<WonderlandTrailConnection>): this
    {
        PreCondition.assertNotUndefinedAndNotNull(connections, "connections");

        this.connections.addAll(connections);

        return this;
    }

    public addAvailabilityType(availabilityType: WonderlandTrailAvailabilityType): this
    {
        PreCondition.assertNotUndefinedAndNotNull(availabilityType, "availabilityType");

        this.availabilityTypes.add(availabilityType);

        return this;
    }

    public addAvailabilityTypes(availabilityTypes: JavascriptIterable<WonderlandTrailAvailabilityType>): this
    {
        PreCondition.assertNotUndefinedAndNotNull(availabilityTypes, "availabilityTypes");

        this.availabilityTypes.addAll(availabilityTypes);

        return this;
    }

    public toString(includeAvailabilityTypes?: boolean): string
    {
        includeAvailabilityTypes = includeAvailabilityTypes ?? true;
        return `startDay:${this.startDay.toDateString()},path:${this.getPathStrings(includeAvailabilityTypes)}`;
    }
}

export class WonderlandTrailClient implements HttpClient
{
    public static readonly permitItineraryId: string = "4675317";

    private readonly httpClient: HttpClient;
    private readonly recreationDotGovClient: RecreationDotGovClient;

    private constructor(httpClient: HttpClient)
    {
        PreCondition.assertNotUndefinedAndNotNull(httpClient, "httpClient");

        this.httpClient = httpClient;
        this.recreationDotGovClient = RecreationDotGovClient.create(httpClient);
    }

    public static create(httpClient: HttpClient): WonderlandTrailClient
    {
        return new WonderlandTrailClient(httpClient);
    }

    public sendRequest(request: HttpOutgoingRequest): Result<HttpIncomingResponse>
    {
        return this.httpClient.sendRequest(request);
    }

    public sendGetRequest(url: string): Result<HttpIncomingResponse>
    {
        return HttpClient.sendGetRequest(this, url);
    }

    public getAvailability(month: number, year: number, allowWalkupPermits: boolean, allowIndividualSites: boolean, allowGroupSites: boolean, earlyAccessPermitLotteryId?: string): PromiseAsyncResult<WonderlandTrailAvailability>;
    public getAvailability(options: { month: number, year: number, allowWalkupPermits: boolean, allowIndividualSites: boolean, allowGroupSites: boolean, earlyAccessPermitLotteryId?: string }): PromiseAsyncResult<WonderlandTrailAvailability>;
    getAvailability(monthOrOptions: number | { month: number, year: number, allowWalkupPermits: boolean, allowIndividualSites: boolean, allowGroupSites: boolean, earlyAccessPermitLotteryId?: string }, year?: number, allowWalkupPermits?: boolean, allowIndividualSites?: boolean, allowGroupSites?: boolean, earlyAccessPermitLotteryId?: string): PromiseAsyncResult<WonderlandTrailAvailability>
    {
        let month: number;
        if (isNumber(monthOrOptions))
        {
            month = monthOrOptions;
            year = year!;
            allowWalkupPermits = allowWalkupPermits!;
            allowIndividualSites = allowIndividualSites!;
            allowGroupSites = allowGroupSites!;
        }
        else
        {
            month = monthOrOptions.month;
            year = monthOrOptions.year;
            allowWalkupPermits = monthOrOptions.allowWalkupPermits;
            allowIndividualSites = monthOrOptions.allowIndividualSites;
            allowGroupSites = monthOrOptions.allowGroupSites;
            earlyAccessPermitLotteryId = monthOrOptions.earlyAccessPermitLotteryId;
        }
        return PromiseAsyncResult.create(async () =>
        {
            const result = WonderlandTrailAvailability.create();

            for (const location of WonderlandTrailLocations.getLocations())
            {
                if (allowIndividualSites && location.divisionId)
                {
                    const divisionAvailability: RecreationDotGovDivisionAvailability = await this.recreationDotGovClient.getDivisionAvailability(
                        WonderlandTrailClient.permitItineraryId,
                        location.divisionId,
                        month,
                        year,
                        earlyAccessPermitLotteryId,
                    );
                    const divisionDayAvailabilities: Iterable<RecreationDotGovDivisionDayAvailability> = divisionAvailability.dayAvailabilities;
                    if (divisionDayAvailabilities)
                    {
                        for (const divisionDayAvailability of divisionDayAvailabilities)
                        {
                            const hasWalkupPermits: boolean = (allowWalkupPermits && divisionDayAvailability.walkup);
                            const hasReservationPermits: boolean = (divisionDayAvailability.reservationsRemaining > 0);
                            if (hasWalkupPermits || hasReservationPermits)
                            {
                                result.addAvailability(
                                    location,
                                    divisionDayAvailability.date,
                                    hasWalkupPermits ? WonderlandTrailReservationType.Walkup : WonderlandTrailReservationType.Reserved,
                                    undefined,
                                );
                            }
                        }
                    }
                }

                if (allowGroupSites && location.groupSiteDivisionId)
                {
                    const groupSiteDivisionAvailability: RecreationDotGovDivisionAvailability = await this.recreationDotGovClient.getDivisionAvailability(
                        WonderlandTrailClient.permitItineraryId,
                        location.groupSiteDivisionId,
                        month,
                        year,
                        earlyAccessPermitLotteryId,
                    );
                    const groupSiteDivisionDayAvailabilities: Iterable<RecreationDotGovDivisionDayAvailability> = groupSiteDivisionAvailability.dayAvailabilities;
                    if (groupSiteDivisionDayAvailabilities)
                    {
                        for (const groupSiteDayAvailability of groupSiteDivisionDayAvailabilities)
                        {
                            const hasWalkupPermits: boolean = (allowWalkupPermits && groupSiteDayAvailability.walkup);
                            const hasReservationPermits: boolean = (groupSiteDayAvailability.reservationsRemaining > 0);
                            if (hasWalkupPermits || hasReservationPermits)
                            {
                                result.addAvailability(
                                    location,
                                    groupSiteDayAvailability.date,
                                    undefined,
                                    hasWalkupPermits ? WonderlandTrailReservationType.Walkup : WonderlandTrailReservationType.Reserved,
                                );
                            }
                        }
                    }
                }
            }

            return result;
        });
    }

    public findItineraries(parameters: {
        availability: WonderlandTrailAvailability,
        startDate: DateTime,
        startLocation: WonderlandTrailLocation,
        endLocation: WonderlandTrailLocation,
        direction: WonderlandTrailDirection,
        maximumDayDistanceMiles?: number,
        maximumItineraryDays?: number,
        campsitesToAvoid?: JavascriptIterable<WonderlandTrailLocation>,
    }): Iterable<WonderlandTrailItinerary>
    {
        PreCondition.assertNotUndefinedAndNotNull(parameters, "parameters");

        const availability: WonderlandTrailAvailability = parameters.availability;
        const startDate: DateTime = parameters.startDate;
        const startLocation: WonderlandTrailLocation = parameters.startLocation;
        const endLocation: WonderlandTrailLocation = parameters.endLocation;
        const direction: WonderlandTrailDirection = parameters.direction;
        const maximumDayDistanceMiles: number | undefined = parameters.maximumDayDistanceMiles;
        const maximumItineraryDays: number | undefined = parameters.maximumItineraryDays;
        const campsitesToAvoid: Iterable<WonderlandTrailLocation> = Iterable.create(parameters.campsitesToAvoid ?? []);

        const result: List<WonderlandTrailItinerary> = List.create();

        const connections: WonderlandTrailConnections = WonderlandTrailConnections.createDefault()
            .expandConnections(startLocation, endLocation, direction);

        let startLocationConnections: Iterator<WonderlandTrailConnection> = connections.iterateConnections(startLocation, undefined, direction);
        if (!isUndefinedOrNull(maximumDayDistanceMiles))
        {
            startLocationConnections = startLocationConnections.where(connection => connection.distanceMiles <= maximumDayDistanceMiles);
        }

        const possibleItineraries: ListStack<WonderlandTrailItinerary> = Stack.create();
        possibleItineraries.addAll(startLocationConnections.map(c => WonderlandTrailItinerary.create(startDate).addConnection(c)));

        while (possibleItineraries.any().await())
        {
            const currentItinerary: WonderlandTrailItinerary = possibleItineraries.remove().await();
            const currentItineraryEndLocation: WonderlandTrailLocation = currentItinerary.getEndLocation().await();

            if ((maximumItineraryDays === undefined || currentItinerary.getDayCount() <= maximumItineraryDays) &&
                (startLocation === currentItineraryEndLocation || endLocation === currentItineraryEndLocation || !campsitesToAvoid.contains(currentItineraryEndLocation).await()))
            {
                if (currentItineraryEndLocation === endLocation)
                {
                    result.add(currentItinerary);
                }
                else
                {
                    const dayAvailability: WonderlandTrailAvailabilityType | undefined = availability.getDayAvailability(currentItineraryEndLocation, currentItinerary.getEndDay())
                        .catch(() => undefined)
                        .await();
                    if (dayAvailability)
                    {
                        currentItinerary.addAvailabilityType(dayAvailability);

                        for (const nextDayConnection of connections.iterateConnections(currentItineraryEndLocation, undefined, direction))
                        {
                            if (!currentItinerary.containsAny({
                                connection: nextDayConnection,
                                checkConnectionStartLocation: false,
                                checkItineraryStartLocation: false,
                                checkItineraryEndLocation: false,
                            }))
                            {
                                if (maximumDayDistanceMiles === undefined || nextDayConnection.distanceMiles <= maximumDayDistanceMiles)
                                {
                                    possibleItineraries.add(currentItinerary.clone().addConnection(nextDayConnection));
                                }
                            }
                        }
                    }
                }
            }
        }

        return result;
    }

    public findItinerariesAsync(parameters: {
        startDay: DateTime,
        startLocation?: WonderlandTrailLocation,
        endLocation?: WonderlandTrailLocation,
        direction?: WonderlandTrailDirection,
        maximumDayDistanceMiles?: number,
        maximumItineraryDays?: number,
        allowWalkupPermits?: boolean,
        allowIndividualSites?: boolean,
        allowGroupSites?: boolean,
        campsitesToAvoid?: JavascriptIterable<WonderlandTrailLocation>,
    }): PromiseAsyncResult<Iterable<WonderlandTrailItinerary>>
    {
        PreCondition.assertNotUndefinedAndNotNull(parameters, "parameters");

        const startDay: DateTime = parameters.startDay;
        const startLocation: WonderlandTrailLocation | undefined = parameters.startLocation;
        const endLocation: WonderlandTrailLocation | undefined = parameters.endLocation;
        const direction: WonderlandTrailDirection | undefined = parameters.direction;
        const maximumDayDistanceMiles: number | undefined = parameters.maximumDayDistanceMiles;
        const maximumItineraryDays: number | undefined = parameters.maximumItineraryDays;
        const allowWalkupPermits: boolean = parameters.allowWalkupPermits ?? true;
        const allowIndividualSites: boolean = parameters.allowIndividualSites ?? true;
        const allowGroupSites: boolean = parameters.allowGroupSites ?? false;
        const campsitesToAvoid: JavascriptIterable<WonderlandTrailLocation> = parameters.campsitesToAvoid ?? [];

        PreCondition.assertNotUndefinedAndNotNull(startDay, "startDay");

        return PromiseAsyncResult.create(async () =>
        {
            const result: List<WonderlandTrailItinerary> = List.create();

            const startLocationsToCheck: Iterable<WonderlandTrailLocation> =
                (!isUndefinedOrNull(startLocation) ? Iterable.create([startLocation]) : WonderlandTrailLocations.getTrailheads());
            const directionsToCheck: Iterable<WonderlandTrailDirection> =
                (!isUndefinedOrNull(direction) ? Iterable.create([direction]) : Iterable.create([WonderlandTrailDirection.clockwise, WonderlandTrailDirection.counterClockwise]));

            const availability: WonderlandTrailAvailability = await this.getAvailability(
                startDay.getMonth(),
                startDay.getYear(),
                allowWalkupPermits,
                allowIndividualSites,
                allowGroupSites,
            );

            for (const startLocationToCheck of startLocationsToCheck)
            {
                for (const directionToCheck of directionsToCheck)
                {
                    result.addAll(this.findItineraries({
                        availability,
                        startDate: startDay,
                        startLocation: startLocationToCheck,
                        endLocation: endLocation ?? startLocationToCheck,
                        direction: directionToCheck,
                        maximumDayDistanceMiles,
                        maximumItineraryDays,
                        campsitesToAvoid,
                    }))
                }
            }

            return result;
        });
    }
}