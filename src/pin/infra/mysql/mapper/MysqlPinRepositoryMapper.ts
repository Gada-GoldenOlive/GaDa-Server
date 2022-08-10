import _ from 'lodash';
import { ImageUrl } from '../../../../common/domain/Image/ImageUrl';
import { User } from '../../../../user/domain/User';
import { UserName } from '../../../../user/domain/UserName';
import { UserTotalDistance } from '../../../../user/domain/UserTotalDistance';
import { UserTotalTime } from '../../../../user/domain/UserTotalTime';
import { Walkway } from '../../../../walkway/domain/Walkway/Walkway';
import { WalkwayAddress } from '../../../../walkway/domain/Walkway/WalkwayAddress';
import { WalkwayDistance } from '../../../../walkway/domain/Walkway/WalkwayDistance';
import { WalkwayPath } from '../../../../walkway/domain/Walkway/WalkwayPath';
import { WalkwayTime } from '../../../../walkway/domain/Walkway/WalkwayTime';
import { WalkwayTitle } from '../../../../walkway/domain/Walkway/WalkwayTitle';
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
                    path: WalkwayPath.create(entity.walkway.path).value,
                    createdAt: entity.walkway.createdAt,
                    updatedAt: entity.walkway.updatedAt,
                },
                entity.walkway.id,
            ).value,
            user: User.create(
                {
                    name: UserName.create(entity.user.name).value,
                    image: ImageUrl.create(entity.user.image).value,
                    totalDistance: UserTotalDistance.create(entity.user.totalDistance).value,
                    totalTime: UserTotalTime.create(entity.user.totalTime).value,
                    createdAt: entity.user.createdAt,
                    updatedAt: entity.user.updatedAt,
                },
                entity.user.id,
            ).value,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
            }, entity.id).value;
    }

    static toDomains(entites: PinEntity[]): Pin[] {
        return _.map(entites, this.toDomain);
    }
}
