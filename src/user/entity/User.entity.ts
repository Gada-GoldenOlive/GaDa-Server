import { Column, Entity, Index, OneToMany } from 'typeorm';

import { WalkEntity } from 'src/walkway/entity/Walk.entity';
import { WalkwayEntity } from 'src/walkway/entity/Walkway.entity';
import { CoreEntity } from '../../common/entity/Core.entity';
import { ReviewEntity } from '../../review/entity/Review.entity';
import { PinEntity } from '../../pin/entity/Pin.entity';
import { UserStatus, USER_STATUS } from '../domain/User/UserStatus';
import { LikeEntity } from '../../review/entity/Like.entity';
import { CommentEntity } from '../../pin/entity/Comment.entity';

@Entity('user')
export class UserEntity extends CoreEntity {
    @Column({
        nullable: false,
        type: 'varchar',
        length: 20,
    })
    userId: string;

    @Column({
        nullable: false,
        type: 'varchar',
        length: 20,
    })
    password: string;
    
    @Column({
        nullable: false,
        type: 'varchar',
        length: 17,
    })
    name: string;

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

    @Column({
        nullable: false,
        type: 'enum',
        enum: UserStatus,
        default: UserStatus.NORMAL,
    })
    @Index()
    status: USER_STATUS;

    @OneToMany(() => WalkwayEntity, (walkwayEntity) => walkwayEntity.user)
    walkways: WalkwayEntity[];

    @OneToMany(() => WalkEntity, (walkEntity) => walkEntity.user)
    walks: WalkEntity[];

    @OneToMany(() => ReviewEntity, (reviewEntity) => reviewEntity.user)
    reviews: ReviewEntity[];

    @OneToMany(() => PinEntity, (pinEntity) => pinEntity.user)
    pins: PinEntity[];

    @OneToMany(() => LikeEntity, (likeEntity) => likeEntity.user)
    likes: LikeEntity[];

    @OneToMany(() => CommentEntity, (commentEntity) => commentEntity.user)
    comments: CommentEntity[];
}
