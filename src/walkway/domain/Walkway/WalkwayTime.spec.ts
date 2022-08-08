import { WalkwayTime, WALKWAY_TIME_CANNOT_BE_NEGATIVE } from './WalkwayTime';

describe('WalkwayTime', () => {
    const walkwayTimeNumber = 30;

    it('WalkwayTime create 성공', () => {
        const WalkwayTimeOrError = WalkwayTime.create(walkwayTimeNumber);

        expect(WalkwayTimeOrError.isSuccess).toBeTruthy();
        expect(WalkwayTimeOrError.value.value).toBe(walkwayTimeNumber)
    })

    it('산책로의 소요시간(time)은 음수일 수 없다.', () => {
        const WalkwayTimeWithNegative = -1;

        const WalkwayTimeOrErrorWithNegative = WalkwayTime.create(WalkwayTimeWithNegative);

        expect(WalkwayTimeOrErrorWithNegative.isFailure).toBeTruthy();
        expect(WalkwayTimeOrErrorWithNegative.errorValue()).toBe(WALKWAY_TIME_CANNOT_BE_NEGATIVE);
    })
})
