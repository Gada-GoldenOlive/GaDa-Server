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

    it('WalkwayTitle에 null이나 undefined 값이 들어온다면 create는 실패해야한다.', () => {
        const walkwayTitleOrErrorWithNull = WalkwayTitle.create(null);
        const walkwayTitleOrErrorWithUndifined = WalkwayTitle.create(undefined);

        expect(walkwayTitleOrErrorWithNull.isFailure).toBeTruthy();
        expect(walkwayTitleOrErrorWithUndifined.isFailure).toBeTruthy();
        expect(walkwayTitleOrErrorWithNull.errorValue()).toBe(WALKWAY_TITLE_SHOULD_NOT_BE_EMPTY);
        expect(walkwayTitleOrErrorWithUndifined.errorValue()).toBe(WALKWAY_TITLE_SHOULD_NOT_BE_EMPTY);
    })
})
