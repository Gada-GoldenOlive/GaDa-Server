import { Walkway } from '../domain/Walkway/Walkway';
import { Point } from '../domain/Walkway/WalkwayStartPoint';

export const WALKWAY_REPOSITORY = Symbol('WALKWAY_REPOSITORY');

export interface IWalkwayRepository {
    findOne(id: string): Promise<Walkway>;
    findAll(coordinates: Point, userId: string): Promise<Walkway[]>;
    save(walkway: Walkway): Promise<boolean>;
    saveAll(walkways: Walkway[]): Promise<boolean>;
}
