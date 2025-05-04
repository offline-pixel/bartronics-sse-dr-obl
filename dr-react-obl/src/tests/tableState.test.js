import { renderHook, act } from '@testing-library/react-hooks';
import { useTableState } from '../components/table/tableState'; // Import your useTableState hook

test('useTableState initializes correctly', () => {
  const data = {
    Extracts: [
      { id: 1, name: 'Extract 1' },
      { id: 2, name: 'Extract 2' },
    ],
  };

  const { result } = renderHook(() => useTableState(data));

  // Check initial values
  expect(result.current.sortConfig.key).toBe(null);
  expect(result.current.sortConfig.direction).toBe('default');
  expect(result.current.expandedRows).toEqual([]);
});

test('toggleRowExpansion adds/removes rows from expandedRows', () => {
  const data = {
    Extracts: [
      { id: 1, name: 'Extract 1' },
      { id: 2, name: 'Extract 2' },
    ],
  };

  const { result } = renderHook(() => useTableState(data));

  // Expand a row
  act(() => {
    result.current.toggleRowExpansion(1);
  });

  expect(result.current.expandedRows).toEqual([1]);

  // Collapse the same row
  act(() => {
    result.current.toggleRowExpansion(1);
  });

  expect(result.current.expandedRows).toEqual([]);
});

// Add more test cases to cover other functionality
