import { ApiField } from 'src/common/decorator/api.decorator';

export default class BusLastBoardingTimeResponse {
  @ApiField({
    type: String,
    description: '버스 번호',
    nullable: true,
    example: '740',
  })
  busNo: string;

  @ApiField({
    type: String,
    description: '버스 막차 시간',
    nullable: true,
    example: '23:35',
  })
  busLastTime: string;
}
