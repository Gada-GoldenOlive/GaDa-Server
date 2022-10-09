import _ from 'lodash';

import { MysqlReviewRepositoryMapper } from '../../../../review/infra/mysql/mapper/MysqlReviewRepositoryMapper';
import { MysqlUserRepositoryMapper } from '../../../../user/infra/mysql/mapper/MysqlUserRepositoryMapper';
import { Walk } from '../../../domain/Walk/Walk';
import { WalkDistance } from '../../../domain/Walk/WalkDistance';
import { WalkPinCount } from '../../../domain/Walk/WalkPinCount';
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
                distance: WalkDistance.create(entity.distance).value,
                time: WalkTime.create(entity.time).value,
                pinCount: WalkPinCount.create(entity.pinCount).value,
                finishStatus: entity.finishStatus,
                walkway: MysqlWalkwayRepositoryMapper.toDomain(entity.walkway),
                user: MysqlUserRepositoryMapper.toDomain(entity.user),
                status: entity.status,
                createdAt: entity.createdAt,
                updatedAt: entity.updatedAt,
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

        const entity = new WalkEntity();

        entity.id = walk.id;
        entity.distance = walk.distance.value;
        entity.time = walk.time.value;
        entity.pinCount = walk.pinCount.value;
        entity.finishStatus = walk.finishStatus;
        entity.status = walk.status;
        entity.user = MysqlUserRepositoryMapper.toEntity(walk.user);
        entity.walkway = MysqlWalkwayRepositoryMapper.toEntity(walk.walkway);
        entity.createdAt = walk.createdAt;
        entity.updatedAt = walk.updatedAt;

        return entity;
    }
}
