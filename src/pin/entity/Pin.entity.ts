import { Column, Entity, Index, ManyToOne } from 'typeorm';

import { CoreEntity } from '../../common/entity/Core.entity';
import { UserEntity } from '../../user/entity/User.entity';
import { WalkwayEntity } from '../../walkway/entity/Walkway.entity';
import { PinStatus, PIN_STATUS } from '../domain/PinStatus';

@Entity('pin')
export class PinEntity extends CoreEntity {
    @Column({
        nullable: false,
        type: 'varchar',
        length: 20,
    })
    title: string;
    
    @Column({
        nullable: true,
        type: 'varchar',
        length: 300,
    })
    content: string;

    @Column({
        nullable: true,
        type: 'varchar',
    })
    image: string;

    @Column({
        nullable: false,
        type: 'varchar',
    })
    latitude: string; // NOTE: 위도

    @Column({
        nullable: false,
        type: 'varchar',
    })
    longitude: string; // NOTE: 경도

    @Column({
        nullable: false,
        type: 'enum',
        enum: PinStatus,
        default: PinStatus.NORMAL,
    })
    @Index()
    status: PIN_STATUS;

    @ManyToOne(() => WalkwayEntity, (walkwayEntity) => walkwayEntity.pins, { nullable: false })
    walkway: WalkwayEntity;

    @ManyToOne(() => UserEntity, (userEntity) => userEntity.pins, { nullable: false })
    user: UserEntity;
}
