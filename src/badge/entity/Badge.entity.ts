import { Column, Entity, Index, OneToMany } from 'typeorm';

import { CoreEntity } from '../../common/entity/Core.entity';
import { BadgeCategory, BADGE_CATEGORY } from '../domain/Badge/BadgeCategory';
import { BadgeCode, BADGE_CODE } from '../domain/Badge/BadgeCode';
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
        enum: BadgeCategory,
        default: BadgeCategory.USER,
    })
    category: BADGE_CATEGORY;

    @Column({
        nullable: false,
        type: 'enum',
        enum: BadgeCode,
        default: BadgeCode.THREE,
    })
    code: BADGE_CODE;

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
