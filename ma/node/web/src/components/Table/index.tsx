import {
  Table as EcfTable,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableSortLabel,
  Pagination,
} from '@super_studio/ecforce_ui_albers';
import { useState } from 'react';

interface RowData {
  [key: string]: any;
}

export interface ColumnDef {
  field: string;
  title?: string;
  sortable?: boolean;
  render?: (rowData: RowData) => React.ReactNode;
}

interface SortData {
  field?: string;
  direction?: 'asc' | 'desc';
}

const Table: React.FC<{
  data: RowData[];
  columnDefs: ColumnDef[];
  onSort?: (
    sortData: { field: string; direction: 'asc' | 'desc' } | null
  ) => void;
  page?: number;
  totalItems?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
}> = ({
  data,
  columnDefs,
  onSort,
  page,
  totalItems,
  pageSize,
  onPageChange,
}) => {
  const [sortData, setSortData] = useState<SortData>({});

  const Pages = () => (
    <div className="flex justify-end my-3">
      {page && pageSize && totalItems !== undefined && (
        <Pagination
          page={page}
          totalItems={totalItems}
          pageSize={pageSize}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );

  return (
    <>
      <Pages />
      <EcfTable>
        <TableHead>
          <TableRow>
            {columnDefs.map((columnDef) => (
              <TableCell key={columnDef.field}>
                {columnDef.sortable ? (
                  <TableSortLabel
                    active={sortData.field === columnDef.field}
                    direction={
                      sortData.field === columnDef.field
                        ? sortData.direction
                        : undefined
                    }
                    onClick={(
                      sortData: {
                        active: boolean;
                        direction: 'asc' | 'desc';
                      } | null
                    ) => {
                      if (!sortData) {
                        setSortData({});
                        onSort && onSort(null);
                      } else {
                        setSortData({
                          field: columnDef.field,
                          direction: sortData.direction,
                        });
                        onSort &&
                          onSort({
                            field: columnDef.field,
                            direction: sortData.direction,
                          });
                      }
                    }}
                  >
                    {columnDef.title || columnDef.field}
                  </TableSortLabel>
                ) : (
                  columnDef.title || columnDef.field
                )}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={index}>
              {columnDefs.map(({ field, render }) => (
                <TableCell key={`${index}-${field}`}>
                  {render ? render(row) : row[field]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </EcfTable>
      <Pages />
    </>
  );
};

export default Table;
