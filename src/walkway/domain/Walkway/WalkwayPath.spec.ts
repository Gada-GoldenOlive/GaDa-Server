import { WalkwayPath, WALKWAY_PATH_SHOULD_NOT_BE_EMPTY } from './WalkwayPath';
import { Point } from './WalkwayStartPoint';

describe('WalkwayPath', () => {
    const walkwayPathLineString: Point[] = [
        {lat: 100, lng: 40}, 
        {lat: 100, lng: 40},
    ]

    it('WalkwayPath create 성공', () => {
        const WalkwayPathOrError = WalkwayPath.create(walkwayPathLineString);

        expect(WalkwayPathOrError.isSuccess).toBeTruthy();
        expect(WalkwayPathOrError.value.value).toBe(walkwayPathLineString);
    })

    it('산책로의 경로 좌표가 하나도 없다면 create는 실패해야한다.', () => {
        const walkwayPathOrErrorWithEmptyCoordinates = WalkwayPath.create([]);

        expect(walkwayPathOrErrorWithEmptyCoordinates.isFailure).toBeTruthy();
        expect(walkwayPathOrErrorWithEmptyCoordinates.errorValue()).toBe(WALKWAY_PATH_SHOULD_NOT_BE_EMPTY);
    })
});
