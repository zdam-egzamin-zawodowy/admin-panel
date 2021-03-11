import { decodeSort } from 'libs/serialize-query-params/SortParam';
import { formatRole } from './utils';
import { Column } from 'common/Table/types';
import { User } from 'libs/graphql/types';

export const DEFAULT_SORT = decodeSort('id DESC');
export const COLUMNS: Column<User>[] = [
  {
    field: 'id',
    sortable: true,
    label: 'ID',
  },
  {
    field: 'displayName',
    sortable: true,
    label: 'Użytkownik',
    valueFormatter: v => {
      return `${v.displayName} (${v.email})`;
    },
  },
  {
    field: 'role',
    sortable: false,
    label: 'Rola',
    valueFormatter: v => formatRole(v.role),
  },
  {
    field: 'activated',
    sortable: false,
    label: 'Aktywowany',
    valueFormatter: v => (v.activated ? 'Tak' : 'Nie'),
  },
  {
    field: 'createdAt',
    sortable: true,
    label: 'Data utworzenia',
    type: 'datetime',
  },
];
