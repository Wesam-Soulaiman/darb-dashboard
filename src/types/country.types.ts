export type Country = {
  id: number;
  name: string;
  codeName: string;
};

export type CountriesResponse = {
  data: Country[];
};
