import { User } from '../domain/User/User';
import { FindOneUserOptions } from './mysql/MysqlUserRepository';

export const USER_REPOSITORY = 'USER_REPOSITORY';

export interface IUserRepository {
    findOne(options: FindOneUserOptions): Promise<User>;
    save(user: User): Promise<boolean>;
    findAll(): Promise<User[]>;
}
