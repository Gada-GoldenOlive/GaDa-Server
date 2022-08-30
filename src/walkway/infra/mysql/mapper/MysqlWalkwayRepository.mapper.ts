import _ from "lodash";
import { ImageUrl } from "../../../../common/domain/Image/ImageUrl";

import { MysqlUserRepositoryMapper } from "../../../../user/infra/mysql/mapper/MysqlUserRepositoryMapper";
import { Walkway } from "../../../domain/Walkway/Walkway";
import { WalkwayAddress } from "../../../domain/Walkway/WalkwayAddress";
import { WalkwayDistance } from "../../../domain/Walkway/WalkwayDistance";
import { WalkwayEndPoint } from "../../../domain/Walkway/WalkwayEndPoint";
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
                path: WalkwayPath.create(this.convertToPath(entity.path)).value,
                startPoint: WalkwayStartPoint.create(this.convertToPoint(entity.startPoint)).value,
                endPoint: WalkwayEndPoint.create(this.convertToPoint(entity.endPoint)).value,
                user: MysqlUserRepositoryMapper.toDomain(entity.user),
                createdAt: entity.createdAt,
                updatedAt: entity.updatedAt,
                image: ImageUrl.create(entity.image).value,
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
            endPoint: this.pointToString(walkway.endPoint.value),
            status: walkway.status,
            createdAt: walkway.createdAt,
            updatedAt: walkway.updatedAt,
            image: walkway.image.value,
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

    static convertToPath(string: string): Point[] {
        let toConvert: any = string;

        if (typeof(toConvert) == 'string')
            toConvert = JSON.parse(toConvert);

        return toConvert;
    }

    static convertToPoint(startPoint: any): Point {
        if (typeof(startPoint) == 'string') {
            let startPointArray = startPoint.split(' ');
            return {
                lat: +startPointArray[0].slice(6),
                lng: +startPointArray[1].slice(0, -1),
            };
        }
        return {
            lat: startPoint['x'],
            lng: startPoint['y'],
        };
    }

    static pathToString(path: Point[]): string {
        return JSON.stringify(path);
    }

    static pointToString(point: Point): string {
        let pointString = 'POINT(' + point.lat + ' ' + point.lng + ')';

        return pointString;
    }
}
