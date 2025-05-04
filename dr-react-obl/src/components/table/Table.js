import React from 'react';
import TableHeader from './TableHeader';
import TableRow from '../../pages/book-extracts/TableRow';
import { useTableState } from '../../utils/table/tableState';

const Table = ({ data, columns, viewType }) => {
  const {
    sortConfig,
    expandedRows,
    toggleRowExpansion,
    handleColumnClick,
    rowsWithSequence,
  } = useTableState(data);

  return (
    <table className={`table ${viewType === 'list' ? 'grid-view' : 'list-view'}`}>
      <TableHeader
        columns={columns}
        sortConfig={sortConfig}
        handleColumnClick={handleColumnClick}
      />
      <tbody>
        {rowsWithSequence.map((row, rowIndex) => (
          <TableRow
            key={rowIndex}
            row={row}
            rowIndex={rowIndex}
            columns={columns}
            expandedRows={expandedRows}
            toggleRowExpansion={toggleRowExpansion}
          />
        ))}
      </tbody>
    </table>
  );
};

export default Table;