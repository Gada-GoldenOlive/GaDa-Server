import { WalkwayDistance, WALKWAY_DISTANCE_CANNOT_BE_NEGATIVE } from './WalkwayDistance';

describe('WalkwayDistance', () => {
    const walkwayDistanceNumber = 300;

    it('WalkwayDistance create 성공', () => {
        const WalkwayDistanceOrError = WalkwayDistance.create(walkwayDistanceNumber);

        expect(WalkwayDistanceOrError.isSuccess).toBeTruthy();
        expect(WalkwayDistanceOrError.value.value).toBe(walkwayDistanceNumber);
    })

    it('산책로의 총 길이(distance)는 음수일 수 없다.', () => {
        const WalkwayDistanceWithNegative = -1;

        const WalkwayDistanceOrErrorWithNegative = WalkwayDistance.create(WalkwayDistanceWithNegative);

        expect(WalkwayDistanceOrErrorWithNegative.isFailure).toBeTruthy();
        expect(WalkwayDistanceOrErrorWithNegative.errorValue()).toBe(WALKWAY_DISTANCE_CANNOT_BE_NEGATIVE);
    })
});
