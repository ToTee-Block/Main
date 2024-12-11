export interface Member {
  id: number;
  createdDate: string;
  modifiedDate: string;
  email: string;
  name: string;
  birthDate: string;
  gender: string;
  profileImg: string | null;
  role: string;
  myMentors: any[];
  reviews: any[];
}

export interface SearchFilters {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
}
