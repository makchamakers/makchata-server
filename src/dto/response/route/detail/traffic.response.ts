import { ApiNestedField, ApiField } from 'src/common/decorator/api.decorator';
import CoordsResponse from './detail.response';
import LaneResponse from './lane.response';

export default class TrafficResponse {
  @ApiField({
    type: String,
    description: '경로의 종류 지하철, 버스, 도보',
    nullable: false,
    example: '지하철',
  })
  trafficType: '도보' | '버스' | '지하철';

  @ApiField({
    type: Number,
    description: '이동거리 단위 (m)',
    nullable: false,
    example: 8588,
  })
  distance: number;

  @ApiField({
    type: String,
    description: '출발역 이름',
    nullable: true,
    example: '합정역',
  })
  startName?: string;

  @ApiField({
    type: String,
    description: '도착역 이름',
    nullable: true,
    example: '신정역',
  })
  endName?: string;

  @ApiField({
    type: Number,
    description: '이동 시간',
    nullable: false,
    example: 37,
  })
  sectionTime: number;

  @ApiField({
    type: String,
    description: '빠른 출구',
    nullable: true,
    example: '3-9',
  })
  door?: string;

  @ApiField({
    type: Number,
    description: '정류장 개수',
    nullable: true,
    example: 18,
  })
  stationCount?: number;

  @ApiNestedField({
    type: [LaneResponse],
    description: '이동수단 정보',
    nullable: true,
    example: [
      {
        name: '수도권 2호선',
        subwayCode: 2,
        subwayCityCode: 1000,
      },
    ],
  })
  lane?: LaneResponse[];

  @ApiNestedField({
    type: [CoordsResponse],
    description: '교통수단을 활용했을 때 x,y좌표',
    nullable: true,
    example: [
      {
        x: 123.12121,
        y: 38.12121,
      },
    ],
  })
  coords?: CoordsResponse[];
}
