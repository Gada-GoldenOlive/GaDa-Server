import _ from 'lodash';

import { MysqlReviewRepositoryMapper } from '../../../../review/infra/mysql/mapper/MysqlReviewRepositoryMapper';
import { MysqlUserRepositoryMapper } from '../../../../user/infra/mysql/mapper/MysqlUserRepositoryMapper';
import { Walk } from '../../../domain/Walk/Walk';
import { WalkDistance } from '../../../domain/Walk/WalkDistance';
import { WalkTime } from '../../../domain/Walk/WalkTime';
import { WalkEntity } from '../../../entity/Walk.entity';
import { MysqlWalkwayRepositoryMapper } from './MysqlWalkwayRepository.mapper';

export class MysqlWalkRepositoryMapper {
    static toDomain(entity: WalkEntity): Walk {
        if (_.isNil(entity)) {
            return null;
        }

        return Walk.create(
            {
                time: WalkTime.create(entity.time).value,
                distance: WalkDistance.create(entity.distance).value,
                finishStatus: entity.finishStatus,
                walkway: MysqlWalkwayRepositoryMapper.toDomain(entity.walkway),
                user: MysqlUserRepositoryMapper.toDomain(entity.user),
                createdAt: entity.createdAt,
                updatedAt: entity.updatedAt,
                status: entity.status,
            },
            entity.id
        ).value;
    }

    static toDomains(entities: WalkEntity[]): Walk[] {
        return _.map(entities, (entity) => this.toDomain(entity));
    }

    static toEntity(walk: Walk): WalkEntity {
        if (_.isNil(walk)) {
            return null;
        }

        const entity: WalkEntity = {
            id: walk.id,
            distance: walk.distance.value,
            time: walk.time.value,
            finishStatus: walk.finishStatus,
            status: walk.status,
            user: MysqlUserRepositoryMapper.toEntity(walk.user),
            walkway: MysqlWalkwayRepositoryMapper.toEntity(walk.walkway),
            review: MysqlReviewRepositoryMapper.toEntity(walk.review),
            createdAt: walk.createdAt,
            updatedAt: walk.updatedAt,
        };

        return entity;
    }

    static toDomain(entity: WalkEntity): Walk {
        if (_.isNil(entity)) {
            return null;
        }

        return Walk.create(
            {
                distance: WalkDistance.create(entity.distance).value,
                time: WalkTime.create(entity.time).value,
                finishStatus: entity.finishStatus,
                walkway: MysqlWalkwayRepositoryMapper.toDomain(entity.walkway),
                user: MysqlUserRepositoryMapper.toDomain(entity.user),
                review: MysqlReviewRepositoryMapper.toDomain(entity.review),
                status: entity.status,
                createdAt: entity.createdAt,
                updatedAt: entity.updatedAt,
            },
            entity.id
        ).value;
    }
}
