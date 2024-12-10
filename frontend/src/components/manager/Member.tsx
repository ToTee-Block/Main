export interface Member {
  id: number;
  email: string;
  username: string;
  createDate: string;
}

export interface SearchFilters {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
}
