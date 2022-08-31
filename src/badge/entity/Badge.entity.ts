import { Column, Entity, Index, OneToMany } from 'typeorm';

import { CoreEntity } from '../../common/entity/Core.entity';
import { BadgeStatus, BADGE_STATUS } from '../domain/Badge/BadgeStatus';
import { AchieveEntity } from './AchieveEntity';

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
        default: BadgeStatus.NORMAL,
    })
    @Index()
    status: BADGE_STATUS;

	@OneToMany(() => AchieveEntity, (achieveEntity) => achieveEntity.badge)
	achieves: AchieveEntity[];
}
