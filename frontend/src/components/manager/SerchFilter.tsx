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
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSearchFilters({
      ...searchFilters,
      [name]: value,
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSearch();
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.filterContainer}>
        <div className={styles.filterRow}>
          <div className={styles.imageBox}>
            <Image
              src="/icon/manager_searchbox.svg"
              alt="filter"
              width={19.5}
              height={22.5}
            />
          </div>
          <div className={styles.divider}></div>
          <div className={styles.inputGroup}>
            <input
              type="text"
              name="id"
              placeholder="Id"
              value={searchFilters.id}
              onChange={handleChange}
              onKeyPress={handleKeyPress}
              className={styles.filterInput}
            />
            <div className={styles.divider}></div>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={searchFilters.name}
              onChange={handleChange}
              onKeyPress={handleKeyPress}
              className={styles.filterInput}
            />
            <div className={styles.divider}></div>
            <div className={styles.dateRange}>
              <input
                type="date"
                name="startDate"
                value={searchFilters.startDate}
                onChange={handleChange}
                className={styles.filterInput}
              />
              <span>~</span>
              <input
                type="date"
                name="endDate"
                value={searchFilters.endDate}
                onChange={handleChange}
                className={styles.filterInput}
              />
            </div>
            <div className={styles.divider}></div>
            <button className={styles.searchButton} onClick={onSearch}>
              <Image
                src="/icon/manager_search.svg"
                alt="search"
                width={15}
                height={15}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchFilter;
