import { Column, Entity, OneToMany } from 'typeorm';

import { WalkEntity } from 'src/walkway/entity/Walk.entity';
import { WalkwayEntity } from 'src/walkway/entity/Walkway.entity';
import { CoreEntity } from '../../common/entity/Core.entity';
import { ReviewEntity } from '../../review/entity/Review.entity';

@Entity('user')
export class UserEntity extends CoreEntity {
    @Column({
        nullable: false,
        type: 'varchar',
        length: 17,
    })
    name: string;

    @Column({
        nullable: true,
        type: 'int',
    })
    pinCount: number;

    @Column({
        nullable: true,
        type: 'varchar',
    })
    image: string;

    @Column({
        nullable: true,
        type: 'int',
    })
    totalDistance: number;

    @Column({
        nullable: true,
        type: 'int',
    })
    totalTime: number;

    @OneToMany(() => WalkwayEntity, (walkwayEntity) => walkwayEntity.user)
    walkways: WalkwayEntity[];

    @OneToMany(() => WalkEntity, (walkEntity) => walkEntity.user)
    walks: WalkEntity[];

    @OneToMany(() => ReviewEntity, (ReviewEntity) => ReviewEntity.user)
    reviews: ReviewEntity
}
