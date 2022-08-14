import { HttpService } from '@nestjs/axios';
import { LineString } from 'geojson';
import _ from 'lodash';
import { firstValueFrom } from 'rxjs';
import { Point } from '../../domain/Walkway/WalkwayStartPoint';
import { ICreateWalkwayUseCaseRequest } from '../CreateWalkwayUseCase/dto/CreateWalkwayUseCaseRequest';

export class GetSeoulmapWalkwayUseCase {
    async execute(): Promise<ICreateWalkwayUseCaseRequest[]> {
        const httpService: HttpService = new HttpService();
        const URL = 'https://map.seoul.go.kr/smgis/apps/theme.do?cmd=getContentsList&key=86a16bf8aaed4777b5d3618d916e93fb&page_no=1&page_size=30000&coord_x=126&coord_y=37&distance=10000000&theme_id=11102801';

        let response = await firstValueFrom(httpService.get(URL));
        let values = response.data.body.filter((walkwayData) => {
            if (this.isBadWalkway(walkwayData) || this.getDistance(walkwayData['COT_COORD_DATA']) < 0.5)
                return false;
            return true;
        }).map((walkwayData) => {
            return this.createValue(walkwayData);
        });
        return this.changeDuplicateTitle(values);
    }

    createValue(response: any): ICreateWalkwayUseCaseRequest{
        const DEFAULT_SPEED = 1;    // 1m/s  = 3.6km/h
        let address = this.getAddress(response);
        let distance = this.getDistance(response['COT_COORD_DATA']);

        let value: ICreateWalkwayUseCaseRequest = {
            title: this.getTitle(response['COT_CONTS_NAME'], address),
            address: address,
            distance: distance ,
            time: +(distance / DEFAULT_SPEED).toFixed(0),   // s
            path: this.getPath(response['COT_COORD_DATA']),
            user: null,
        };
        return value;
    }

    getDistance(coordinates: number[][]): number {
        const geojsonLength = require('geojson-length');
        const line: LineString = {
            'type': 'LineString',
            'coordinates': coordinates,
        }
        return +(geojsonLength(line)).toFixed(0);   //m
    }

    getPath(coordinates: number[][]): Point[] {
        let newPath = [];

        coordinates.forEach(point => {
            newPath.push({
                lat: point[1],
                lng: point[0],
            });
        })
        return newPath;
    }

    isBadWalkway(walkwayData: any): boolean {
        if (walkwayData['COT_CONTS_NAME'].endsWith('불량'))
            return true;
        if (walkwayData['COT_CONTS_NAME'] == '2')
            return true;
        if (walkwayData['COT_VALUE_01'].startsWith('불량: '))
            return true;
        return false;
    }

    getAddress(response: any): string {
        let temp = response['COT_ADDR_FULL_NEW'];
        if (_.isEmpty(temp)) 
            temp = response['COT_ADDR_FULL_OLD'];
        return temp.replace(/[0-9]*-?[0-9]*$/, '').trim();
    }

    getTitle(contsName: any, address: string): string {
        if (isNaN(contsName)) {
            contsName = contsName.replace(/_/gi, ' ');
            if (contsName.includes('우수') || contsName.includes('보통') || contsName.includes('불량'))
                contsName = contsName.substring(0, contsName.length - 2);
            contsName = contsName.trim();
            if (contsName.length == 0)
                return address + ' 산책로';
            if (!contsName.endsWith('산책로'))
                contsName += ' 산책로';
            return contsName;
        }
        return address + ' 산책로';
    }

    changeDuplicateTitle(walkways: any): any {
        let sortedWalkways = walkways.sort((w1, w2) => {
            if (w1.title > w2.title) return 1;
            if (w1.title == w2.title) return 0;
            return -1;
        })

        let lastTitle = '';
        let titleCnt = 1;
        sortedWalkways.forEach(walkway => {
            if (walkway.title == lastTitle) {
                lastTitle = walkway.title;
                walkway.title += titleCnt;
                titleCnt++;
            }
            else {
                titleCnt = 1;
                lastTitle = walkway.title;
            }
        })

        return sortedWalkways;
    }
}
