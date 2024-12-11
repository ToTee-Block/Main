import React from "react";
import Image from "next/image";
import styles from "@/styles/components/manager/serchFilter.module.scss";

interface SearchFilters {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
}

interface SearchFilterProps {
  searchFilters: SearchFilters;
  setSearchFilters: (filters: SearchFilters) => void;
  onSearch: () => void;
}

const SearchFilter: React.FC<SearchFilterProps> = ({
  searchFilters,
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
    <div className={styles.filterContainer}>
      <div className={styles.filterRow}>
        <Image
          src="/icon/manager_search.svg"
          alt="filter"
          width={19.5}
          height={22.5}
          className={styles.filterIcon}
        />
        <div className={styles.divider}></div>
        <div className={styles.inputGroup}>
          <input
            type="text"
            name="id"
            placeholder="Id"
            value={searchFilters.id}
            onChange={handleFilterChange}
            className={styles.filterInput}
          />
          <div className={styles.divider}></div>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={searchFilters.name}
            onChange={handleFilterChange}
            className={styles.filterInput}
          />
          <div className={styles.divider}></div>
          <input
            type="text"
            name="startDate"
            placeholder="Id"
            value={searchFilters.startDate}
            onChange={handleFilterChange}
            className={styles.filterInput}
          />
          <div className={styles.calendarWrapper}>
            <Image
              src="/icon/manager_calendrier.svg"
              alt="calendar"
              width={22}
              height={25}
            />
          </div>
          <span className={styles.dateDivider}>~</span>
          <input
            type="text"
            name="endDate"
            placeholder="Id"
            value={searchFilters.endDate}
            onChange={handleFilterChange}
            className={styles.filterInput}
          />
          <div className={styles.calendarWrapper}>
            <Image
              src="/icon/manager_calendrier.svg"
              alt="calendar"
              width={22}
              height={25}
            />
          </div>
          <div className={styles.divider}></div>
          <button className={styles.searchButton} onClick={onSearch}>
            <Image src="/icon/search.svg" alt="search" width={15} height={15} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchFilter;
