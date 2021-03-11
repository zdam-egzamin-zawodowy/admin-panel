import useUsers from './UsersPage.useUsers';
import { NumberParam, useQueryParams, withDefault } from 'use-query-params';
import SortParam, { decodeSort } from 'libs/serialize-query-params/SortParam';
import { validateRowsPerPage } from 'common/Table/helpers';
import { DEFAULT_SORT, COLUMNS } from './constants';

import { Container, Paper } from '@material-ui/core';
import Table from 'common/Table/Table';

const UsersPage = () => {
  const [{ page, sort, ...rest }, setQueryParams] = useQueryParams({
    limit: NumberParam,
    page: withDefault(NumberParam, 0),
    sort: withDefault(SortParam, DEFAULT_SORT),
  });
  const limit = validateRowsPerPage(rest.limit);
  const { users, total, loading } = useUsers(page, limit, sort.toString());
  console.log(users);

  return (
    <Container>
      <Paper>
        <Table
          selection
          columns={COLUMNS}
          data={users}
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
