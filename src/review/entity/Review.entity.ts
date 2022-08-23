import { Column, Entity, Index, ManyToOne, OneToMany } from 'typeorm';

import { CoreEntity } from '../../common/entity/Core.entity';
import { LikeEntity } from '../../like/entity/LikeEntity';
import { UserEntity } from '../../user/entity/User.entity';
import { WalkwayEntity } from '../../walkway/entity/Walkway.entity';
import { ReviewStatus, REVIEW_STATUS } from '../domain/Review/ReviewStatus';
import { VEHCILE_STATUS, Vehicle } from '../domain/Review/Vehicle';

@Entity('review')
export class ReviewEntity extends CoreEntity {
    @Column({
        nullable: false,
        type: 'varchar',
        length: 30,
    })
    title: string;

    @Column({
        nullable: true,
        type: 'enum',
        enum: Vehicle,
        default: Vehicle.MANUAL,
    })
    @Index()
    vehicle: VEHCILE_STATUS;

    @Column({
        nullable: false,
        default: 5,
    })
    star: number;

    @Column({
        nullable: true,
        type: 'varchar',
    })
    content: string;
    
    @Column({
        nullable: true,
        type: 'varchar',
        length: 3000,
    })
    image: string;

    @Column({
        nullable: false,
        type: 'enum',
        enum: ReviewStatus,
        default: ReviewStatus.NORMAL,
    })
    @Index()
    status: REVIEW_STATUS;

    @ManyToOne(() => WalkwayEntity, (walkwayEntity) => walkwayEntity.reviews)
    walkway: WalkwayEntity;

    @ManyToOne(() => UserEntity, (userEntity) => userEntity.reviews)
    user: UserEntity;

    @OneToMany(() => LikeEntity, (likeEntity) => likeEntity.user)
    likes: LikeEntity[];
}
