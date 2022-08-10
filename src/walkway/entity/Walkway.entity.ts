import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

import { UserEntity } from '../../user/entity/User.entity';
import { CoreEntity } from '../../common/entity/Core.entity';
import { WalkEntity } from './Walk.entity';
import { PinEntity } from '../../pin/entity/Pin.entity';
import { Point } from '../domain/Walkway/WalkwayPath';

@Entity('walkway')
export class WalkwayEntity extends CoreEntity {
    @Column({
        nullable: false,
        type: 'varchar',
        length: 20,
    })
    title: string;

    @Column({
        nullable: false,
        type: 'varchar',
    })
    address: string;

    @Column({
        nullable: true,
        type: 'int',
    })
    distance: number;

    @Column({
        nullable: true,
        type: 'int',
    })
    time: number;

    @Column({
        nullable: true,
        type: 'json',
    })
    path: Point[];

    @Column({
        nullable: false,
        type: 'varchar',
        length: 17,
    })
    creator: string;

    @ManyToOne(() => UserEntity, (userEntity) => userEntity.walkways)
    user: UserEntity;

    @OneToMany(() => WalkEntity, (walkEntity) => walkEntity.walkway)
    walks: WalkEntity[];

    @OneToMany(() => PinEntity, (pinEntity) => pinEntity.walkway)
    pins: PinEntity[];
}
