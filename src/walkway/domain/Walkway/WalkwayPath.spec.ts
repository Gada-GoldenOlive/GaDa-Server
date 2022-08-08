import { LineString } from 'geojson';

import { WalkwayPath, WALKWAY_PATH_SHOULD_NOT_BE_EMPTY } from './WalkwayPath';

describe('WalkwayPath', () => {
    const walkwayPathLineString: LineString = {
        'type': 'LineString',
        'coordinates': [[100, 40], [105, 45], [110, 55]],
    }

    it('WalkwayPath create 성공', () => {
        const WalkwayPathOrError = WalkwayPath.create(walkwayPathLineString);

        expect(WalkwayPathOrError.isSuccess).toBeTruthy();
        expect(WalkwayPathOrError.value.value).toBe(walkwayPathLineString);
    })

    it('산책로의 경로 좌표가 하나도 없다면 create는 실패해야한다.', () => {
        const walkwayPathOrErrorWithEmptyCoordinates = WalkwayPath.create({
            'type': 'LineString',
            'coordinates': [],
        });

        expect(walkwayPathOrErrorWithEmptyCoordinates.isFailure).toBeTruthy();
        expect(walkwayPathOrErrorWithEmptyCoordinates.errorValue()).toBe(WALKWAY_PATH_SHOULD_NOT_BE_EMPTY);
    })
})
