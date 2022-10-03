import { Column, Entity, Index, OneToOne, OneToMany, JoinColumn } from 'typeorm';

import { CoreEntity } from '../../common/entity/Core.entity';
import { WalkEntity } from '../../walkway/entity/Walk.entity';
import { ReviewStatus, REVIEW_STATUS } from '../domain/Review/ReviewStatus';
import { VEHCILE_STATUS, Vehicle } from '../domain/Review/Vehicle';
import { LikeEntity } from './Like.entity';
import { ReviewImageEntity } from './ReviewImage.entity';

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

    @OneToOne(() => WalkEntity)
    @JoinColumn()
    walk: WalkEntity;

    @OneToMany(() => LikeEntity, (likeEntity) => likeEntity.user)
    likes: LikeEntity[];

    @OneToMany(() => ReviewImageEntity, (reviewImageEntity) => reviewImageEntity.review)
    images: ReviewImageEntity[];
}
