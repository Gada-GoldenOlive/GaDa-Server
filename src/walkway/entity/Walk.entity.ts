import { Column, Entity, Index, ManyToOne} from 'typeorm';

import { UserEntity } from '../../user/entity/User.entity';
import { CoreEntity } from '../../common/entity/Core.entity';
import { WalkwayEntity } from './Walkway.entity';
import { WalkStatus, WALK_STATUS } from '../domain/Walk/WalkStatus';
import { WalkFinishStatus, WALK_FINISH_STATUS } from '../domain/Walk/WalkFinishStatus';

@Entity('walk')
export class WalkEntity extends CoreEntity {
    @Column({
        nullable: false,
        type: 'int',
    })
    time: number;

    @Column({
        nullable: false,
        type: 'int',
    })
    distance: number;

    @Column({
        nullable: false,
        type: 'enum',
        enum: WalkFinishStatus,
        default: WalkFinishStatus.UNFINISHED,
    })
    @Index()
    finishStatus: WALK_FINISH_STATUS;

    @Column({
        nullable: false,
        type: 'enum',
        enum: WalkStatus,
        default: WalkStatus.NORMAL,
    })
    @Index()
    status: WALK_STATUS;

    @ManyToOne(() => UserEntity, (userEntity) => userEntity.walks)
    user: UserEntity;

    @ManyToOne(() => WalkwayEntity, (walkwayEntity) => walkwayEntity.walks)
    walkway: WalkwayEntity;   
}
