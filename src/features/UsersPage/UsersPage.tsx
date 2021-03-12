import useUsers from './UsersPage.useUsers';
import {
  NumberParam,
  useQueryParams,
  withDefault,
  StringParam,
} from 'use-query-params';
import SortParam, { decodeSort } from 'libs/serialize-query-params/SortParam';
import { validateRowsPerPage } from 'common/Table/helpers';
import { DEFAULT_SORT, COLUMNS } from './constants';

import { Container, IconButton, Paper } from '@material-ui/core';
import { Edit as EditIcon } from '@material-ui/icons';
import Table from 'common/Table/Table';
import TableToolbar from './components/TableToolbar/TableToolbar';

const UsersPage = () => {
  const [{ page, sort, search, ...rest }, setQueryParams] = useQueryParams({
    limit: NumberParam,
    page: withDefault(NumberParam, 0),
    sort: withDefault(SortParam, DEFAULT_SORT),
    search: withDefault(StringParam, ''),
  });
  const limit = validateRowsPerPage(rest.limit);
  const { users, total, loading } = useUsers(
    page,
    limit,
    sort.toString(),
    search
  );
  console.log(users);

  return (
    <Container>
      <Paper>
        <TableToolbar
          search={search}
          onChangeSearchValue={val => {
            setQueryParams({ page: 0, search: val });
          }}
        />
        <Table
          selection
          columns={COLUMNS}
          data={users}
          actions={[
            {
              icon: row => {
                return (
                  <IconButton>
                    <EditIcon />
                  </IconButton>
                );
              },
              tooltip: 'Edytuj',
            },
          ]}
          loading={loading}
          orderBy={sort.orderBy}
          orderDirection={sort.orderDirection}
          onRequestSort={(orderBy, orderDirection) => {
            setQueryParams({
              page: 0,
              sort: decodeSort(orderBy + ' ' + orderDirection),
            });
          }}
          footerProps={{
            count: total,
            page,
            onChangePage: page => {
              setQueryParams({ page });
            },
            onChangeRowsPerPage: limit => {
              setQueryParams({ page: 0, limit });
            },
            rowsPerPage: limit,
          }}
        />
      </Paper>
    </Container>
  );
};

export default UsersPage;
