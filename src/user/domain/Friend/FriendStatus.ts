// REQUESTED : 친구 신청을 받음. 아직 읽지 않은 상태
// READ: 친구신청내역 페이지에서 친구 신청을 확인한 상태
// ACCEPTED: 친구신청내역 페이지에서 친구 신청을 수락한 상태
// REJECTED: 친구신청내역 페이지에서 친구 신청을 거절한 상태

export type FRIEND_STATUS = 'REQUESTED' | 'READ' | 'ACCEPTED' | 'REJECTED';

export enum FriendStatus {
    REQUESTED ='REQUESTED',
    READ = 'READ',
    ACCEPTED = 'ACCEPTED',
    REJECTED = 'REJECTED',
}
