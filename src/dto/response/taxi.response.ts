import { ApiField } from 'src/common/decorator/api.decorator';

export default class TaxiResponse {
  @ApiField({
    type: Number,
    description: '예상 택시비',
    nullable: false,
    example: 23000,
  })
  taxiPay: number;
}
