import { Column, Entity, Index, ManyToOne } from "typeorm";

import { CoreEntity } from "../../common/entity/Core.entity";
import { PinEntity } from "./Pin.entity";
import { UserEntity } from "../../user/entity/User.entity";
import { CommentStatus, COMMENT_STATUS } from '../domain/Comment/CommentStatus';

@Entity('comment')
export class CommentEntity extends CoreEntity {
    @Column({
        nullable: false,
        type: 'varchar',
        length: 300,
    })
    content: string;

    @Column({
        nullable: false,
        type: 'enum',
        enum: CommentStatus,
        default: CommentStatus.NORMAL,
    })
    @Index()
    status: COMMENT_STATUS;

    @ManyToOne(() => PinEntity, (pinEntity) => pinEntity.comments, { nullable: false })
    pin: PinEntity;

    @ManyToOne(() => UserEntity, (userEntity) => userEntity.comments, { nullable: false })
    user: UserEntity;
}
