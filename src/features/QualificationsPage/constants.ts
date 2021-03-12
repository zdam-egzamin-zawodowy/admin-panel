import { decodeSort } from 'libs/serialize-query-params/SortParam';
import { Column } from 'common/Table/types';
import { Qualification } from 'libs/graphql/types';

export const DEFAULT_SORT = decodeSort('id DESC');
export const COLUMNS: Column<Qualification>[] = [
  {
    field: 'id',
    sortable: true,
    label: 'ID',
  },
  {
    field: 'formula',
    sortable: true,
    label: 'Formuła',
  },
  {
    field: 'name',
    sortable: true,
    label: 'Nazwa',
    valueFormatter: v => `${v.name} (${v.code})`,
  },
  {
    field: 'createdAt',
    sortable: true,
    label: 'Data utworzenia',
    type: 'datetime',
  },
];
export enum DialogType {
  Create = 'create',
  Edit = 'edit',
  None = '',
}
