import { User } from '../domain/User';

export const USER_REPOSITORY = 'USER_REPOSITORY';

export interface IUserRepository {
    findOne(id: string): Promise<User>;
    save(user: User): Promise<boolean>;
    findAll(): Promise<User[]>;
}
