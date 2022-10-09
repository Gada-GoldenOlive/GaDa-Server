import { Friend } from '../domain/Friend/Friend';
import { FindAllFriendOptions } from './mysql/MysqlFriendRepository';

export const FRIEND_REPOSITORY = 'FRIEND_REPOSITORY';

export interface IFriendRepository {
    findOne(id: string): Promise<Friend>;
    findAll(options: FindAllFriendOptions): Promise<Friend[]>;
    save(friend: Friend): Promise<boolean>;
}
