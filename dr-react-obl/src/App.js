import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';
import BookDetails from './pages/BookDetails'; // Lazy component we'll create
import React, { lazy, Suspense, useState, useEffect, useCallback } from 'react';
import './App.scss';
import Header from './components/Header';
import Footer from './components/Footer';
import Table from './components/table/Table';
import FilterSidebar from './pages/filter/FilterSidebar';
import Loader from './components/Loader';
import { Helmet } from 'react-helmet';
import { bookExtractColumns } from './pages/book-extracts/bookExtractColumns';
import { useApi } from './context/ApiContext';

// Lazy-load the details page
const LazyBookDetails = lazy(() => import('./pages/BookDetails'));

function HomePage() {
  const { data, fetchData, loading, hasMore, activeFilters } = useApi();
  const [viewType, setViewType] = useState('list');
  const [showFilter, setShowFilter] = useState(false);

  const handleScroll = useCallback(() => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 && 
        hasMore && 
        !loading) {
      fetchData(activeFilters);
    }
  }, [fetchData, hasMore, loading, activeFilters]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <div className="App">
      <Helmet>
        <meta charSet="UTF-8" />
        <title>Open Book Library</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Helmet>

      <Header 
        toggleViewType={() => setViewType(v => v === 'grid' ? 'list' : 'grid')} 
        onToggleFilter={() => setShowFilter(v => !v)} 
      />

      <main className="main">
        <div className="table-wrapper">
          <Table data={data} columns={bookExtractColumns} viewType={viewType} />
          {loading && <Loader />}
        </div>
        {showFilter && (
          <div className="filter-sidebar">
            <FilterSidebar onClose={() => setShowFilter(false)} />
          </div>
        )}
      </main>

      <Footer className="footer" />
    </div>
  );
}

function App() {
  return (
    <Router>
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/book/:isbn" element={<LazyBookDetails />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
