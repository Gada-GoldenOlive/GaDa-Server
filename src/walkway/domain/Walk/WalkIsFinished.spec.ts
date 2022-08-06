import { WalkIsFinished } from "./WalkIsFinished";

describe('WalkIsFinished', () => {
    const walkIsFinishBoolean = true;

    it('WalkIsFinished create 성공', () => {
        const WalkTimeOrError = WalkIsFinished.create(walkIsFinishBoolean);

        expect(WalkTimeOrError.isSuccess).toBeTruthy();
        expect(WalkTimeOrError.value.value).toBe(walkIsFinishBoolean);
    });
})