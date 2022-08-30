import _ from 'lodash';

import { ImageUrl } from '../../../../common/domain/Image/ImageUrl';
import { User } from '../../../domain/User/User';
import { UserId } from '../../../domain/User/UserId';
import { UserName } from '../../../domain/User/UserName';
import { UserPassword } from '../../../domain/User/UserPassword';
import { UserTotalDistance } from '../../../domain/User/UserTotalDistance';
import { UserTotalTime } from '../../../domain/User/UserTotalTime';
import { UserEntity } from '../../../entity/User.entity';

export class MysqlUserRepositoryMapper {
    static toDomain(entity: UserEntity): User {
        if (_.isNil(entity)) {
            return null;
        }

        const user= User.create(
            {
                userId: UserId.create(entity.userId).value,
                password: UserPassword.create(entity.password).value,
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

        return user;
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
            userId: user.userId.value,
            password: user.password.value,
            name: user.name.value,
            image: user.image ? user.image.value : null,
            totalDistance: user.totalDistance.value,
            totalTime: user.totalTime.value,
            status: user.status,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            walkways: undefined,
            walks: undefined,
            reviews: undefined,
            pins: undefined,
            likes: undefined,
            comments: undefined,
        };

        return entity;
    }
}
