import _ from 'lodash';

import { ImageUrl } from '../../../../common/domain/Image/ImageUrl';
import { User } from '../../../../user/domain/User';
import { UserName } from '../../../../user/domain/UserName';
import { UserTotalDistance } from '../../../../user/domain/UserTotalDistance';
import { UserTotalTime } from '../../../../user/domain/UserTotalTime';
import { MysqlUserRepositoryMapper } from '../../../../user/infra/mysql/mapper/MysqlUserRepositoryMapper';
import { Walkway } from '../../../../walkway/domain/Walkway/Walkway';
import { WalkwayAddress } from '../../../../walkway/domain/Walkway/WalkwayAddress';
import { WalkwayDistance } from '../../../../walkway/domain/Walkway/WalkwayDistance';
import { WalkwayPath } from '../../../../walkway/domain/Walkway/WalkwayPath';
import { WalkwayStartPoint } from '../../../../walkway/domain/Walkway/WalkwayStartPoint';
import { WalkwayTime } from '../../../../walkway/domain/Walkway/WalkwayTime';
import { WalkwayTitle } from '../../../../walkway/domain/Walkway/WalkwayTitle';
import { MysqlWalkwayRepositoryMapper } from '../../../../walkway/infra/mysql/mapper/MysqlWalkwayRepository.mapper';
import { Pin } from '../../../domain/Pin';
import { PinContent } from '../../../domain/PinContent';
import { PinTitle } from '../../../domain/PinTitle';
import { PinEntity } from '../../../entity/Pin.entity';

export class MysqlPinRepositoryMapper {
    static toDomain(entity: PinEntity): Pin {
        if (_.isNil(entity)) {
            return null;
        }

        return Pin.create({
            title: PinTitle.create(entity.title).value,
            content: PinContent.create(entity.content).value,
            walkway: Walkway.create(
                {    
                    title: WalkwayTitle.create(entity.walkway.title).value,
                    address: WalkwayAddress.create(entity.walkway.address).value,
                    distance: WalkwayDistance.create(entity.walkway.distance).value,
                    time: WalkwayTime.create(entity.walkway.time).value,
                    path: WalkwayPath.create(MysqlWalkwayRepositoryMapper.convertToPath(entity.walkway.path)).value,
                    startPoint: WalkwayStartPoint.create(MysqlWalkwayRepositoryMapper.convertToPoint(entity.walkway.startPoint)).value,
                    status: entity.walkway.status,
                    user: MysqlUserRepositoryMapper.toDomain(entity.walkway.user),
                    createdAt: entity.walkway.createdAt,
                    updatedAt: entity.walkway.updatedAt,
                },
                entity.walkway.id,
            ).value,
            user: MysqlUserRepositoryMapper.toDomain(entity.user),
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
            }, entity.id).value;
    }

    static toDomains(entities: PinEntity[]): Pin[] {
        return _.map(entities, this.toDomain);
    }
}
