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
        lastBoardingTime: '245830',
        totalTime: 48,
        totalDistance: 22375,
        payment: 1600,
        firstStartStation: '합정',
        lastEndStation: '역삼',
        subPath: [
          {
            trafficType: '도보',
            distance: 6,
            sectionTime: 1,
          },
          {
            trafficType: '지하철',
            distance: 21800,
            startName: '합정',
            endName: '역삼',
            stationCount: 17,
            sectionTime: 38,
            door: 'null',
          },
          {
            trafficType: '도보',
            distance: 569,
            sectionTime: 9,
          },
        ],
      },
    ],
  })
  route: PathInfoResponse[];
}
