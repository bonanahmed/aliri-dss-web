export type LocationData = {
  code: string;
  name: string;
  golongan: string;
  luas_baku: string;
  date_plants?: Array<DatePlant>;
};

export type DatePlant = {
  date: string;
} & PastenData;

export type PastenDataDetail = {
  actual_water_needed?: number | 0;
  raw_material_area_planted?: number | 0;
};
export type PastenData = {
  color: string;
  code: string;
  plant_type: string;
  growth_time: string;
  pasten: string;
} & PastenDataDetail;

export type TimeList = {
  time_list: Array<string>;
  label: string;
};
