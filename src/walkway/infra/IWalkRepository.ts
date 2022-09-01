import { Walk } from '../domain/Walk/Walk';

export const WALK_REPOSITORY = Symbol('WALK_REPOSITORY');

export interface IWalkRepository {
    findAll(userId: string): Promise<Walk[]>;
    save(walk: Walk): Promise<boolean>;
}
