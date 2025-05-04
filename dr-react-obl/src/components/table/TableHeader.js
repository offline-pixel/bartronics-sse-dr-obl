// TableHeader.js
import React from 'react';

const TableHeader = ({ columns, sortConfig, handleColumnClick }) => {
  // console.log(columns)
  // Function to get header class name
  const getHeaderClassName = (accessor) => {
    return sortConfig.key === accessor ? `sorted ${sortConfig.direction}` : '';
  };

  // Function to get sort indicator
  const getSortIndicator = (accessor) => {
    return sortConfig.key === accessor && (
      sortConfig.direction === 'ascending' ? ' 🔼' : sortConfig.direction === 'descending' ? ' 🔽' : ' ↕️'
    );
  };

  return (
    <thead className="sticky-header">
      <tr>
        {columns.map((column) => (
          <th
            key={column.Header}
            onClick={() => handleColumnClick(column.accessor, column.isSortable)}
            className={getHeaderClassName(column.accessor)}
          >
            <div>{column.Header}
              {column.isSortable && (
                <span className="sort-indicator">
                  {getSortIndicator(column.accessor)}
                </span>
              )}
            </div>
          </th>
        ))}
      </tr>
    </thead>
  );
};

export default TableHeader;
