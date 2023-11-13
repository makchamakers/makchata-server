import { ApiNestedField } from 'src/common/decorator/api.decorator';
import PathInfoResponse from './pathInfo.response';

export default class RouteResponse {
  @ApiNestedField({
    type: [PathInfoResponse],
    description: '경로 목록',
    nullable: false,
    example: [
      {
        type: '지하철',
        totalTime: 21,
        totalDistance: 6787,
        payment: 1400,
        firstStartStation: '신정',
        lastEndStation: '합정',
        subPath: [
          {
            trafficType: '도보',
            distance: 181,
          },
          {
            trafficType: '지하철',
            distance: 3500,
            startName: '신정',
            endName: '영등포구청',
          },
          {
            trafficType: '도보',
            distance: 0,
          },
          {
            trafficType: '지하철',
            distance: 3100,
            startName: '영등포구청',
            endName: '합정',
          },
          {
            trafficType: '도보',
            distance: 6,
          },
        ],
      },
    ],
  })
  route: PathInfoResponse;
}
