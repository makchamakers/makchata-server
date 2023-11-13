import { ApiNestedField } from 'src/common/decorator/api.decorator';

export default class SubPathResponse {
  @ApiNestedField({
    type: String,
    description: '교통 수단 종류: "도보", "지하철", "버스" 등',
    nullable: false,
    example: '지하철',
  })
  trafficType: string;

  @ApiNestedField({
    type: Number,
    description: '이동거리',
    nullable: false,
    example: 21,
  })
  distance: number;

  @ApiNestedField({
    type: Number,
    description: '출발역 이름 (일부 교통 수단에만 해당)',
    nullable: false,
    example: '합정역',
  })
  startName: number;

  @ApiNestedField({
    type: Number,
    description: '도착역 이름 (일부 교통 수단에만 해당)',
    nullable: false,
    example: '신정역',
  })
  endName: string;
}
