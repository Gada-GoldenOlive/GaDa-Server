import _ from 'lodash';

import { Like } from '../../../domain/Like/Like';
import { LikeEntity } from '../../../entity/Like.entity';
import { MysqlReviewRepositoryMapper } from './MysqlReviewRepositoryMapper';
import { MysqlUserRepositoryMapper } from '../../../../user/infra/mysql/mapper/MysqlUserRepositoryMapper';

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

    static toDomains(entities: LikeEntity[]): Like[] {
        return _.map(entities, (entity) => this.toDomain(entity));
    }

    static toEntity(like: Like): LikeEntity {
        if (_.isNil(like)) {
            return null;
        }

        const entity = new LikeEntity();
        entity.id = like.id;
        entity.user = MysqlUserRepositoryMapper.toEntity(like.user);
        entity.review = MysqlReviewRepositoryMapper.toEntity(like.review);
        entity.status = like.status;
        entity.createdAt = like.createdAt;
        entity.updatedAt = like.updatedAt;

        return entity;
    }
}
