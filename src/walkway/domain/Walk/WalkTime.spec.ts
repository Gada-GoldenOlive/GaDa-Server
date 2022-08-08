import { WalkTime, WALK_TIME_CANNOT_BE_NEGATIVE } from "./WalkTime";

describe('WalkTime', () => {
    const walkTimeNumber = 30;

    it('WalkTime create 성공', () => {
        const WalkTimeOrError = WalkTime.create(walkTimeNumber);

        expect(WalkTimeOrError.isSuccess).toBeTruthy();
        expect(WalkTimeOrError.value.value).toBe(walkTimeNumber);
    });

    it('산책 시간(walk time)은 음수일 수 없다.', () => {
        const WalkTimeWithNegative = -1;

        const WalkTimeOrErrorWithNegative = WalkTime.create(WalkTimeWithNegative);

        expect(WalkTimeOrErrorWithNegative.isFailure).toBeTruthy();
        expect(WalkTimeOrErrorWithNegative.errorValue()).toBe(WALK_TIME_CANNOT_BE_NEGATIVE);
    });
})
