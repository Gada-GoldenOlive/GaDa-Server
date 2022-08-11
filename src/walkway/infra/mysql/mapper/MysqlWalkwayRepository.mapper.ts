import _ from "lodash";

import { Walkway } from "../../../domain/Walkway/Walkway";
import { WalkwayAddress } from "../../../domain/Walkway/WalkwayAddress";
import { WalkwayDistance } from "../../../domain/Walkway/WalkwayDistance";
import { WalkwayPath } from "../../../domain/Walkway/WalkwayPath";
import { Point, WalkwayStartPoint } from "../../../domain/Walkway/WalkwayStartPoint";
import { WalkwayTime } from "../../../domain/Walkway/WalkwayTime";
import { WalkwayTitle } from "../../../domain/Walkway/WalkwayTitle";
import { WalkwayEntity } from "../../../entity/Walkway.entity";

export class MysqlWalkwayRepositoryMapper {
    static toDomain(entity: WalkwayEntity): Walkway {
        if (_.isNil(entity)) {
            return null;
        }

        return Walkway.create(
            {
                title: WalkwayTitle.create(entity.title).value,
                address: WalkwayAddress.create(entity.address).value,
                distance: WalkwayDistance.create(entity.distance).value,
                time: WalkwayTime.create(entity.time).value,
                path: WalkwayPath.create(this.stringToPath(entity.path)).value,
                startPoint: WalkwayStartPoint.create(this.stringToPoint(entity.startPoint)).value,
                createdAt: entity.createdAt,
                updatedAt: entity.updatedAt,
            },
            entity.id
        ).value;
    }

    static toDomains(entities: WalkwayEntity[]): Walkway[] {
        return _.map(entities, (entity) => this.toDomain(entity));
    }

    static toEntity(walkway: Walkway): WalkwayEntity {
        const entity: WalkwayEntity = {
            id: walkway.id,
            title: walkway.title.value,
            address: walkway.address.value,
            distance: walkway.distance.value,
            time: walkway.time.value,
            path: this.pathToString(walkway.path.value),
            startPoint: this.pointToString(walkway.startPoint.value),
            createdAt: walkway.createdAt,
            updatedAt: walkway.updatedAt,
            // TODO
            user: undefined,
            walks: undefined,
            pins: undefined,
        };

        return entity;
    }

    static toEntities(walkways: Walkway[]): WalkwayEntity[] {
        return _.map(walkways, (walkway) => this.toEntity(walkway));
    }

    static stringToPath(string: string): Point[] {
        return JSON.parse(string);
    }

    static stringToPoint(string: string): Point {
        let lat: number
        let lng: number

        return {
            lat: lat,
            lng: lng,
        };
    }

    static pathToString(path: Point[]): string {
        return JSON.stringify(path);
    }

    static pointToString(point: Point): string {
        let pointString = 'POINT(' + point.lng + ' ' + point.lat + ')';

        return pointString;
    }
}
