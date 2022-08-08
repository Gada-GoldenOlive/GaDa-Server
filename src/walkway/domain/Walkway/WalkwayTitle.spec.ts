import { WalkwayTitle, WALKWAY_TITLE_SHOULD_NOT_BE_EMPTY } from './WalkwayTitle';

describe('WalkwayTitle', () => {
    const walkwayTitleString = '서지니 집 가는 길';

    it('WalkwayTitle create 성공', () => {
        const walkwayTitleOrError = WalkwayTitle.create(walkwayTitleString);

        expect(walkwayTitleOrError.isSuccess).toBeTruthy();
        expect(walkwayTitleOrError.value.value).toBe(walkwayTitleString);
    });

    it('WalkwayTitle에 빈 값이 들어왔다면 create는 실패해야 한다.', () => {
        const walkwayTitleOrError = WalkwayTitle.create('');

        expect(walkwayTitleOrError.isFailure).toBeTruthy();
        expect(walkwayTitleOrError.errorValue()).toBe(WALKWAY_TITLE_SHOULD_NOT_BE_EMPTY);
    });
})
