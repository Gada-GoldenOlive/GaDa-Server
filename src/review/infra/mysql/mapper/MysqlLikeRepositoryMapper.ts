import _ from 'lodash';
import { MysqlUserRepositoryMapper } from '../../../../user/infra/mysql/mapper/MysqlUserRepositoryMapper';

import { Like } from '../../../domain/Like/Like';
import { LikeEntity } from '../../../entity/Like.entity';
import { MysqlReviewRepositoryMapper } from './MysqlReviewRepositoryMapper';

export class MysqlLikeRepositoryMapper {
    static toDomain(entity: LikeEntity): Like {
        if (_.isNil(entity)) {
            return null;
        }

        return Like.create({
            review: MysqlReviewRepositoryMapper.toDomain(entity.review),
            user: MysqlUserRepositoryMapper.toDomain(entity.user),
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        },
        entity.id).value;
    }
}
