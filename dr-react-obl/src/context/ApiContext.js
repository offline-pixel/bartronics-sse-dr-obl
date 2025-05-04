import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { API_BASE_URL } from '../config/config';

const ApiContext = createContext();

export function useApi() {
  return useContext(ApiContext);
}

export function ApiProvider({ children }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  // const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [genres, setGenres] = useState([]);
  const [error, setError] = useState(null);
  const [activeFilters, setActiveFilters] = useState({});

  // const resetPagination = useCallback(() => {
  //   setPage(1);
  //   setHasMore(true);
  //   setData([]);
  // }, []);

const [currentPage, setCurrentPage] = useState(1);

  const fetchData = useCallback(async (newFilters = {}, resetPage = false) => {
    if (loading) return;

    // Determine if filters changed
    const filtersChanged = JSON.stringify(newFilters) !== JSON.stringify(activeFilters);
    
    // Update filters if changed
    if (filtersChanged) {
      setActiveFilters(newFilters);
      setCurrentPage(1);
      setData([]);
    }

    // Calculate page to fetch
    const pageToFetch = resetPage ? 1 : currentPage;

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/books?${new URLSearchParams({
        page: pageToFetch,
        limit: 10,
        ...(filtersChanged ? newFilters : activeFilters)
      })}`);

      const jsonData = await response.json();
      
      if (pageToFetch === 1) {
        setData(jsonData.data);
      } else {
        setData(prev => [...prev, ...jsonData.data]);
      }

      setHasMore(pageToFetch < jsonData.totalPages);
      if (!resetPage && pageToFetch < jsonData.totalPages) {
        setCurrentPage(prev => prev + 1);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [loading, activeFilters, currentPage]);

  const fetchGenres = useCallback(async () => {
    if (genres.length === 0) {
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/genres`);
        const data = await response.json();
        setGenres(data.genres || []);
      } catch (err) {
        setError('Failed to fetch genres');
      } finally {
        setLoading(false);
      }
    }
  }, [genres]);

  const fetchBookDetails = useCallback(async (isbn) => {
    try {
      const response = await fetch(`${API_BASE_URL}/books/${isbn}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching book details:', error);
      return null;
    }
  }, []);

  useEffect(() => {
    fetchData();
    fetchGenres();
  }, []);

  return (
    <ApiContext.Provider value={{
      data,
      loading,
      fetchData,
      hasMore,
      fetchGenres,
      genres,
      error,
      activeFilters, fetchBookDetails
    }}>
      {children}
    </ApiContext.Provider>
  );
}