import { Column, Entity, Index, ManyToOne } from "typeorm";

import { CoreEntity } from "../../common/entity/Core.entity";
import { UserEntity } from "./User.entity";
import { FriendStatus, FRIEND_STATUS } from '../domain/Friend/FriendStatus';

@Entity('friend')
export class FriendEntity extends CoreEntity {
    @Column({
        nullable: false,
        type: 'enum',
        enum: FriendStatus,
        default: FriendStatus.NORMAL,
    })
    @Index()
    status: FRIEND_STATUS;

    @ManyToOne(() => UserEntity, (userEntity) => userEntity.friends, { nullable: false })
    user1: UserEntity;

    @ManyToOne(() => UserEntity, (userEntity) => userEntity.friends, { nullable: false })
    user2: UserEntity;
}
