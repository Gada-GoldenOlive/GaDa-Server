/**
 * 'HIDDEN': 히든 배지 (ex: 히든 배지는 안 보이게 처리된 상태)
 * 'NON_ACHIEVE': 일반적으로 노출되는 배지 상태 (달성 전)
 * 'ACHIEVE': 달성한 배지
 * 'DELETE': 삭제된 배지 (사용자 기록 삭제 X, 배지 자체가 삭제)
 * 
 * 더 추가 가능
 */
export type ACHIEVE_STATUS = 'HIDDEN' | 'NON_ACHIEVE' | 'ACHIEVE' | 'DELETE';

export enum AchieveStatus {
    HIDDEN = 'HIDDEN',
    NON_ACHIEVE = 'NON_ACHIEVE',
    ACHIEVE = 'ACHIEVE',
    DELETE = 'DELETE',
}
