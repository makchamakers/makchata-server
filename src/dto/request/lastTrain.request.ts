import { ApiField } from 'src/common/decorator/api.decorator';

export class LastTrainRequest {
  @ApiField({
    type: Number,
    description: '지하철 역 외부코드',
    nullable: true,
    example: '750',
  })
  station_code: number;
}
