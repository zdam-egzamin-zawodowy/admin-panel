import { useState } from 'react';
import {
  NumberParam,
  StringParam,
  useQueryParams,
  withDefault,
} from 'use-query-params';
import SortParam, { decodeSort } from 'libs/serialize-query-params/SortParam';
import useUsers from './UsersPage.useUsers';
import {
  Maybe,
  MutationCreateUserArgs,
  MutationUpdateUserArgs,
  User,
  UserInput,
} from 'libs/graphql/types';
import { validateRowsPerPage } from 'common/Table/helpers';
import { COLUMNS, DEFAULT_SORT, DialogType } from './constants';

import { Container, IconButton, Paper } from '@material-ui/core';
import { Edit as EditIcon } from '@material-ui/icons';
import Table from 'common/Table/Table';
import TableToolbar from './components/TableToolbar/TableToolbar';
import FormDialog from './components/FormDialog/FormDialog';
import { ApolloError, useMutation } from '@apollo/client';
import { MUTATION_CREATE_USER, MUTATION_UPDATE_USER } from './mutations';
import { useSnackbar } from 'material-ui-snackbar-provider';

const UsersPage = () => {
  const [createUserMutation] = useMutation<any, MutationCreateUserArgs>(
    MUTATION_CREATE_USER,
    { ignoreResults: true }
  );
  const [updateUserMutation] = useMutation<any, MutationUpdateUserArgs>(
    MUTATION_UPDATE_USER,
    { ignoreResults: true }
  );
  const [dialogType, setDialogType] = useState<DialogType>(DialogType.None);
  const [userBeingEdited, setUserBeingEdited] = useState<Maybe<User>>(null);
  const snackbar = useSnackbar();
  const [{ page, sort, search, ...rest }, setQueryParams] = useQueryParams({
    limit: NumberParam,
    page: withDefault(NumberParam, 0),
    sort: withDefault(SortParam, DEFAULT_SORT),
    search: withDefault(StringParam, ''),
  });
  const limit = validateRowsPerPage(rest.limit);
  const { users, total, loading, refetch } = useUsers(
    page,
    limit,
    sort.toString(),
    search
  );

  const handleFormDialogSubmit = async (input: UserInput) => {
    try {
      if (dialogType === DialogType.Create) {
        await createUserMutation({ variables: { input } });
      } else {
        await updateUserMutation({
          variables: { input, id: userBeingEdited?.id ?? -1 },
        });
      }
      await refetch();
      return true;
    } catch (e) {
      snackbar.showMessage(
        e instanceof ApolloError && e.graphQLErrors.length > 0
          ? e.graphQLErrors[0].message
          : e.message
      );
    }
    return false;
  };

  return (
    <Container>
      <Paper>
        <TableToolbar
          search={search}
          onClickCreateUser={() => {
            setUserBeingEdited(null);
            setDialogType(DialogType.Create);
          }}
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
                  <IconButton
                    onClick={() => {
                      setUserBeingEdited(row);
                      setDialogType(DialogType.Edit);
                    }}
                  >
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
      <FormDialog
        open={
          dialogType === DialogType.Create || dialogType === DialogType.Edit
        }
        user={userBeingEdited as UserInput}
        onSubmit={handleFormDialogSubmit}
        onClose={() => setDialogType(DialogType.None)}
      />
    </Container>
  );
};

export default UsersPage;
