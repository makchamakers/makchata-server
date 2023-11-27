import { ApiNestedField, ApiField } from 'src/common/decorator/api.decorator';
import SubPathResponse from './subpath.response';

export default class PathInfoResponse {
  @ApiField({
    type: String,
    description: '경로의 종류 지하철, 버스, 도보',
    nullable: false,
    example: '지하철',
  })
  type: string;

  @ApiField({
    type: Number,
    description: '총 소요시간 단위(분)',
    nullable: false,
    example: 21,
  })
  totalTime: number;

  @ApiField({
    type: Number,
    description: '막차 시간 23시 56분 33초 인경우 ',
    nullable: false,
    example: '235633',
  })
  lastBoardingTime: string;

  @ApiField({
    type: Number,
    description: '총 이동 거리 단위(미터)',
    nullable: false,
    example: 4100,
  })
  totalDistance: number;

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
  firstStartStation: string;

  @ApiField({
    type: String,
    description: '도착역 이름',
    nullable: false,
    example: '신정역',
  })
  lastEndStation: string;

  @ApiNestedField({
    type: String,
    description: '도착역 이름',
    nullable: false,
    example: '신정역',
  })
  subPath: SubPathResponse[];
}
