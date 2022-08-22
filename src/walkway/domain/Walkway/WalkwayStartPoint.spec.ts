import { Point, WalkwayStartPoint } from './WalkwayStartPoint';

describe('WalkwayStartPoint', () => {
    const walkwayStartPoint: Point = {
        lat: 100,
        lng: 40,
    }

    it('WalkwayStartPoint create 성공', () => {
        const WalkwayStartPointOrError = WalkwayStartPoint.create(walkwayStartPoint);

        expect(WalkwayStartPointOrError.isSuccess).toBeTruthy();
        expect(WalkwayStartPointOrError.value.value).toBe(walkwayStartPoint);
    })
});
