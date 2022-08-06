import { WalkwayCreator, WALKWAY_CREATOR_SHOULD_NOT_BE_EMPTY } from './WalkwayCreator';

describe('WalkwayCreator', () => {
    const walkwayCreatorString = '서지니';

    it('WalkwayCreator create 성공', () => {
        const walkwayCreatorOrError = WalkwayCreator.create(walkwayCreatorString);

        expect(walkwayCreatorOrError.isSuccess).toBeTruthy();
        expect(walkwayCreatorOrError.value.value).toBe(walkwayCreatorString);
    });

    it('WalkwayCreator에 빈 값이 들어왔다면 create는 실패해야 한다.', () => {
        const walkwayCreatorOrError = WalkwayCreator.create('');

        expect(walkwayCreatorOrError.isFailure).toBeTruthy();
        expect(walkwayCreatorOrError.errorValue()).toBe(WALKWAY_CREATOR_SHOULD_NOT_BE_EMPTY);
    });

    it('WalkwayCreator에 null이나 undefined 값이 들어온다면 create는 실패해야한다.', () => {
        const walkwayCreatorOrErrorWithNull = WalkwayCreator.create(null);
        const walkwayCreatorOrErrorWithUndifined = WalkwayCreator.create(undefined);

        expect(walkwayCreatorOrErrorWithNull.isFailure).toBeTruthy();
        expect(walkwayCreatorOrErrorWithUndifined.isFailure).toBeTruthy();
        expect(walkwayCreatorOrErrorWithNull.errorValue()).toBe(WALKWAY_CREATOR_SHOULD_NOT_BE_EMPTY);
        expect(walkwayCreatorOrErrorWithUndifined.errorValue()).toBe(WALKWAY_CREATOR_SHOULD_NOT_BE_EMPTY);
    })
})