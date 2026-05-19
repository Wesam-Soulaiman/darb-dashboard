export type Governate = {
  id: number;
  name: string;
  countryId: number;
  createdAt: string;
  updatedAt: string;
};

export type GovernatesResponse = {
  data: Governate[];
};

export type GetGovernatesParams = {
  countryId?: number;
  countryCode?: string;
  search?: string;
};
