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

  return (
    <div className={styles.container}>
      <div className={styles.searchWrapper}>
        <Image
          src="/icon/manager_search.svg"
          alt="search"
          width={20}
          height={20}
          className={styles.searchIcon}
        />
        <input
          type="text"
          placeholder="Search"
          className={styles.searchInput}
        />
      </div>

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
              className={styles.filterInput}
            />
            <div className={styles.divider}></div>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={searchFilters.name}
              onChange={handleChange}
              className={styles.filterInput}
            />
            <div className={styles.divider}></div>
            <div className={styles.dateRange}>
              <input
                type="text"
                name="startDate"
                placeholder="Id"
                value={searchFilters.startDate}
                onChange={handleChange}
                className={styles.filterInput}
              />
              <div className={styles.imageBox2}>
                <Image
                  src="/icon/manager_calendrier.svg"
                  alt="calendar"
                  width={22}
                  height={25}
                />
              </div>
              <span>~</span>
              <input
                type="text"
                name="endDate"
                placeholder="Id"
                value={searchFilters.endDate}
                onChange={handleChange}
                className={styles.filterInput}
              />
              <div className={styles.imageBox2}>
                <Image
                  src="/icon/manager_calendrier.svg"
                  alt="calendar"
                  width={22}
                  height={25}
                />
              </div>
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
