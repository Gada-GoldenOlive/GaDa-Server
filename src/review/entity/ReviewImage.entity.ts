import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { CoreEntity } from '../../common/entity/Core.entity';
import { ReviewEntity } from './Review.entity';

@Entity('image')
export class ReviewImageEntity extends CoreEntity {
  @Column({
    nullable: false,
  })
  url: string;

  @ManyToOne(() => ReviewEntity, review => review.images)
  @JoinColumn()
  review: ReviewEntity;
}
