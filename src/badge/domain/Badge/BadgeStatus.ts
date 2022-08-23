/**
 * 'LOCKED': 아직 잠긴 배지 (ex: 핀 5개 달성! 전에 핀 10개 달성 배지는 안 보이게 처리된 상태)
 * 'NON_ACHIEVE': 일반적으로 노출되는 배지 상태 (달성 전)
 * 혹은 잠금 해제된 배지 (ex: 핀 5개 달성! 배지 획득 후 핀 10개 달성 배지 오픈되었을 때 보이는 상태)
 * 'ACHIEVE': 달성한 배지
 * 'DELETE': 삭제된 배지 (사용자 기록 삭제 X, 배지 자체가 삭제)
 * 
 * 더 추가 가능
 */
export type BADGE_STATUS = 'LOCKED' | 'NON_ACHIEVE' | 'ACHIEVED' | 'DELETE';

export enum BadgeStatus {
	LOCKED = 'LOCKED',
	NON_ACHIEVE = 'NON_ACHIEVE',
	ACHIEVE = 'ACHIEVE',
    DELETE = 'DELETE',
}
