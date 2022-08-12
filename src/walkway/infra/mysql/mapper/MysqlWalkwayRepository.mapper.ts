import _ from "lodash";
import { MysqlUserRepositoryMapper } from "../../../../user/infra/mysql/mapper/MysqlUserRepositoryMapper";

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
                user: MysqlUserRepositoryMapper.toDomain(entity.user),
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
        if (_.isNil(walkway)) {
            return null;
        }

        const entity: WalkwayEntity = {
            id: walkway.id,
            title: walkway.title.value,
            address: walkway.address.value,
            distance: walkway.distance.value,
            time: walkway.time.value,
            path: this.pathToString(walkway.path.value),
            startPoint: this.pointToString(walkway.startPoint.value),
            status: walkway.status,
            createdAt: walkway.createdAt,
            updatedAt: walkway.updatedAt,
            user: undefined,
            walks: undefined,
            pins: undefined,
            reviews: undefined,
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
        // TODO: Point 타입 가져왔을 때 포맷 보고 수정해야함.
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
