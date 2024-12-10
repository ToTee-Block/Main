import React from "react";
import styles from "@/styles/components/manager/serchFilter.module.scss";

// SearchFilters 인터페이스를 직접 정의
interface SearchFilters {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
}

interface SerchFilterProps {
  searchTerm: string;
  searchFilters: SearchFilters;
  setSearchTerm: (value: string) => void;
  setSearchFilters: React.Dispatch<React.SetStateAction<SearchFilters>>;
  onSearch: () => void;
}

const SerchFilter: React.FC<SerchFilterProps> = ({
  searchTerm,
  searchFilters,
  setSearchTerm,
  setSearchFilters,
  onSearch,
}) => {
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSearchFilters({
      ...searchFilters,
      [name]: value,
    });
  };

  return (
    <div className={styles.searchSection}>
      <input
        type="text"
        placeholder="Search"
        className={styles.searchInput}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className={styles.filterSection}>
        <button className={styles.filterButton}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        <input
          type="text"
          name="id"
          placeholder="Id"
          className={styles.filterInput}
          value={searchFilters.id}
          onChange={handleFilterChange}
        />
        <input
          type="text"
          name="name"
          placeholder="Name"
          className={styles.filterInput}
          value={searchFilters.name}
          onChange={handleFilterChange}
        />
        <div className={styles.dateRange}>
          <input
            type="date"
            name="startDate"
            className={styles.dateInput}
            value={searchFilters.startDate}
            onChange={handleFilterChange}
          />
          <span>-</span>
          <input
            type="date"
            name="endDate"
            className={styles.dateInput}
            value={searchFilters.endDate}
            onChange={handleFilterChange}
          />
        </div>
        <button className={styles.searchButton} onClick={onSearch}>
          검색
        </button>
      </div>
    </div>
  );
};

export default SerchFilter;
