import { UserTotalDistance, USER_TOTAL_DISTANCE_CANNOT_BE_NEGATIVE } from './UserTotalDistance';


describe('UserTotalDistance', () => {
    const startUserTotalDistanceNumber = 0;

    it('UserTotalDistance create 성공', () => {
        const UserTotalDistanceOrError = UserTotalDistance.create(startUserTotalDistanceNumber);

        expect(UserTotalDistanceOrError.isSuccess).toBeTruthy();
        expect(UserTotalDistanceOrError.value.value).toBe(startUserTotalDistanceNumber);
    });

    it('사용자가 달린 총 거리(total distance)는 음수일 수 없다.', () => {
        const UserTotalDistanceWithNegative = -1;

        const UserTotalDistanceOrErrorWithNegative = UserTotalDistance.create(UserTotalDistanceWithNegative);

        expect(UserTotalDistanceOrErrorWithNegative.isFailure).toBeTruthy();
        expect(UserTotalDistanceOrErrorWithNegative.errorValue()).toBe(USER_TOTAL_DISTANCE_CANNOT_BE_NEGATIVE);
    });
})