import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CurrentLocationRequest } from './dto/request/current.request';
import CurrentLocationResponse from './dto/response/current.response';
import { SearchRequest } from './dto/request/search.response';
import RouteRequest from './dto/request/route.request';
import { subwayUtil } from './utils/subway.util';
import { LastTrainRequest } from './dto/request/lastTrain.request';

@Injectable()
export class AppService {
  constructor(private configService: ConfigService) {}
  async getCurrentDirection(
    request: CurrentLocationRequest,
  ): Promise<CurrentLocationResponse> {
    try {
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

    const route = await Promise.all(
      data?.result?.path?.map(async (pathType) => {
        if (pathType.pathType === 1) {
          const subPath = [];

          for (const path of pathType?.subPath || []) {
            if (path.trafficType === 1) {
              const lastTime = await this.getLastTrain({
                station_code: path.startID,
                line_num: path.lane[0].subwayCode,
                way_code: path.wayCode,
              }).catch(() => null);
              console.log(path.sectionTime, 'sectionTime');
              subPath.push({
                trafficType: '지하철',
                distance: path.distance,
                startName: path.startName,
                endName: path.endName,
                stationCount: path.stationCount,
                sectionTime: path.sectionTime,
                door: path.door,
                startId: path.startId,
                lastTime,
              });
              console.log(subPath);
            } else if (path.trafficType === 3) {
              subPath.push({
                trafficType: '도보',
                distance: path.distance,
                sectionTime: path.sectionTime,
              });
            }
          }

          return {
            type: '지하철',
            totalTime: pathType?.info?.totalTime,
            totalDistance: pathType?.info?.totalDistance,
            payment: pathType?.info?.payment,
            firstStartStation: pathType?.info?.firstStartStation,
            lastEndStation: pathType?.info?.lastEndStation,
            subPath,
          };
        } else if (pathType.pathType === 2 || pathType.pathType === 3) {
          const typeLabel = pathType.pathType === 2 ? '버스' : '버스+지하철';
          const subPath = [];

          for (const path of pathType?.subPath || []) {
            if (path.trafficType === 2) {
              const lastTime = await this.getLastBus(path.lane[0].busNo).catch(
                () => null,
              );

              subPath.push({
                trafficType: '버스',
                distance: path.distance,
                startName: path.startName,
                endName: path.endName,
                sectionTime: path.sectionTime,
                lastTime,
              });
            } else if (path.trafficType === 1 || path.trafficType === 2) {
              const lastTime =
                path.trafficType === 1
                  ? await this.getLastTrain({
                      station_code: path.startID,
                      line_num: path.lane[0].subwayCode,
                      way_code: path.wayCode,
                    }).catch(() => null)
                  : await this.getLastBus(path.lane[0].busNo).catch(() => null);

              subPath.push({
                trafficType: path.trafficType === 1 ? '지하철' : '버스',
                distance: path.distance,
                startName: path.startName,
                endName: path.endName,
                sectionTime: path.sectionTime,
                lastTime,
              });
            } else {
              subPath.push({
                trafficType: '도보',
                distance: path.distance,
                sectionTime: path.sectionTime,
              });
            }
          }

          return {
            type: typeLabel,
            totalTime: pathType?.info?.totalTime,
            totalDistance: pathType?.info?.totalDistance,
            payment: pathType?.info?.payment,
            firstStartStation: pathType?.info?.firstStartStation,
            lastEndStation: pathType?.info?.lastEndStation,
            subPath,
          };
        }
      }),
    );

    return route;
  }

  /**
   *
   * 한 path에 대한 x,y 좌표를 주면 된다. 배열로
   */
  async getMapPathCoord(request: RouteRequest, index: number) {
    const destination = await fetch(
      `https://api.odsay.com/v1/api/searchPubTransPathT?SX=${request.sx}&SY=${
        request.sy
      }&EX=${request.ex}&EY=${request.ey}&OPT=1&apiKey=${encodeURIComponent(
        this.configService.get<string>('ODSAY_KEY'),
      )}`,
    );

    const data = await destination.json();

    const newData = await Promise.all(
      data.result.path[index].subPath.map(async (path) => {
        if (path.trafficType === 1 || path.trafficType === 2) {
          const lastTime =
            path.trafficType === 1
              ? await this.getLastTrain({
                  station_code: path.startID,
                  line_num: path.lane[0].subwayCode,
                  way_code: path.wayCode,
                }).catch(() => null)
              : await this.getLastBus(path.lane[0].busNo).catch(() => null);
          return {
            trafficType: path.trafficType === 1 ? '지하철' : '버스',
            distance: path.distance,
            startName: path?.startName,
            endName: path?.endName,
            sectionTime: path?.sectionTime,
            door: path?.door,
            stationCount: path?.stationCount,
            lane: path?.lane,
            lastTime,
            coords: path.passStopList.stations.map((coords) => {
              return {
                x: coords.x,
                y: coords.y,
              };
            }),
          };
        } else {
          return {
            trafficType: '도보',
            distance: path.distance,
            sectionTime: path?.sectionTime,
          };
        }
      }),
    );

    return newData;
  }

  async getLastTrain(request: LastTrainRequest) {
    const { checkDay } = subwayUtil();

    //평일 1 토요일 2 공휴일/일요일 3
    let weekTag;
    await checkDay(this.configService.get<string>('OPEN_API_HOLIDAY')).then(
      (res) => (weekTag = res),
    );
    try {
      const res = await fetch(
        `http://openapi.seoul.go.kr:8088/${this.configService.get<string>(
          'OPEN_API_LAST_TRAIN',
        )}/json/SearchFirstAndLastTrainbyLineServiceNew/1/5/${
          request.line_num
        }/${request.way_code}/${weekTag}/ /${request.station_code}/`,
      );

      const data = await res.json();

      return data.SearchFirstAndLastTrainbyLineServiceNew.row[0].LAST_TIME;
    } catch (err) {}
  }

  private async getLastBus(busNum: string) {
    const res = await fetch(
      `https://api.odsay.com/v1/api/searchBusLane?lang=0&busNo=${busNum}&apiKey=${encodeURIComponent(
        this.configService.get<string>('ODSAY_BUS_KEY'),
      )}`,
    );
    const data = await res.json();

    return data.result.lane.busLastTime;
  }
}
