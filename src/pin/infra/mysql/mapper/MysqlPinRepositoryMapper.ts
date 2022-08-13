import _ from 'lodash';

import { ImageUrl } from '../../../../common/domain/Image/ImageUrl';
import { MysqlUserRepositoryMapper } from '../../../../user/infra/mysql/mapper/MysqlUserRepositoryMapper';
import { MysqlWalkwayRepositoryMapper } from '../../../../walkway/infra/mysql/mapper/MysqlWalkwayRepository.mapper';
import { Pin } from '../../../domain/Pin';
import { PinContent } from '../../../domain/PinContent';
import { PinLatitude } from '../../../domain/PinLatitude';
import { PinLongitude } from '../../../domain/PinLongitude';
import { PinTitle } from '../../../domain/PinTitle';
import { PinEntity } from '../../../entity/Pin.entity';

export class MysqlPinRepositoryMapper {
    static toDomain(entity: PinEntity): Pin {
        if (_.isNil(entity)) {
            return null;
        }

        const pin =  Pin.create({
            title: PinTitle.create(entity.title).value,
            content: PinContent.create(entity.content).value,
            image: entity.image ? ImageUrl.create(entity.image).value : null,
            latitude: PinLatitude.create(entity.latitude).value,
            longitude: PinLongitude.create(entity.longitude).value,
            walkway: MysqlWalkwayRepositoryMapper.toDomain(entity.walkway),
            user: MysqlUserRepositoryMapper.toDomain(entity.user),
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
            content: pin.content.value,
            image: pin.image.value,
            latitude: pin.latitude.value,
            longitude: pin.longitude.value,
            status: pin.status,
            walkway: MysqlWalkwayRepositoryMapper.toEntity(pin.walkway),
            user: MysqlUserRepositoryMapper.toEntity(pin.user),
            createdAt: pin.createdAt,
            updatedAt: pin.updatedAt,
        };

        return entity;
    }

    static toEntities(pins: Pin[]): PinEntity[] {
        return _.map(pins, (pin) => this.toEntity(pin));
    }
}
