import { Walk } from "./Walk";
import { WalkDistance } from "./WalkDistance";
import { WalkFinishStatus } from "./WalkFinishStatus";
import { WalkTime } from "./WalkTime";

describe ('Walk', () => {
    const TEST_WALK_ID = 'test-walk-uuid';
    const walkTime = WalkTime.create(30).value;
    const walkDistance = WalkDistance.create(300).value;
    const createdAt = new Date();
    const updatedAt = new Date();

    it('Walk createNew 성공', () => {
        const walkOrError = Walk.createNew({
            time: walkTime,
            distance: walkDistance,
            isFinished: WalkFinishStatus.FINISHED,
        });

        expect(walkOrError.isSuccess).toBeTruthy();
        expect(walkOrError.value.id).toBeDefined();
        expect(walkOrError.value.time.value).toBe(walkTime.value);
        expect(walkOrError.value.distance.value).toBe(walkDistance.value);
        expect(walkOrError.value.isFinish).toBe(WalkFinishStatus.FINISHED);
    })

    it('Walk create 성공', () => {
        const walkOrError = Walk.create({
            time: walkTime,
            distance: walkDistance,
            isFinished: WalkFinishStatus.FINISHED,
            createdAt,
            updatedAt,
        }, TEST_WALK_ID);

        expect(walkOrError.isSuccess).toBeTruthy();
        expect(walkOrError.value.id).toBe(TEST_WALK_ID);
        expect(walkOrError.value.time.value).toBe(walkTime.value);
        expect(walkOrError.value.distance.value).toBe(walkDistance.value);
        expect(walkOrError.value.isFinish).toBe(WalkFinishStatus.FINISHED);
        expect(walkOrError.value.createdAt).toBe(createdAt);
        expect(walkOrError.value.updatedAt).toBe(updatedAt);
    })
})
