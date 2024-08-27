import taiwanCities, { Area, City } from '@/data/taiwanCities';

export const getAreaListByCityName = (cityName: string): Area[] => {
  const city = taiwanCities.find((c) => c.cityName === cityName);
  return city ? city.areaList : [];
};

export const getAllCityNames = (): string[] => {
  return taiwanCities.map((city) => city.cityName);
};
