import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CurrentLocationRequest } from './dto/request/current.request';
import CurrentLocationResponse from './dto/response/current.response';
import { SearchRequest } from './dto/request/search.response';
import RouteRequest from './dto/request/route.request';

@Injectable()
export class AppService {
  constructor(private configService: ConfigService) {}
  async getCurrentDirection(
    request: CurrentLocationRequest,
  ): Promise<CurrentLocationResponse> {
    try {
      const res = await fetch(
        `https://naveropenapi.apigw.ntruss.com/map-reversegeocode/v2/gc?coords=${request.longitude},${request.longitude}&output=json&orders=addr,admcode`,
        {
          mode: 'cors',
          headers: new Headers({
            'X-NCP-APIGW-API-KEY-ID':
              this.configService.get<string>('CLIENT_ID'),
            'X-NCP-APIGW-API-KEY':
              this.configService.get<string>('CLIENT_SECRET'),
          }),
        },
      );
      const currentLocation = await res.json();
      const mergeCurrentLocation = `${currentLocation?.results[0]?.region.area1.name} ${currentLocation?.results[0]?.region.area2.name} ${currentLocation?.results[0]?.region.area3.name} ${currentLocation?.results[0]?.region.area4.name}${currentLocation?.results[0]?.land.number1}-${currentLocation?.results[0]?.land.number2}`;
      const data = await fetch(
        `https://naveropenapi.apigw.ntruss.com/map-geocode/v2/geocode?query=${mergeCurrentLocation}`,
        {
          mode: 'cors',
          headers: new Headers({
            'X-NCP-APIGW-API-KEY-ID':
              this.configService.get<string>('CLIENT_ID'),
            'X-NCP-APIGW-API-KEY':
              this.configService.get<string>('CLIENT_SECRET'),
          }),
        },
      );
      const result = await data.json();

      return {
        location: result?.addresses[0].roadAddress,
        x: result?.addresses[0].x,
        y: result?.addresses[0].y,
      };
    } catch (err) {
      console.log(err);
    }
  }

  async getCurrentLocation(request: SearchRequest): Promise<any> {
    const res = await fetch(
      `https://naveropenapi.apigw.ntruss.com/map-geocode/v2/geocode?query=${request.search}&coordinate=${request.search}`,
      {
        mode: 'cors',
        headers: new Headers({
          'X-NCP-APIGW-API-KEY-ID': this.configService.get<string>('CLIENT_ID'),
          'X-NCP-APIGW-API-KEY':
            this.configService.get<string>('CLIENT_SECRET'),
        }),
      },
    );

    const data = await res.json();

    return data?.addresses.length === 0
      ? []
      : {
          roadAddress: data?.addresses[0].roadAddress,
          x: data?.addresses[0].x,
          y: data?.addresses[0].y,
        };
  }

  async getDestination(request: RouteRequest) {
    const destination = await fetch(
      `https://api.odsay.com/v1/api/searchPubTransPathT?SX=${request.sx}&SY=${
        request.sy
      }&EX=${request.ex}&EY=${request.ey}&OPT=1&apiKey=${encodeURIComponent(
        this.configService.get<string>('ODSAY_KEY'),
      )}`,
    );

    const data = await destination.json();
    // traffic type 1지하철 2버스 3도보

    console.log(data);
    const route = data?.result?.path?.map((pathType) => {
      let type;
      if (pathType.pathType === 1) {
        type = {
          type: '지하철',
          totalTime: pathType?.info?.totalTime,
          totalDistance: pathType?.info?.totalDistance,
          payment: pathType?.info?.payment,
          firstStartStation: pathType?.info?.firstStartStation,
          lastEndStation: pathType?.info?.lastEndStation,
          quickExit: pathType?.info?.door,
        };
      } else if (pathType.pathType === 2) {
        type = {
          type: '버스',
          totalTime: pathType?.info?.totalTime,
          totalDistance: pathType?.info?.totalDistance,
          payment: pathType?.info?.payment,
          firstStartStation: pathType?.info?.firstStartStation,
          lastEndStation: pathType?.info?.lastEndStation,
        };
      } else if (pathType.pathType === 3) {
        type = {
          type: '버스+지하철',
          totalTime: pathType?.info?.totalTime,
          totalDistance: pathType?.info?.totalDistance,
          payment: pathType?.info?.payment,
          firstStartStation: pathType?.info?.firstStartStation,
          lastEndStation: pathType?.info?.lastEndStation,
        };
      }
      return type;
    });

    console.log(route);
    return data;
  }
}
