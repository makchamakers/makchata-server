import { ApiNestedField } from 'src/common/decorator/api.decorator';
import TrafficResponse from './traffic.response';

export default class RouteDetailResponse {
  //도보일 경우의 x,y 좌표를 생각해보겠습니다.
  @ApiNestedField({
    type: [TrafficResponse],
    description: '경로의 종류 지하철, 버스, 도보로 나눠진 경로들의 배열,',
    nullable: false,
    example: [
      {
        trafficType: '버스',
        distance: 8588,
        coords: [
          {
            x: '126.856278',
            y: '37.521376',
          },
          {
            x: '126.859282',
            y: '37.521711',
          },
          {
            x: '126.861619',
            y: '37.521977',
          },
          {
            x: '126.86328',
            y: '37.522155',
          },
          {
            x: '126.865118',
            y: '37.524011',
          },
          {
            x: '126.86551',
            y: '37.525771',
          },
          {
            x: '126.867052',
            y: '37.52557',
          },
          {
            x: '126.873175',
            y: '37.526133',
          },
          {
            x: '126.876622',
            y: '37.528671',
          },
          {
            x: '126.877533',
            y: '37.53277',
          },
          {
            x: '126.87831',
            y: '37.53458',
          },
          {
            x: '126.881268',
            y: '37.535752',
          },
          {
            x: '126.884262',
            y: '37.536789',
          },
          {
            x: '126.893239',
            y: '37.538018',
          },
          {
            x: '126.894903',
            y: '37.537232',
          },
          {
            x: '126.900803',
            y: '37.534611',
          },
          {
            x: '126.902811',
            y: '37.541928',
          },
          {
            x: '126.909967',
            y: '37.54786',
          },
          {
            x: '126.91295',
            y: '37.548995',
          },
        ],
        startName: '경서농협',
        endName: '합정역',
      },
    ],
  })
  type: TrafficResponse[];
}
