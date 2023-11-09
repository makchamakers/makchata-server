import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CurrentLocationRequest } from './dto/request/current.request';
import CurrentLocationResponse from './dto/response/current.response';
import { SearchRequest } from './dto/request/search.response';
import RouteRequest from './dto/request/route.request';
import { LastTrainRequest } from './dto/request/lastTrain.request';
import { subwayUtil } from './utils/subway.util';

@Injectable()
export class AppService {
  constructor(private configService: ConfigService) {}
  async getCurrentDirection(
    request: CurrentLocationRequest,
  ): Promise<CurrentLocationResponse> {
    try {
      console.log(request, 'request');
      const res = await fetch(
        `https://naveropenapi.apigw.ntruss.com/map-reversegeocode/v2/gc?coords=${request.longitude},${request.latitude}&output=json&orders=addr,admcode`,
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
      console.log(currentLocation);
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
    const encodedQuery = encodeURIComponent(request.search);

    const res = await fetch(
      `https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodedQuery}`,
      {
        headers: {
          Authorization: `KakaoAK ${this.configService.get<string>(
            'KAKAO_REST_API_KEY',
          )}`,
        },
      },
    );

    if (res.ok) {
      const data = await res.json();
      return data.documents.map((item) => ({
        address_name: item.address_name,
        place_name: item.place_name,
        phone: item.phone,
        x: item.x,
        y: item.y,
      }));
    } else {
      throw new Error(`Kakao API request failed with status ${res.status}`);
    }
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
    // traffic type 1지하철 2버스 3버스 + 지하철

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

  /**
   *
   * result 안에 넣어야함.
   *
   */

  async getLastTrain(request: LastTrainRequest) {
    // const res = await fetch(
    //   `http://openapi.seoul.go.kr:8088/${this.configService.get<string>(
    //     'OPEN_API_LAST_TRAIN',
    //   )}/json/SearchSTNBySubwayLineInfo/1/5//${request.station_name}`,
    // );
    console.log(request);
    const res = await fetch(
      `http://openapi.seoul.go.kr:8088/${this.configService.get<string>(
        'OPEN_API_LAST_TRAIN',
      )}/json/SearchFirstAndLastTrainbyLineServiceNew/1/5/${
        request.line_num
      }/1/1/ /${request.station_code}/`,
    );

    const data = await res.json();
    const { checkDay } = subwayUtil(1);
    await checkDay(
      1,
      2,
      this.configService.get<string>('OPEN_API_HOLIDAY'),
    ).then((res) => console.log(res, 'holiday'));

    console.log(data);
    return data;
  }
}
