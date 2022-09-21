import _ from 'lodash';

import { ImageUrl } from '../../../../common/domain/Image/ImageUrl';
import { MysqlUserRepositoryMapper } from '../../../../user/infra/mysql/mapper/MysqlUserRepositoryMapper';
import { MysqlWalkwayRepositoryMapper } from '../../../../walkway/infra/mysql/mapper/MysqlWalkwayRepository.mapper';
import { Pin } from '../../../domain/Pin/Pin';
import { PinContent } from '../../../domain/Pin/PinContent';
import { PinLocation, Point } from '../../../domain/Pin/PinLocation';
import { PinTitle } from '../../../domain/Pin/PinTitle';
import { PinEntity } from '../../../entity/Pin.entity';

export class MysqlPinRepositoryMapper {
    static toDomain(entity: PinEntity): Pin {
        if (_.isNil(entity)) {
            return null;
        }

        const pin = Pin.create({
            title: PinTitle.create(entity.title).value,
            content: entity.content ? PinContent.create(entity.content).value : null,
            image: entity.image ? ImageUrl.create(entity.image).value : null,
            location: PinLocation.create(MysqlPinRepositoryMapper.convertToPoint(entity.location)).value,
            walkway: MysqlWalkwayRepositoryMapper.toDomain(entity.walkway),
            user: MysqlUserRepositoryMapper.toDomain(entity.user),
            status: entity.status,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        }, entity.id).value;

        return pin;
    }

    static toDomains(entities: PinEntity[]): Pin[] {
        return _.map(entities, this.toDomain);
    }

    static toEntity(pin: Pin): PinEntity {
        if (_.isNil(pin)) {
            return null;
        }

        const entity: PinEntity = {
            id: pin.id,
            title: pin.title.value,
            content: pin.content ? pin.content.value : null,
            image: pin.image ? pin.image.value : null,
            location: MysqlPinRepositoryMapper.pointToString(pin.location.value),
            status: pin.status,
            walkway: MysqlWalkwayRepositoryMapper.toEntity(pin.walkway),
            user: MysqlUserRepositoryMapper.toEntity(pin.user),
            comments: undefined,
            createdAt: pin.createdAt,
            updatedAt: pin.updatedAt,
        };

        return entity;
    }

    static toEntities(pins: Pin[]): PinEntity[] {
        return _.map(pins, (pin) => this.toEntity(pin));
    }

    static convertToPoint(location: any): Point {
        if (typeof(location) == 'string') {
            let locationArray = location.split(' ');
        
            return {
                lat: +locationArray[0].slice(6),
                lng: +locationArray[1].slice(0, -1),
            };
        }
        
        return {
            lat: location['x'],
            lng: location['y'],
        };
    }

    static pointToString(point: Point): string {
        let poinString = `POINT(${point.lat} ${point.lng})`;

        return poinString;
    }
}
