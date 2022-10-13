import { User } from '../../user/domain/User/User';
import { Walk } from '../domain/Walk/Walk';
import { GetAllWalkOptions } from './mysql/MysqlWalkRepository';

export const WALK_REPOSITORY = Symbol('WALK_REPOSITORY');

export interface IWalkRepository {
    getAll(options: GetAllWalkOptions): Promise<Walk[]>;
    getOne(id: string);
    save(walk: Walk): Promise<boolean>;
}
