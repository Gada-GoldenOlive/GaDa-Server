import { Point, WalkwayStartPoint } from './WalkwayStartPoint';

describe('WalkwayStartPoint', () => {
    const walkwayPathLineString: Point = {
        lat: 100,
        lng: 40,
    }

    it('WalkwayStartPoint create 성공', () => {
        const WalkwayStartPointOrError = WalkwayStartPoint.create(walkwayPathLineString);

        expect(WalkwayStartPointOrError.isSuccess).toBeTruthy();
        expect(WalkwayStartPointOrError.value.value).toBe(walkwayPathLineString);
    })
})
