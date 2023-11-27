import { ApiField } from 'src/common/decorator/api.decorator';

export default class SubPathResponse {
  @ApiField({
    type: String,
    description: '교통 수단 종류: "도보", "지하철", "버스" 등',
    nullable: false,
    example: '지하철',
  })
  trafficType: string;

  @ApiField({
    type: Number,
    description: '이동거리',
    nullable: false,
    example: 21,
  })
  distance: number;

  @ApiField({
    type: Number,
    description: '이동 시간 단위(분)',
    nullable: false,
    example: 7,
  })
  sectionTime: number;

  @ApiField({
    type: Number,
    description: '정류장 갯수',
    nullable: true,
    example: 42,
  })
  stationCount?: number;

  @ApiField({
    type: String,
    description: '빠른 하차 (지하철인 경우만 해당)',
    nullable: true,
    example: '3-7',
  })
  door?: string;

  @ApiField({
    type: Number,
    description: '출발역 이름 (일부 교통 수단에만 해당)',
    nullable: true,
    example: '합정역',
  })
  startName?: number;

  @ApiField({
    type: Number,
    description: '도착역 이름 (일부 교통 수단에만 해당)',
    nullable: true,
    example: '신정역',
  })
  endName?: string;
}
