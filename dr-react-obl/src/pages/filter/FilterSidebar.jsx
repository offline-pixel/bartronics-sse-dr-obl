import React, { useState, useEffect } from 'react';
import '../../app/scss/FilterSidebar.scss';
import Select from 'react-select';
import { useApi } from '../../context/ApiContext';

const FilterSidebar = ({ onClose }) => {
  const { fetchData, loading, hasMore, fetchGenres, genres, error, activeFilters } = useApi();
    const [genre, setGenre] = useState(activeFilters.genre || '');
    const [author, setAuthor] = useState(activeFilters.author || '');
    const [year, setYear] = useState(activeFilters.year || '');
  
  useEffect(() => {
    if (!genres || genres.length === 0) {
      fetchGenres();
    }
  }, [fetchGenres, genres]);

  const handleApply = () => {
    const newFilters = {
      ...(genre && { genre }),
      ...(author && { author }),
      ...(year && { year })
    };
    fetchData(newFilters, true); // true = reset page to 1
    onClose();
  };

  const genreOptions = Array.isArray(genres) 
    ? genres.map((g) => ({ value: g, label: g }))
    : [];

  return (
    <div className="filter-container">
      <h3 className="filter-title">Filter Books</h3>
      {error && <div className="error-message">{error}</div>} 
      <div className="filter-content">
        <div className="filter-group">
          <label>Genre</label>
          <Select
            value={genreOptions.find((opt) => opt.value === genre)} 
            onChange={(selected) => setGenre(selected.value)}
            options={genreOptions}
            placeholder="Select a genre"
            classNamePrefix="custom-select"
          />
        </div>

        <div className="filter-group">
          <label>Author</label>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="e.g. Tolkien"
          />
        </div>

        <div className="filter-group">
          <label>Publication Year</label>
          <input
            type="text"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            placeholder="e.g. 2021"
          />
        </div>
      </div>

      <div className="filter-buttons">
        <button className="apply-btn" onClick={handleApply} disabled={loading}>
          {loading ? 'Applying...' : 'Apply'}
        </button>
        <button className="close-btn" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default FilterSidebar;
