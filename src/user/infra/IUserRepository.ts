import { User } from '../domain/User/User';
import { FindAllUserSearchOptions, FindOneUserOptions } from './mysql/MysqlUserRepository';

export const USER_REPOSITORY = 'USER_REPOSITORY';

export interface IUserRepository {
    findOne(options: FindOneUserOptions): Promise<User>;
    save(user: User): Promise<boolean>;
    findAll(options: FindAllUserSearchOptions): Promise<User[]>;
}
