import * as xml2js from 'xml2js';

export const subwayUtil = () => {
  // subwayCode를 받아서 ex)2  => 02호선을 붙일 것.
  const formattingSubwayCode = (subwayCode: number) => {
    if (subwayCode < 10) {
      return `0${subwayCode}호선`;
    } else if (subwayCode === 116) {
      return '분당선';
    }
    // 앞으로 신분당선 등.. 추가
  };

  // 공휴일 체크 API
  const checkDay = async (key: string) => {
    const date = new Date();
    const month = date.getMonth();
    const year = date.getFullYear();
    const day = date.getDate();
    const dayOfWeek = date.getDay();
    const today = `${year}${month}${day}`;

    const formattingMonth = month < 10 ? `0${month + 1}` : month + 1;
    const formattingKey = encodeURIComponent(key);
    console.log(month);
    const res = await fetch(
      `http://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getRestDeInfo?solYear=${year}&solMonth=${formattingMonth}&ServiceKey=${formattingKey}`,
    );

    const xmlData = await res.text();
    const parser = new xml2js.Parser({ explicitArray: false });
    const parsedData = await parser.parseStringPromise(xmlData);
    console.log(parsedData);

    if (parsedData.response.header.resultCode === '00') {
      if (parsedData.response.body.items === '') {
        if (dayOfWeek === 0) {
          return 3;
        } else if (dayOfWeek > 1 || dayOfWeek < 6) {
          return 1;
        } else if (dayOfWeek === 6) {
          return 2;
        }
      } else {
        const checkHoliday = parsedData.response.body.items.item;
        if (checkHoliday.locdate === today || dayOfWeek === 0) {
          return 3;
        } else if (dayOfWeek > 1 || dayOfWeek < 6) {
          return 1;
        } else if (dayOfWeek === 6) {
          return 2;
        }
      }
    }
  };

  return { formattingSubwayCode, checkDay };
};
