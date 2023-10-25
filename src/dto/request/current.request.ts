import { ApiField } from 'src/common/decorator/api.decorator';

export class CurrentLocationRequest {
  @ApiField({
    type: String,
    description: '위도',
    nullable: true,
    example: '34.19283091',
  })
  latitude: string;

  @ApiField({
    type: String,
    description: '경도',
    nullable: true,
    example: '127.14091823',
  })
  longitude: string;
}
