import { Point, WalkwayEndPoint } from './WalkwayEndPoint';

describe('WalkwayEndPoint', () => {
    const walkwayEndPoint: Point = {
        lat: 100,
        lng: 40,
    }

    it('WalkwayEndPoint create 성공', () => {
        const WalkwayEndPointOrError = WalkwayEndPoint.create(walkwayEndPoint);

        expect(WalkwayEndPointOrError.isSuccess).toBeTruthy();
        expect(WalkwayEndPointOrError.value.value).toBe(walkwayEndPoint);
    })
})
