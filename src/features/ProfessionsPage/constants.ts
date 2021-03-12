import { decodeSort } from 'libs/serialize-query-params/SortParam';
import { Column } from 'common/Table/types';
import { Profession } from 'libs/graphql/types';

export const DEFAULT_SORT = decodeSort('id DESC');
export const COLUMNS: Column<Profession>[] = [
  {
    field: 'id',
    sortable: true,
    label: 'ID',
  },
  {
    field: 'name',
    sortable: true,
    label: 'Nazwa',
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
