import { Injectable } from '@nestjs/common';
import { subwayUtil } from './utils/subway.util';
import { LastTrainRequest } from './dto/request/lastTrain.request';
import { ConfigService } from '@nestjs/config';
import RouteRequest from './dto/request/route.request';
import TaxiResponse from './dto/response/taxi.response';

@Injectable()
export class TrafficService {
  constructor(private configService: ConfigService) {}
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

  async getLastBus(busNo: number) {
    const res = await fetch(
      `https://api.odsay.com/v1/api/searchBusLane?lang=0&busNo=${busNo}&apiKey=${encodeURIComponent(
        this.configService.get<string>('ODSAY_BUS_KEY'),
      )}`,
    );

    const data = await res.json();
    return data.result;
  }

  async getTaxiPay(route: RouteRequest): Promise<TaxiResponse> {
    const res = await fetch(
      `https://apis-navi.kakaomobility.com/v1/directions?origin=${route.sx},${route.sy}&destination=${route.ex},${route.ey}`,
      {
        headers: {
          Authorization: `KakaoAK ${this.configService.get<string>(
            'KAKAO_REST_API_KEY',
          )}`,
        },
      },
    );
    const data = await res.json();
    if (
      'routes' in data &&
      Array.isArray(data.routes) &&
      data.routes.length > 0
    ) {
      return { taxiPay: data.routes[0].summary.fare.taxi };
    } else {
      throw new Error('Invalid response format');
    }
  }
}
