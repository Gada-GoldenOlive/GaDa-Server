import { HttpService } from '@nestjs/axios';
import { LineString } from 'geojson';
import _ from 'lodash';
import { firstValueFrom } from 'rxjs';

import { ICreateWalkwayUseCaseRequest } from '../application/CreateWalkwayUseCase/dto/CreateWalkwayUseCaseRequest';
import { Point } from '../domain/Walkway/WalkwayStartPoint';

export class getSeoulmapWalkways {
    async getValues(): Promise<ICreateWalkwayUseCaseRequest[]> {
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
        return values;
    }

    createValue(response: any): ICreateWalkwayUseCaseRequest{
        const DEFAULT_SPEED = 3 / 60;
        let address = this.getAddress(response);
        let distance = this.getDistance(response['COT_COORD_DATA']);

        let value: ICreateWalkwayUseCaseRequest = {
            title: this.getTitle(response['COT_CONTS_NAME'], address),
            address: address,
            distance: distance ,
            time: +(distance / DEFAULT_SPEED).toFixed(0),
            path: this.getPath(response['COT_COORD_DATA']),
        };
        return value;
    }

    getDistance(coordinates: number[][]): number {
        const geojsonLength = require('geojson-length');
        const line: LineString = {
            'type': 'LineString',
            'coordinates': coordinates,
        }
        return +(geojsonLength(line) / 1000) ;
    }

    getPath(coordinates: number[][]): Point[] {
        let newPath = [];

        coordinates.forEach(point => {
            newPath.push({
                lat: point[0],
                lng: point[1],
            });
        })
        return newPath;
    }

    isBadWalkway(walkwayData: any): boolean {
        if (walkwayData['COT_CONTS_NAME'].endsWith('_우수'))
            return false;
        if (walkwayData['COT_CONTS_NAME'] == '0')
            return false;
        if (walkwayData['COT_VALUE_01'].startsWith('우수: '))
            return false;
        return true;
    }

    getAddress(response: any): string {
        let temp = response['COT_ADDR_FULL_NEW'];
        if (_.isEmpty(temp)) 
            temp = response['COT_ADDR_FULL_OLD'];
        return temp.replace(/[0-9]*-?[0-9]*$/, '').trim();
    }

    getTitle(contsName: any, address: string): string {
        if (isNaN(contsName)) {
            if (contsName.includes('_우수') || contsName.includes('_보통') || contsName.includes('_불량'))
                contsName = contsName.substring(0, contsName.length - 3);
            contsName = contsName.replace(/_/gi, ' ');
            if (!contsName.endsWith('산책로'))
                contsName += ' 산책로';
            return contsName;
        }
        return address + ' 산책로';
    }
}
