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
                image: ImageUrl.create(entity.image).value,
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
}