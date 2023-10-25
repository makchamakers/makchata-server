import { ApiField } from 'src/common/decorator/api.decorator';

export default class CurrentLocationResponse {
  @ApiField({
    type: String,
    description: '현재 위치 지번 주소',
    nullable: false,
    example: '신정4동 966-9',
  })
  location: string;

  @ApiField({
    type: String,
    description: '현재 위치 x 좌표',
    nullable: false,
    example: '127.1052310',
  })
  x: string;

  @ApiField({
    type: String,
    description: '현재 위치 y 좌표',
    nullable: false,
    example: '37.3595158',
  })
  y: string;
}
