import { Friend } from '../domain/Friend/Friend';

export const FRIEND_REPOSITORY = 'FRIEND_REPOSITORY';

export interface IFriendRepository {
    save(friend: Friend): Promise<boolean>;
}
