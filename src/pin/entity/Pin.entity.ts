import { Column, Entity } from 'typeorm';
import { CoreEntity } from '../../common/entity/Core.entity';
// import { WalkwayEntity } from '../../walkway/entity/Walkway.entity';

@Entity('pin')
export class PinEntity extends CoreEntity {
    @Column({
        nullable: false,
        type: 'varchar',
        length: 20,
    })
    title: string;
    
    @Column({
        nullable: true,
        type: 'varchar',
        length: 300,
    })
    content: string;

    @Column({
        nullable: true,
        type: 'varchar',
    })
    image: string;

    // TODO: walkway entity merge된 후에 주석 해제
    // @ManyToOne(() => WalkwayEntity, (walkwayEntity) => walkwayEntity.pins)
    // walkway: WalkwayEntity;
}