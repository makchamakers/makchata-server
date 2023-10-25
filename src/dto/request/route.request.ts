import { ApiField } from 'src/common/decorator/api.decorator';

export default class RouteRequest {
  @ApiField({
    type: String,
    description: '출발지 x 좌표',
    nullable: false,
    example: '127.1052310',
  })
  sx: string;

  @ApiField({
    type: String,
    description: '출발지 y 좌표',
    nullable: false,
    example: '37.3595158',
  })
  sy: string;

  @ApiField({
    type: String,
    description: '목적지 x 좌표',
    nullable: false,
    example: '126.8548945',
  })
  ex: string;

  @ApiField({
    type: String,
    description: '목적지 y 좌표',
    nullable: false,
    example: '37.5237168',
  })
  ey: string;
}
