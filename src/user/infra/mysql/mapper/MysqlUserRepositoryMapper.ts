import _ from 'lodash';

import { ImageUrl } from '../../../../common/domain/Image/ImageUrl';
import { User } from '../../../domain/User';
import { UserName } from '../../../domain/UserName';
import { UserTotalDistance } from '../../../domain/UserTotalDistance';
import { UserTotalTime } from '../../../domain/UserTotalTime';
import { UserEntity } from '../../../entity/User.entity';

export class MysqlUserRepositoryMapper {
    static toDomain(entity: UserEntity): User {
        if (_.isNil(entity)) {
            return null;
        }

        return User.create(
            {
                name: UserName.create(entity.name).value,
                image: entity.image ? ImageUrl.create(entity.image).value : null,
                totalDistance: UserTotalDistance.create(entity.totalDistance).value,
                totalTime: UserTotalTime.create(entity.totalTime).value,
                status: entity.status,
                createdAt: entity.createdAt,
                updatedAt: entity.updatedAt,
            },
            entity.id,
        ).value;
    }

    static toDomains(entities: UserEntity[]): User[] {
        return _.map(entities, this.toDomain);
    }

    static toEntity(user: User): UserEntity {
        if (_.isNil(user)) {
            return null;
        }

        const entity: UserEntity = {
            id: user.id,
            name: user.name.value,
            image: user.image.value,
            totalDistance: user.totalDistance.value,
            totalTime: user.totalTime.value,
            status: user.status,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            walkways: undefined,
            walks: undefined,
            reviews: undefined,
            pins: undefined,
        };

        return entity;
    }
}
