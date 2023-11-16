import { Controller, Param, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags } from '@nestjs/swagger';
import { GetApi } from './common/decorator/api.decorator';
import { CurrentLocationRequest } from './dto/request/current.request';
import CurrentLocationResponse from './dto/response/current.response';
import { SearchRequest } from './dto/request/search.response';
import SearchResponse from './dto/response/search.response';
import RouteRequest from './dto/request/route.request';
import { LastTrainRequest } from './dto/request/lastTrain.request';
//import RouteResponse from './dto/response/route/route.response';
import RouteDetailResponse from './dto/response/route/detail/detail.response';

@ApiTags('경로 데이터 가져오기')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

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
  getRoutes(@Query('') request: RouteRequest): Promise<any> {
    return this.appService.getDestination(request);
  }

  @GetApi(() => [], {
    path: '/destination/:index',
  })
  getRouteDetail(
    @Query('') request: RouteRequest,
    @Param('index') index: number,
  ): Promise<any> {
    return this.appService.getMapPathCoord(request, index);
  }

  @GetApi(() => [], {
    path: '/destination/train',
  })
  getLastTrain(@Query('') request: LastTrainRequest): Promise<any> {
    return this.appService.getLastTrain(request);
  }
}
