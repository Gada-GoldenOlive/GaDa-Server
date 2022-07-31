import { Column, Entity, Index, ManyToOne } from 'typeorm';
import { CoreEntity } from '../../common/entity/Core.entity';
import { UserEntity } from '../../user/entity/User.entity';
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

    @ManyToOne(() => UserEntity, (userEntity) => userEntity.reviews)
    user: UserEntity;

    /**
     * title, content, star, vehicle, imgae, walkwayId, userId
     */
}