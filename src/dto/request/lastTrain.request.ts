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
    example: '1-9 호선',
  })
  line_num: number;
}
