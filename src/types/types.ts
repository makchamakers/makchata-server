export type Map<T> = { [key: string]: T };
export type Optional<T> = T | null | undefined;
export type Nullable<T> = T | null;
export interface IAdress {
  addresses: {
    roadAddress: string;
    x: string;
    y: string;
  };
}

interface SubPath {
  trafficType: string; // 교통 수단 종류: "도보", "지하철", "버스" 등
  distance: number; // 이동 거리
  startName?: string; // 출발역 이름 (일부 교통 수단에만 해당)
  endName?: string; // 도착역 이름 (일부 교통 수단에만 해당)
}

export interface PathInfo {
  type: string; // 경로의 종류: "지하철" 또는 "버스"
  totalTime: number; // 총 소요 시간
  totalDistance: number; // 총 이동 거리
  payment: number; // 요금
  firstStartStation: string; // 출발역 이름
  lastEndStation: string; // 도착역 이름
  subPath: SubPath[]; // 세부적인 이동 수단 정보 배열
}

// 전체 데이터 배열
export interface JourneyData {
  pathInfo: PathInfo[];
}
