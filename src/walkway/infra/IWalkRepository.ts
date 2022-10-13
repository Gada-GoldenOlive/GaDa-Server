import { PaginationResult } from '../../common/pagination/PaginationResponse';
import { Walk } from '../domain/Walk/Walk';
import { GetAllWalkOptions } from './mysql/MysqlWalkRepository';

export const WALK_REPOSITORY = Symbol('WALK_REPOSITORY');

export interface IWalkRepository {
    getAll(options: GetAllWalkOptions): Promise<PaginationResult<Walk>>;
    getOne(id: string);
    save(walk: Walk): Promise<boolean>;
}
