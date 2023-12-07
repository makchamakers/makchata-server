import { ApiField, ApiNestedField } from 'src/common/decorator/api.decorator';
import TrafficResponse from './traffic.response';
import BusLastBoardingTimeResponse from './buslastBoardingTime.response';

export default class RouteDetailResponse {
  //도보일 경우의 x,y 좌표를 생각해보겠습니다.
  @ApiNestedField({
    type: [TrafficResponse],
    description: '경로의 종류 지하철, 버스, 도보로 나눠진 경로들의 배열,',
    nullable: false,
    example: {
      lastBoardingTime: '244449',
      path: [
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
          sectionTime: 38,
          door: 'null',
          stationCount: 17,
          lane: [
            {
              name: '수도권 2호선',
              subwayCode: 2,
              subwayCityCode: 1000,
            },
          ],
          lastTime: '245830',
          coords: [
            {
              x: '126.914523',
              y: '37.549935',
            },
            {
              x: '126.902682',
              y: '37.534875',
            },
            {
              x: '126.896564',
              y: '37.525469',
            },
            {
              x: '126.894803',
              y: '37.518007',
            },
            {
              x: '126.891114',
              y: '37.508656',
            },
            {
              x: '126.89489',
              y: '37.493393',
            },
            {
              x: '126.901594',
              y: '37.485215',
            },
            {
              x: '126.913346',
              y: '37.487563',
            },
            {
              x: '126.929699',
              y: '37.484231',
            },
            {
              x: '126.941586',
              y: '37.482477',
            },
            {
              x: '126.952729',
              y: '37.481207',
            },
            {
              x: '126.963428',
              y: '37.477119',
            },
            {
              x: '126.981363',
              y: '37.476575',
            },
            {
              x: '126.997667',
              y: '37.481496',
            },
            {
              x: '127.007702',
              y: '37.491852',
            },
            {
              x: '127.014395',
              y: '37.493902',
            },
            {
              x: '127.027619',
              y: '37.497952',
            },
            {
              x: '127.036377',
              y: '37.500643',
            },
          ],
        },
        {
          trafficType: '도보',
          distance: 570,
          sectionTime: 9,
        },
      ],
    },
  })
  path: TrafficResponse[];

  @ApiField({
    type: String,
    description: '막차 시간',
    nullable: true,
    example: '244441',
  })
  lastBoardingTime: BusLastBoardingTimeResponse[];

  @ApiField({
    type: Number,
    description: '총 소요 시간 (분)',
    nullable: true,
    example: 43,
  })
  totalTime: number;

  @ApiField({
    type: String,
    description: '이동 수단',
    nullable: true,
    example: '1 : 지하철, 2 : 버스 , 3: 지하철 + 버스',
  })
  type: string;
}
