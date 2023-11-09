import * as xml2js from 'xml2js';

export const subwayUtil = (subwayCode: number) => {
  // subwayCode를 받아서 ex)2  => 02호선을 붙일 것.
  const formattingSubwayCode = () => {
    if (subwayCode < 10) {
      return `0${subwayCode}호선`;
    } else if (subwayCode === 116) {
      return '분당선';
    }
    // 앞으로 신분당선 등.. 추가
  };

  const checkDay = async (year: number, month: number, key: string) => {
    console.log(key);
    const formattingMonth = month < 10 ? `0${month}` : month;
    const res = await fetch(
      `http://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getRestDeInfo?solYear=${year}&solMonth=${formattingMonth}&ServiceKey=${key}`,
    );

    // Check if the response is successful (status code 200)
    if (res.ok) {
      // Convert the XML to JSON
      const xmlData = await res.text();

      const parseString = xml2js.parseString;
      let jsonData;

      parseString(xmlData, { explicitArray: false }, (err, result) => {
        if (!err) {
          jsonData = result;
        }
      });

      console.log(jsonData); // This will log the JSON formatted data
      return jsonData;
    } else {
      console.error('Failed to fetch data:', res.status, res.statusText);
      return null;
    }
  };

  return { formattingSubwayCode, checkDay };
};
