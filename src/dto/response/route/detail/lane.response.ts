import { ApiField } from 'src/common/decorator/api.decorator';

export default class LaneResponse {
  @ApiField({
    type: String,
    description: '호선 번호',
    nullable: false,
    example: '수도권 2호선',
  })
  name: string;

  @ApiField({
    type: Number,
    description: '호선 번호',
    nullable: false,
    example: 2,
  })
  subwayCode: number;

  @ApiField({
    type: Number,
    description: '지하철 도시코드',
    nullable: false,
    example: 1000,
  })
  subwayCityCode: string;
}
