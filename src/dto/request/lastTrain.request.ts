import { ApiField } from 'src/common/decorator/api.decorator';

export class LastTrainRequest {
  @ApiField({
    type: Number,
    description: '지하철 역 외부코드',
    nullable: true,
    example: '750',
  })
  station_code: number;

  @ApiField({
    type: Number,
    description: '지하철 호선 번호',
    nullable: true,
    example: '5',
  })
  line_num: number;

  @ApiField({
    type: Number,
    description: '지하철 상, 하행',
    nullable: true,
    example: '1-상행 2-하행',
  })
  way_code: number;
}
