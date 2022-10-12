import _ from 'lodash';

import { ImageUrl } from '../../../../common/domain/Image/ImageUrl';
import { User } from '../../../domain/User/User';
import { UserGoalDistance } from '../../../domain/User/UserGoalDistance';
import { UserGoalTime } from '../../../domain/User/UserGoalTime';
import { UserLoginId } from '../../../domain/User/UserLoginId';
import { UserName } from '../../../domain/User/UserName';
import { UserPassword } from '../../../domain/User/UserPassword';
import { UserRefreshToken } from '../../../domain/User/UserRefreshToken';
import { UserTotalDistance } from '../../../domain/User/UserTotalDistance';
import { UserTotalTime } from '../../../domain/User/UserTotalTime';
import { UserWeekDistance } from '../../../domain/User/UserWeekDistance';
import { UserWeekTime } from '../../../domain/User/UserWeekTime';
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
                weekDistance: UserWeekDistance.create(entity.weekDistance).value,
                weekTime: UserWeekTime.create(entity.weekTime).value,
                status: entity.status,
                refreshToken: entity.refreshToken ? UserRefreshToken.create(entity.refreshToken).value : null,
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

        const entity = new UserEntity();
        entity.id = user.id;
        entity.name = user.name.value;
        entity.loginId = user.loginId.value;
        entity.password = user.password.value;
        entity.image = user.image ? user.image.value : null;
        entity.goalDistance = user.goalDistance ? user.goalDistance.value : null;
        entity.goalTime = user.goalTime ? user.goalTime.value : null;
        entity.totalDistance = user.totalDistance.value;
        entity.totalTime = user.totalTime.value;
        entity.weekDistance = user.weekDistance.value;
        entity.weekTime = user.weekTime.value;
        entity.refreshToken = user.refreshToken ? user.refreshToken.value : null;
        entity.status = user.status;
        entity.createdAt = user.createdAt;
        entity.updatedAt = user.updatedAt;

        return entity;
    }
}
