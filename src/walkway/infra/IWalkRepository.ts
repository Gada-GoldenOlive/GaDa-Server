import { User } from '../../user/domain/User/User';
import { Walk } from '../domain/Walk/Walk';

export const WALK_REPOSITORY = Symbol('WALK_REPOSITORY');

export interface IWalkRepository {
    findAll(user: User): Promise<Walk[]>;
    findOne(id: string);
    save(walk: Walk): Promise<boolean>;
}
