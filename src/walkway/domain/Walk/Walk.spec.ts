import { Walk } from "./Walk";
import { WalkDistance } from "./WalkDistance";
import { WalkIsFinished } from "./WalkIsFinished";
import { WalkTime } from "./WalkTime";

describe ('Walk', () => {
    const TEST_WALK_ID = 'test-walk-uuid';
    const walkTime = WalkTime.create(30).value;
    const walkDistance = WalkDistance.create(300).value;
    const walkIsFinished = WalkIsFinished.create(true).value;
    const createdAt = new Date();
    const updatedAt = new Date();

    it('Walk createNew 성공', () => {
        const walkOrError = Walk.createNew({
            time: walkTime,
            distance: walkDistance,
            isFinished: walkIsFinished,
        });

        expect(walkOrError.isSuccess).toBeTruthy();
        expect(walkOrError.value.id).toBeDefined();
        expect(walkOrError.value.time.value).toBe(walkTime.value);
        expect(walkOrError.value.distance.value).toBe(walkDistance.value);
        expect(walkOrError.value.isFinish.value).toBe(walkIsFinished.value);
    })

    it('Walk create 성공', () => {
        const walkOrError = Walk.create({
            time: walkTime,
            distance: walkDistance,
            isFinished: walkIsFinished,
            createdAt,
            updatedAt,
        }, TEST_WALK_ID);

        expect(walkOrError.isSuccess).toBeTruthy();
        expect(walkOrError.value.id).toBe(TEST_WALK_ID);
        expect(walkOrError.value.time.value).toBe(walkTime.value);
        expect(walkOrError.value.distance.value).toBe(walkDistance.value);
        expect(walkOrError.value.isFinish.value).toBe(walkIsFinished.value);
        expect(walkOrError.value.createdAt).toBe(createdAt);
        expect(walkOrError.value.updatedAt).toBe(updatedAt);
    })
})