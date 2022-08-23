import { Column, Entity, Index, ManyToOne } from "typeorm";

import { CoreEntity } from "../../common/entity/Core.entity";
import { ReviewEntity } from "./Review.entity";
import { UserEntity } from "../../user/entity/User.entity";
import { LikeStatus, LIKE_STATUS } from '../domain/Like/LikeStatus';

@Entity('like')
export class LikeEntity extends CoreEntity {
    @Column({
        nullable: false,
        type: 'varchar',
        length: 300,
    })
    content: string;

    @Column({
        nullable: false,
        type: 'enum',
        enum: LikeStatus,
        default: LikeStatus.NORMAL,
    })
    @Index()
    status: LIKE_STATUS;

    @ManyToOne(() => ReviewEntity, (reviewEntity) => reviewEntity.likes, { nullable: false })
    review: ReviewEntity;

    @ManyToOne(() => UserEntity, (userEntity) => userEntity.likes, { nullable: false })
    user: UserEntity;
}
