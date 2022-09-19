import { BadgeTitle, BADGE_TITLE_SHOULD_NOT_BE_EMPTY } from './BadgeTitle';

describe('BadgeTitle', () => {
    const badgeTitleString = '친구 20명 달성!';

    it('BadgeTitle create 성공', () => {
        const badgeTitleOrError = BadgeTitle.create(badgeTitleString);

        expect(badgeTitleOrError.isSuccess).toBeTruthy();
        expect(badgeTitleOrError.value.value).toBe(badgeTitleString);
    });

    it('badge title에는 빈 값이 들어갈 수 없다.', () => {
        const badgeTitleOrError = BadgeTitle.create('');

        expect(badgeTitleOrError.isFailure).toBeTruthy();
        expect(badgeTitleOrError.errorValue()).toBe(BADGE_TITLE_SHOULD_NOT_BE_EMPTY);
    });
});
