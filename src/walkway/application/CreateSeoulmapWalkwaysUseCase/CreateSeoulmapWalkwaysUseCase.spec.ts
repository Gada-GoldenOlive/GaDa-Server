import { mock, MockProxy } from 'jest-mock-extended';

import { IWalkwayRepository } from "../../infra/IWalkwayRepository";
import { createSeoulmapWalkwaysUseCase, CreateSeoulmapWalkwaysUseCaseCodes } from "./CreateSeoulmapWalkwaysUseCase";

describe('CreateSeoulmapWalkwaysUseCase', () => {
    let uut: createSeoulmapWalkwaysUseCase;
    let walkwayRepository: MockProxy<IWalkwayRepository>;

    const testWalkwayTitle_1 = '용답 산책로';
    const testWalkwayAddress_1 = '성동구 용답동';
    const testWalkwayDistance_1 = 5;
    const testWalkwayTime_1 = 60;
    const testWalkwayPath_1 = [
        { lat: 30, lng: 30 },
        { lat: 40, lng: 30 },
    ];
    const testWalkwayTitle_2 = '용답 산책로';
    const testWalkwayAddress_2 = '성동구 용답동';
    const testWalkwayDistance_2 = 5;
    const testWalkwayTime_2 = 60;
    const testWalkwayPath_2 = [
        { lat: 30, lng: 30 },
        { lat: 40, lng: 30 },
    ];

    beforeAll(() => {
        walkwayRepository = mock<IWalkwayRepository>();
        uut = new createSeoulmapWalkwaysUseCase(walkwayRepository);
    });

    it('create 성공', async () => {
        givenSaveAllSuccess();

        const createSeoulmapWalkwayResponse = await uut.execute({
            values: [
                {
                    title: testWalkwayTitle_1,
                    address: testWalkwayAddress_1,
                    distance: testWalkwayDistance_1,
                    time: testWalkwayTime_1,
                    path: testWalkwayPath_1,
                },
                {
                    title: testWalkwayTitle_2,
                    address: testWalkwayAddress_2,
                    distance: testWalkwayDistance_2,
                    time: testWalkwayTime_2,
                    path: testWalkwayPath_2,
                },
            ]
        });

        expect(createSeoulmapWalkwayResponse.code).toBe(CreateSeoulmapWalkwaysUseCaseCodes.SUCCESS);
    })

    it('create 실패', async () => {
        givenSaveAllFailure();

        const createSeoulmapWalkwayResponse = await uut.execute({
            values: [
                {
                    title: testWalkwayTitle_1,
                    address: testWalkwayAddress_1,
                    distance: testWalkwayDistance_1,
                    time: testWalkwayTime_1,
                    path: testWalkwayPath_1,
                },
                {
                    title: testWalkwayTitle_2,
                    address: testWalkwayAddress_2,
                    distance: testWalkwayDistance_2,
                    time: testWalkwayTime_2,
                    path: testWalkwayPath_2,
                },
            ]
        });

        expect(createSeoulmapWalkwayResponse.code).toBe(CreateSeoulmapWalkwaysUseCaseCodes.FAILURE);
    })

    function givenSaveAllSuccess() {
        walkwayRepository.saveAll.mockResolvedValueOnce(true);
    }

    function givenSaveAllFailure() {
        walkwayRepository.saveAll.mockRejectedValue(new Error('Unhandled error'))
    }
})
