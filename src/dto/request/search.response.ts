import { ApiField } from 'src/common/decorator/api.decorator';

export class SearchRequest {
  @ApiField({
    type: String,
    description: '검색할 위치',
    nullable: true,
    example: '서울특별시 양천구 신정4동 1000-22',
  })
  search: string;

  @ApiField({
    type: String,
    description: '검색 반경의 coordinate example의 쉼표 꼭 넣어줘야해요!',
    nullable: true,
    example: '127.14091823,34.1938091',
  })
  range: string;
}
