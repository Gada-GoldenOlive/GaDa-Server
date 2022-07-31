import { UserEntity } from 'src/user/entity/User.entity';
import { Column, Entity, ManyToOne} from 'typeorm';
import { CoreEntity } from '../../common/entity/Core.entity';
import { WalkwayEntity } from './Walkway.entity';

@Entity('walk')
export class WalkEntity extends CoreEntity {
    @Column({
        nullable: false,
        type: 'int',
    })
    walkTime: number;

	@Column({
        nullable: false,
        type: 'int',
    })
    walkDistance: number;

    @Column({
        nullable: true,
        type: 'boolean',
    })
    isFinished: boolean;

	@ManyToOne(() => UserEntity, (userEntity) => userEntity.walks)
	user: UserEntity;

	@ManyToOne(() => WalkwayEntity, (walkwayEntity) => walkwayEntity.walks)
	walkway: WalkEntity;
	
}