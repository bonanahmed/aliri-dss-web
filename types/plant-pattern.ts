export type AreaData = {
  code: string;
  name: string;
  golongan: string;
  luas_baku: string;
  detail?: any;
  plant_patterns?: Array<PlantPattern>;
  plant_pattern_plannings?: Array<PlantPattern>;
};

export type PlantPattern = {
  date: string;
} & PastenData;

export type PastenDataDetail = {
  actual_water_needed?: number | 0;
  raw_material_area_planted?: number | 0;
  water_flow?: number | 0;
};
export type PastenData = {
  color: string;
  code: string;
  plant_type: string;
  growth_time: string;
  pasten: number;
} & PastenDataDetail;

export type TimeSeries = {
  dateList: Array<string>;
  label: string;
};
