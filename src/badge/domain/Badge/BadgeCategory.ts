/**
 * 피그마에 올라와 있는 순서대로 적어둠 (괄호 안은 code)
 * WALKWAY = 산책로 n개 달성! (THREE~HUNDRED) / 산책로 등록! (FIRST)
 * REVIEW = 리뷰 n개 달성! (THREE~HUNDRED)
 * WALKTIME = 산책 n시간 달성! (THREE~FIFTY) / 목표 시간 설정! (FIRST)
 * DISTANCE = 거리 n시간 달성! (THREE~FIFTY)
 * PIN = 핀작성 n개 달성! (THREE~HUNDRED)
 * FRIEND = 친구 n명 달성! (THREE~FIFTY) / 처음 친구 초대! (FIRST) / 친구를 이겼어요! (WIN) / 1위 달성! (BEST)
 * COMMENT = 댓글 n개 달성! (THREE~HUNDRED)
 * USER = 회원가입 완료! (FIRST)
 */
export type BADGE_CATEGORY = 'WALKWAY' | 'REVIEW' | 'WALKTIME' | 'DISTANCE' | 'PIN' | 'FRIEND' | 'USER' | 'COMMENT'
export enum BadgeCategory {
    WALKWAY = 'WALKWAY',
    REVIEW = 'REVIEW',
    WALKTIME = 'WALKTIME',
    DISTANCE = 'DISTANCE',
    PIN = 'PIN',
    FRIEND = 'FRIEND',
    USER = 'USER',
    COMMENT = 'COMMENT',
}
