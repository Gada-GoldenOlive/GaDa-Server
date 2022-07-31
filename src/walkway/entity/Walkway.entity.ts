import { UserEntity } from 'src/user/entity/User.entity';
import { Column, Entity, Index, ManyToOne, OneToMany } from 'typeorm';
import { CoreEntity } from '../../common/entity/Core.entity';
import { WalkEntity } from './Walk.entity';

@Entity('walkway')
export class WalkwayEntity extends CoreEntity {
    @Column({
        nullable: false,
        type: 'varchar',
        length: 20,
    })
    title: string;

    @Column({
        nullable: false,
        type: 'varchar',
    })
    address: string;

    @Column({
        nullable: true,
        type: 'int',
    })
    distance: number;

    @Column({
        nullable: true,
        type: 'int',
    })
    time: number;

    @Column({
        nullable: true,
		type: 'linestring',
    })
    path: string;

	@Column({
        nullable: false,
        type: 'varchar',
        length: 17,
    })
    creator: string;

	@ManyToOne(() => UserEntity, (userEntity) => userEntity.walkways)
	user: UserEntity;

	@OneToMany(() => WalkEntity, (walkEntity) => walkEntity.walkway)
	walks: WalkEntity[];
}