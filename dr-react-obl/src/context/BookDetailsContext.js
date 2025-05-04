import { createContext, useContext, useState } from 'react';

const BookDetailsContext = createContext();

export function BookDetailsProvider({ children }) {
  const [bookDetails, setBookDetails] = useState({});
  
  const updateBookDetails = (isbn, data) => {
    setBookDetails(prev => ({
      ...prev,
      [isbn]: data
    }));
  };

  return (
    <BookDetailsContext.Provider value={{ bookDetails, updateBookDetails }}>
      {children}
    </BookDetailsContext.Provider>
  );
}

export function useBookDetails() {
  return useContext(BookDetailsContext);
}