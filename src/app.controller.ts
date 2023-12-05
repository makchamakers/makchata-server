import { Controller, Param, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags } from '@nestjs/swagger';
import { GetApi } from './common/decorator/api.decorator';
import { CurrentLocationRequest } from './dto/request/current.request';
import CurrentLocationResponse from './dto/response/current.response';
import { SearchRequest } from './dto/request/search.response';
import SearchResponse from './dto/response/search.response';
import RouteRequest from './dto/request/route.request';
import { TrafficService } from './traffic.service';
import RouteResponse from './dto/response/route/route.response';
import RouteDetailResponse from './dto/response/route/detail/detail.response';
import TaxiResponse from './dto/response/taxi.response';

@ApiTags('경로 데이터 가져오기')
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly trafficService: TrafficService,
  ) {}

  @GetApi(() => [CurrentLocationResponse], {
    path: '/',
  })
  getHello(
    @Query('') currentLocation: CurrentLocationRequest,
  ): Promise<CurrentLocationResponse> {
    return this.appService.getCurrentDirection(currentLocation);
  }

  @GetApi(() => [SearchResponse], {
    path: '/search',
  })
  post(@Query('') request: SearchRequest): Promise<SearchResponse> {
    return this.appService.getCurrentLocation(request);
  }

  @GetApi(() => [], {
    path: '/destination',
  })
  getRoutes(@Query('') request: RouteRequest): Promise<RouteResponse> {
    return this.appService.getDestination(request);
  }

  // 하나만 만드는게 비용 절감에는 좋을 것 같다...
  @GetApi(() => [], {
    path: '/destination/:index',
  })
  getRouteDetail(
    @Query('') request: RouteRequest,
    @Param('index') index: number,
  ): Promise<RouteDetailResponse> {
    return this.appService.getMapPathCoord(request, index);
  }

  @GetApi(() => [], {
    path: '/taxi',
  })
  getTaxi(@Query('') request: RouteRequest): Promise<TaxiResponse> {
    return this.trafficService.getTaxiPay(request);
  }

  @GetApi(() => [], {
    path: '/bus/:busNo',
  })
  getBus(@Param('busNo') busNo: number): Promise<any> {
    return this.trafficService.getLastBus(busNo);
  }
}
