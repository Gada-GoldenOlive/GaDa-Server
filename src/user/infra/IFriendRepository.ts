import { Friend } from '../domain/Friend/Friend';
import {FindAllFriendOptions, FindOneFriendOptions} from './mysql/MysqlFriendRepository';

export const FRIEND_REPOSITORY = 'FRIEND_REPOSITORY';

export interface IFriendRepository {
    findOne(options: FindOneFriendOptions): Promise<Friend>;
    findAll(options: FindAllFriendOptions): Promise<Friend[]>;
    save(friend: Friend): Promise<boolean>;
}
