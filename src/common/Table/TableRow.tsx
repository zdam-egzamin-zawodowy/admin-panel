import { get, isString, isNumber } from 'lodash';
import { format } from 'date-fns';
import formatNumber from 'utils/formatNumber';
import { DateFormat } from 'config/app';

import { TableRow, TableCell, Checkbox, Tooltip } from '@material-ui/core';

import { Action, Column } from './types';

export interface TableRowProps<T> {
  actions: Action<T>[];
  columns: Column<T>[];
  row: T;
  selection: boolean;
  selected: boolean;
  size?: 'small' | 'medium';
  index: number;
  onSelect?: (checked: boolean, row: T) => void;
}

function EnhancedTableRow<T>({
  actions,
  columns,
  row,
  selection = false,
  selected = false,
  onSelect,
  size = 'medium',
  index,
}: TableRowProps<T>) {
  const handleSelect = () => {
    if (onSelect) {
      onSelect(!selected, row);
    }
  };

  const formatValue = (v: string | number | Date, type: Column['type']) => {
    if ((isString(v) || isNumber(v) || v instanceof Date) && type === 'date') {
      return format(new Date(v), DateFormat.DayMonthAndYear);
    }
    if (
      (isString(v) || isNumber(v) || v instanceof Date) &&
      type === 'datetime'
    ) {
      return format(new Date(v), DateFormat.HourMinutesDayMonthAndYear);
    }
    if ((isString(v) || isNumber(v)) && type === 'number') {
      return formatNumber('commas', v);
    }
    return v;
  };

  return (
    <TableRow>
      {selection && (
        <TableCell size={size} padding="checkbox">
          <Checkbox checked={selected} onClick={handleSelect} />
        </TableCell>
      )}
      {columns.map(col => {
        const val = get(row, col.field, '');
        return (
          <TableCell
            size={size}
            key={col.field}
            padding={col.disablePadding ? 'none' : 'default'}
            align={col.align ? col.align : 'left'}
          >
            {col.valueFormatter
              ? col.valueFormatter(row, index)
              : col.type
              ? formatValue(val, col.type)
              : val}
          </TableCell>
        );
      })}
      {actions.length > 0 && (
        <TableCell size={size}>
          {actions.map((action, index) => {
            const icon =
              typeof action.icon === 'function'
                ? action.icon(row, index)
                : action.icon;
            return action.tooltip ? (
              <div key={index}>
                <Tooltip key={index} title={action.tooltip}>
                  <span>{icon}</span>
                </Tooltip>
              </div>
            ) : (
              <div key={index}>{icon}</div>
            );
          })}
        </TableCell>
      )}
    </TableRow>
  );
}

export default EnhancedTableRow;
