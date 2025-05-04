import { useState, useMemo } from 'react';

// Define an array of sortable keys
// const sortableKeys = ['sequence', 'estimatedReadingTimeMinutes', /* Add more keys here */]; // more keys must be added here to make this more dynamic and reusable

export function useTableState(data) {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'default' });
  const [expandedRows, setExpandedRows] = useState({});

  const toggleRowExpansion = (index) => {
    setExpandedRows((prevRows) => {
      if (Object.keys(prevRows).length === 0 || !prevRows[index]) {
        // If the object is empty or the clicked index is not the same, set only the clicked index to true
        return { [index]: true };
      } else {
        // If the clicked index is the same, remove it from the object
        const updatedExpandedRows = { ...prevRows };
        delete updatedExpandedRows[index];
        return updatedExpandedRows;
      }
    });
  };  

  const handleColumnClick = (accessor, isSortable) => {
    if (isSortable) {
      sortData(accessor);
    }
  };

  const sortData = (key) => {
    // Sorting logic here...
    let direction = 'ascending';
    if (sortConfig.key === key) {
      if (sortConfig.direction === 'ascending') {
        direction = 'descending';
      } else if (sortConfig.direction === 'descending') {
        direction = 'default';
      }
    }

    setSortConfig({ key, direction });
  };

  const sortedData = useMemo(() => {
    // Sorting logic here...
    const extracts = data || [];
    if (!sortConfig.key) return extracts;

    return extracts.slice().sort((a, b) => {
      const keyA = a[sortConfig.key];
      const keyB = b[sortConfig.key];

      if (sortConfig.key === 'sequence' || sortConfig.key === 'estimatedReadingTimeMinutes') { // this need to be robust in separate array
        const numA = parseFloat(keyA);
        const numB = parseFloat(keyB);

        if (sortConfig.direction === 'ascending') {
          return numA - numB;
        } else if (sortConfig.direction === 'descending') {
          return numB - numA;
        } else {
          return 0;
        }
      } else {
        if (sortConfig.direction === 'ascending') {
          return keyA.localeCompare(keyB);
        } else if (sortConfig.direction === 'descending') {
          return keyB.localeCompare(keyA);
        } else {
          return 0;
        }
      }
    });
  }, [sortConfig, data]);

  const rowsWithSequence = useMemo(() => {
    // Add sequence numbers to each row...
    return sortedData.map((row, index) => ({
        ...row,
        sequence: index + 1,
    }));
  }, [sortedData]);

  return {
    sortConfig,
    expandedRows,
    toggleRowExpansion,
    handleColumnClick,
    // columns,
    rowsWithSequence,
  };
}
