import { ApiField } from 'src/common/decorator/api.decorator';

export default class CoordsResponse {
  @ApiField({
    type: Number,
    description: '정류장의 x좌표',
    nullable: false,
    example: 8588,
  })
  x: number;

  @ApiField({
    type: Number,
    description: '정류장의 y좌표',
    nullable: false,
    example: 8588,
  })
  y: number;
}
