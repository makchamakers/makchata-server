import { ApiField } from 'src/common/decorator/api.decorator';
import { IAdress } from 'src/types/types';

export default class SearchResponse {
  @ApiField({
    type: String,
    description: '검색결과',
    nullable: false,
    example:
      '{ roadAdress : 서울특별시 양천구 ... , x : 123.113... ,y:42.1212}',
  })
  result: IAdress[] | [];
}
