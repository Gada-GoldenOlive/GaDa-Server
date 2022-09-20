import _ from 'lodash';

import { ImageUrl } from '../../../../common/domain/Image/ImageUrl';
import { User } from '../../../domain/User/User';
import { UserGoalDistance } from '../../../domain/User/UserGoalDistance';
import { UserGoalTime } from '../../../domain/User/UserGoalTime';
import { UserLoginId } from '../../../domain/User/UserLoginId';
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

        const user = User.create(
            {
                loginId: UserLoginId.create(entity.loginId).value,
                password: UserPassword.create(entity.password).value,
                name: UserName.create(entity.name).value,
                image: entity.image ? ImageUrl.create(entity.image).value : null,
                goalDistance: UserGoalDistance.create(entity.goalDistance).value,
                goalTime: UserGoalTime.create(entity.goalTime).value,
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
            loginId: user.loginId.value,
            password: user.password.value,
            name: user.name.value,
            image: user.image ? user.image.value : null,
            goalDistance: user.goalDistance ? user.goalDistance.value : null,
            goalTime: user.goalTime ? user.goalTime.value : null,
            totalDistance: user.totalDistance.value,
            totalTime: user.totalTime.value,
            status: user.status,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            records: undefined,
            walkways: undefined,
            walks: undefined,
            pins: undefined,
            likes: undefined,
            comments: undefined,
            friendsOfUser1: undefined,
            friendsOfUser2: undefined,
            achieves: undefined,
        };

        return entity;
    }
}
