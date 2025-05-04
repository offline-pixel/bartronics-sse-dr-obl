const DefaultCell = ({ value, column, row }) => {
  return column.Cell ? column.Cell({ value, row: { original: row } }) : value
};

export default DefaultCell;
