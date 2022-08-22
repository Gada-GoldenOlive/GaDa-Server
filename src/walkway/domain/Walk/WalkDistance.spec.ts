import { WalkDistance, WALK_DISTANCE_CANNOT_BE_NEGATIVE } from "./WalkDistance";

describe('WalkDistance', () => {
    const walkDistanceNumber = 300;

    it('WalkDistance create 성공', () => {
        const WalkDistanceOrError = WalkDistance.create(walkDistanceNumber);

        expect(WalkDistanceOrError.isSuccess).toBeTruthy();
        expect(WalkDistanceOrError.value.value).toBe(walkDistanceNumber);
    });

    it('산책 거리(walk distance)는 음수일 수 없다.', () => {
        const WalkDistanceWithNegative = -1;

        const WalkDistanceOrErrorWithNegative = WalkDistance.create(WalkDistanceWithNegative);

        expect(WalkDistanceOrErrorWithNegative.isFailure).toBeTruthy();
        expect(WalkDistanceOrErrorWithNegative.errorValue()).toBe(WALK_DISTANCE_CANNOT_BE_NEGATIVE);
    });
});
