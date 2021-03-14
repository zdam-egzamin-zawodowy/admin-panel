import { decodeSort } from 'libs/serialize-query-params/SortParam';
import { Column } from 'common/Table/types';
import { Question } from 'libs/graphql/types';

export const DEFAULT_SORT = decodeSort('id DESC');
export const COLUMNS: Column<Question>[] = [
  {
    field: 'id',
    sortable: true,
    label: 'ID',
  },
  {
    field: 'from',
    sortable: true,
    label: 'Z',
  },
  {
    field: 'content',
    sortable: true,
    label: 'Treść',
  },
  {
    field: 'qualification',
    sortable: false,
    label: 'Kwalifikacja',
    valueFormatter: v => {
      return `${v.qualification?.code ?? '-'} (ID: ${
        v.qualification?.id ?? 0
      })`;
    },
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
