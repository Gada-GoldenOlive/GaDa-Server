import { Column, Entity, Index, ManyToOne, OneToMany } from 'typeorm';

import { UserEntity } from '../../user/entity/User.entity';
import { CoreEntity } from '../../common/entity/Core.entity';
import { WalkEntity } from './Walk.entity';
import { PinEntity } from '../../pin/entity/Pin.entity';
import { WalkwayStatus, WALKWAY_STATUS } from '../domain/Walkway/WalkwayStatus';

@Entity('walkway')
export class WalkwayEntity extends CoreEntity {
    @Column({
        nullable: false,
        type: 'varchar',
        length: 30,
    })
    title: string;

    @Column({
        nullable: false,
        type: 'varchar',
    })
    address: string;

    @Column({
        nullable: false,
        type: 'float',
    })
    distance: number;

    @Column({
        nullable: false,
        type: 'int',
    })
    time: number;

    @Column({
        nullable: false,
        type: 'longtext',
    })
    path: string;

    @Index({ spatial: true })
    @Column({
        type: 'geometry',
        spatialFeatureType: 'point', 
        srid: 4326,
        nullable: false,
    }) 
    startPoint: string;

    @Index({ spatial: true })
    @Column({
        type: 'geometry',
        spatialFeatureType: 'point', 
        srid: 4326,
        nullable: false,
    }) 
    endPoint: string;

    @Column({
        nullable: false,
        type: 'enum',
        enum: WalkwayStatus,
        default: WalkwayStatus.NORMAL,
    })
    @Index()
    status: WALKWAY_STATUS

    @Column({
        nullable: true,
        type: 'varchar',
    })
    image: string;

    @ManyToOne(() => UserEntity, (userEntity) => userEntity.walkways)
    user: UserEntity;

    @OneToMany(() => WalkEntity, (walkEntity) => walkEntity.walkway)
    walks: WalkEntity[];

    @OneToMany(() => PinEntity, (pinEntity) => pinEntity.walkway)
    pins: PinEntity[];
}
