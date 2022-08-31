import _ from 'lodash';

import { MysqlUserRepositoryMapper } from '../../../../user/infra/mysql/mapper/MysqlUserRepositoryMapper';
import { Walk } from '../../../domain/Walk/Walk';
import { WalkEntity } from '../../../entity/Walk.entity';
import { MysqlWalkwayRepositoryMapper } from './MysqlWalkwayRepository.mapper';

export class MysqlWalkRepositoryMapper {
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
