import { Column, Entity, Index } from 'typeorm';

import { CoreEntity } from '../../common/entity/Core.entity';
import { BadgeStatus, BADGE_STATUS } from '../domain/Badge/BadgeStatus';

@Entity('badge')
export class BadgeEntity extends CoreEntity {
	@Column({
		nullable: false,
        type: 'varchar',
        length: 50,
    })
    title: string;

    @Column({
        nullable: true,
        type: 'varchar',
    })
    image: string;

	@Column({
        nullable: false,
        type: 'enum',
        enum: BadgeStatus,
        default: BadgeStatus.LOCKED,
    })
    @Index()
    status: BADGE_STATUS;
}
