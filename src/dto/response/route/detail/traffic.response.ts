import { ApiNestedField, ApiField } from 'src/common/decorator/api.decorator';
import CoordsResponse from './detail.response';

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

  @ApiNestedField({
    type: [CoordsResponse],
    description: '총 이동 거리 단위(미터)',
    nullable: false,
    example: 4100,
  })
  coords: CoordsResponse[];

  @ApiField({
    type: Number,
    description: '요금 단위(원)',
    nullable: false,
    example: '1900',
  })
  payment: number;

  @ApiField({
    type: String,
    description: '출발역 이름',
    nullable: false,
    example: '합정역',
  })
  startName: string;

  @ApiField({
    type: String,
    description: '도착역 이름',
    nullable: false,
    example: '신정역',
  })
  endName: string;
}
