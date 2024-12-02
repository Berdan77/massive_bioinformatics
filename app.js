import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useTable, useFilters, usePagination } from 'react-table';
import './App.css';

// Filtreleme bileşeni
const DefaultColumnFilter = ({
  column: { filterValue, setFilter },
}) => {
  return (
    <input
      value={filterValue || ''}
      onChange={e => {
        setFilter(e.target.value || undefined); // Undefined is the same as '' for the filter
      }}
      placeholder={`Filter...`}
    />
  );
};

// Ana uygulama bileşeni
const App = () => {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // API'den veri çekme
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios('https://rickandmortyapi.com/api/character');
        setCharacters(result.data.results);
      } catch (error) {
        setError('Error fetching data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Tablo oluşturma
  const columns = React.useMemo(
    () => [
      {
        Header: 'ID',
        accessor: 'id',
      },
      {
        Header: 'Name',
        accessor: 'name',
        Filter: DefaultColumnFilter, // Filtreleme bileşeni
      },
      {
        Header: 'Status',
        accessor: 'status',
        Filter: DefaultColumnFilter, // Filtreleme bileşeni
      },
      {
        Header: 'Species',
        accessor: 'species',
        Filter: DefaultColumnFilter, // Filtreleme bileşeni
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state,
    setPageSize,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    gotoPage,
    nextPage,
    previousPage,
    setFilter,
  } = useTable(
    {
      columns,
      data: characters,
      initialState: { pageSize: 10 }, // Başlangıçta 10 satır göster
    },
    useFilters,
    usePagination
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Rick and Morty Characters</h1>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps()}>
                  {column.render('Header')}
                  <div>{column.canFilter ? column.render('Filter') : null}</div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length}>No results found</td>
            </tr>
          ) : (
            rows.map(row => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map(cell => (
                    <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                  ))}
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      <div>
        <span>
          Show
          <select
            value={state.pageSize}
            onChange={e => {
              setPageSize(Number(e.target.value));
            }}
          >
            {[10, 20, 30, 50].map(pageSize => (
              <option key={pageSize} value={pageSize}>
                {pageSize}
              </option>
            ))}
          </select>
          entries
        </span>
      </div>

      <div>
        <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {'<<'}
        </button>
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          {'<'}
        </button>
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          {'>'}
        </button>
        <button onClick={() => gotoPage(pageOptions.length - 1)} disabled={!canNextPage}>
          {'>>'}
        </button>
      </div>
    </div>
  );
};

export default App;
