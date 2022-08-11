import { mock, MockProxy } from 'jest-mock-extended';

import { IWalkwayRepository } from '../../infra/IWalkwayRepository';
import { createWalkwayUseCase, CreateWalkwayUseCaseCodes } from './CreateWalkwayUseCase';

describe('CreateSeoulmapWalkwaysUseCase', () => {
    let uut: createWalkwayUseCase;
    let walkwayRepository: MockProxy<IWalkwayRepository>;

    const testWalkwayTitle = '용답 산책로';
    const testWalkwayAddress = '성동구 용답동';
    const testWalkwayDistance = 5;
    const testWalkwayTime = 60;
    const testWalkwayPath = [
        { lat: 30, lng: 30 },
        { lat: 40, lng: 30 },
    ];

    beforeAll(() => {
        walkwayRepository = mock<IWalkwayRepository>();
        uut = new createWalkwayUseCase(walkwayRepository);
    });

    it('create 성공', async () => {
        givenSaveSuccess();

        const createWalkwayResponse = await uut.execute({
            title: testWalkwayTitle,
            address: testWalkwayAddress,
            distance: testWalkwayDistance,
            time: testWalkwayTime,
            path: testWalkwayPath,
        });

        expect(createWalkwayResponse.code).toBe(CreateWalkwayUseCaseCodes.SUCCESS);
    })

    it('create 실패', async () => {
        givenSaveFailure();

        const createWalkwayResponse = await uut.execute({
            title: testWalkwayTitle,
            address: testWalkwayAddress,
            distance: testWalkwayDistance,
            time: testWalkwayTime,
            path: testWalkwayPath,
        });

        expect(createWalkwayResponse.code).toBe(CreateWalkwayUseCaseCodes.FAILURE);
    })

    function givenSaveSuccess() {
        walkwayRepository.save.mockResolvedValueOnce(true);
    }

    function givenSaveFailure() {
        walkwayRepository.save.mockRejectedValue(new Error('Unhandled error'))
    }
})
