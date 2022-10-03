import { BeforeInsert, Column, Entity, Index, OneToMany } from 'typeorm';
import { InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { WalkEntity } from 'src/walkway/entity/Walk.entity';
import { WalkwayEntity } from 'src/walkway/entity/Walkway.entity';
import { CoreEntity } from '../../common/entity/Core.entity';
import { PinEntity } from '../../pin/entity/Pin.entity';
import { UserStatus, USER_STATUS } from '../domain/User/UserStatus';
import { LikeEntity } from '../../review/entity/Like.entity';
import { CommentEntity } from '../../pin/entity/Comment.entity';
import { FriendEntity } from './Friend.entity';
import { AchieveEntity } from '../../badge/entity/AchieveEntity';
import { RecordEntity } from './Record.entity';


@Entity('user')
export class UserEntity extends CoreEntity {
    @Column({
        nullable: false,
        type: 'varchar',
        length: 20,
    })
    loginId: string; // NOTE: 로그인 시 유저가 입력하는 id

    @Column({
        nullable: false,
        type: 'varchar',
    })
    password: string;

    @BeforeInsert()
    private async hashing(): Promise<void> {
        if (this.password) {
            try {
                this.password = await bcrypt.hash(this.password, 10);
            } catch (e) {
                throw new InternalServerErrorException();
            }
        }
    }
    
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
    goalDistance: number;

    @Column({
        nullable: true,
        type: 'int',
    })
    goalTime: number;

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

    @Column({
        nullable: true,
        type: 'varchar',
    })
    refreshToken: string;

    @OneToMany(() => WalkwayEntity, (walkwayEntity) => walkwayEntity.user)
    walkways: WalkwayEntity[];

    @OneToMany(() => WalkEntity, (walkEntity) => walkEntity.user)
    walks: WalkEntity[];

    @OneToMany(() => PinEntity, (pinEntity) => pinEntity.user)
    pins: PinEntity[];

    @OneToMany(() => LikeEntity, (likeEntity) => likeEntity.user)
    likes: LikeEntity[];

    @OneToMany(() => CommentEntity, (commentEntity) => commentEntity.user)
    comments: CommentEntity[];

    @OneToMany(() => FriendEntity, (friendEntity) => friendEntity.user1)
    friendsOfUser1: FriendEntity[];

    @OneToMany(() => FriendEntity, (friendEntity) => friendEntity.user2)
    friendsOfUser2: FriendEntity[];

    @OneToMany(() => AchieveEntity, (achieveEntity) => achieveEntity.user)
    achieves: AchieveEntity[];

    @OneToMany(() => RecordEntity, (recordEntity) => recordEntity.user)
    records: RecordEntity[];
}
