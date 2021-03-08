import React from 'react';
import { validateRowsPerPage, isObjKey } from './helpers';
import { Action, Column, OrderDirection } from './types';

import {
  Table as MUITable,
  TableBody,
  TableProps,
  TableBodyProps,
  TableContainer,
} from '@material-ui/core';
import TableHead from './TableHead';
import TableRow from './TableRow';
import TableLoading from './TableLoading';
import TableEmpty from './TableEmpty';
import TableFooter, { TableFooterProps } from './TableFooter';

export interface Props<T> {
  columns: Column<T>[];
  actions?: Action<T>[];
  data: T[];
  orderBy?: string;
  orderDirection?: OrderDirection;
  selection?: boolean;
  idFieldName?: string;
  getRowKey?: (row: T, index: number) => string | number | null | undefined;
  onRequestSort?: (
    orderBy: string,
    orderDirection: OrderDirection
  ) => void | Promise<void>;
  onSelect?: (rows: T[]) => void;
  loading?: boolean;
  tableProps?: TableProps;
  tableBodyProps?: TableBodyProps;
  footerProps?: TableFooterProps;
  hideFooter?: boolean;
  size?: 'medium' | 'small';
  selected?: T[];
}

function Table<T>({
  columns,
  data,
  orderBy = '',
  orderDirection = 'asc',
  onRequestSort,
  idFieldName = 'id',
  selection = false,
  loading = false,
  actions = [],
  tableBodyProps = {},
  tableProps = {},
  hideFooter = false,
  footerProps = {},
  size,
  selected,
  onSelect,
  getRowKey,
}: Props<T>) {
  const headColumns =
    actions.length > 0
      ? [...columns, { field: 'action', label: 'Akcje' }]
      : columns;
  const preparedFooterProps = {
    page: 0,
    rowsPerPage: validateRowsPerPage(
      footerProps?.rowsPerPage,
      footerProps?.rowsPerPageOptions
    ),
    count: data.length,
    size: size,
    ...footerProps,
  };

  const isSelected = (row: T): boolean => {
    return (
      Array.isArray(selected) &&
      selected.some(
        otherRow =>
          isObjKey(otherRow, idFieldName) &&
          isObjKey(row, idFieldName) &&
          otherRow[idFieldName] === row[idFieldName]
      )
    );
  };

  return (
    <TableContainer>
      <MUITable size={size} {...tableProps}>
        <TableHead
          columns={headColumns}
          selection={selection}
          orderBy={orderBy}
          orderDirection={orderDirection}
          onRequestSort={onRequestSort}
          size={size}
          onSelectAll={() => {
            if (onSelect) {
              onSelect(data);
            }
          }}
          allSelected={selected?.length === data.length}
        />
        <TableBody {...tableBodyProps}>
          {loading ? (
            <TableLoading
              columns={headColumns}
              size={size}
              rowsPerPage={preparedFooterProps.rowsPerPage}
            />
          ) : data.length > 0 ? (
            data.map((item, index) => {
              return (
                <TableRow
                  key={
                    getRowKey
                      ? getRowKey(item, index)
                      : isObjKey(item, idFieldName)
                      ? item[idFieldName] + ''
                      : index
                  }
                  index={index}
                  row={item}
                  actions={actions}
                  selected={isSelected(item)}
                  selection={selection}
                  columns={columns}
                  size={size}
                  onSelect={row => {
                    if (onSelect) {
                      onSelect([row]);
                    }
                  }}
                />
              );
            })
          ) : (
            <TableEmpty />
          )}
        </TableBody>
        {!hideFooter && (
          <TableFooter
            size={size}
            {...preparedFooterProps}
            count={
              loading
                ? preparedFooterProps.page *
                  (preparedFooterProps.rowsPerPage + 1)
                : preparedFooterProps.count
            }
          />
        )}
      </MUITable>
    </TableContainer>
  );
}

export default Table;
