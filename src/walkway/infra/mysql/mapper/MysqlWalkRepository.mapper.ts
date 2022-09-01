import _ from 'lodash';

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
            createdAt: walk.createdAt,
            updatedAt: walk.updatedAt,
        };

        return entity;
    }
}
