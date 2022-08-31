import { Column, Entity, Index, ManyToOne } from 'typeorm';
import { CoreEntity } from '../../common/entity/Core.entity';
import { UserEntity } from '../../user/entity/User.entity';
import { AchieveStatus, ACHIEVE_STATUS } from '../domain/Achieve/AchieveStatus';
import { BadgeEntity } from './Badge.entity';

@Entity('achieve')
export class AchieveEntity extends CoreEntity {
	@Column({
		nullable: false,
		type: 'enum',
		enum: AchieveStatus,
		default: AchieveStatus.NON_ACHIEVE,
	})
	@Index()
	status: ACHIEVE_STATUS;

	@ManyToOne(() => BadgeEntity, (badgeEntity) => badgeEntity.achieves, { nullable: false })
	badge: BadgeEntity;

	@ManyToOne(() => UserEntity, (userEntity) => userEntity.achieves, { nullable: false })
	user: UserEntity;
}
