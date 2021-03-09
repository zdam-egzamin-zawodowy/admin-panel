import useUsers from './UsersPage.useUsers';
import { NumberParam, useQueryParams, withDefault } from 'use-query-params';
import SortParam, { decodeSort } from 'libs/serialize-query-params/SortParam';
import { validateRowsPerPage } from 'common/Table/helpers';

const DEFAULT_SORT = decodeSort('id DESC');

const UsersPage = () => {
  const [{ page, sort, ...rest }, setQuery] = useQueryParams({
    limit: NumberParam,
    page: withDefault(NumberParam, 0),
    sort: withDefault(SortParam, DEFAULT_SORT),
  });
  const limit = validateRowsPerPage(rest.limit);
  const data = useUsers(page, limit, sort.toString());
  console.log(data);

  return <div>UsersPage</div>;
};

export default UsersPage;
