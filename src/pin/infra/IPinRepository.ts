import { Pin } from '../domain/Pin/Pin';
import { GetAllPinOptions } from './mysql/MysqlPinRepository';

export const PIN_REPOSITORY = Symbol('PIN_REPOSITORY');

export interface IPinRepository {
    findOne(id: string): Promise<Pin>;
    save(pin: Pin): Promise<boolean>;
    findAll(options: GetAllPinOptions): Promise<Pin[]>;
}
