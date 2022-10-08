import { Friend } from '../domain/Friend/Friend';

export const FRIEND_REPOSITORY = 'FRIEND_REPOSITORY';

export interface IFriendRepository {
    findOne(id: string): Promise<Friend>;
    save(friend: Friend): Promise<boolean>;
}
