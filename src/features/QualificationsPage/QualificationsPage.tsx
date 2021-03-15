import { useState } from 'react';
import { ApolloError, useMutation } from '@apollo/client';
import { useUpdateEffect } from 'react-use';
import {
  NumberParam,
  StringParam,
  useQueryParams,
  withDefault,
} from 'use-query-params';
import { useSnackbar } from 'notistack';
import SortParam, { decodeSort } from 'libs/serialize-query-params/SortParam';
import { useScrollToElement } from 'libs/hooks';
import useQualifications from './QualificationsPage.useQualifications';
import { validateRowsPerPage } from 'common/Table/helpers';
import {
  MUTATION_CREATE_QUALIFICATION,
  MUTATION_UPDATE_QUALIFICATION,
  MUTATION_DELETE_QUALIFICATIONS,
} from './mutations';

import { COLUMNS, DEFAULT_SORT, DialogType } from './constants';
import {
  Maybe,
  MutationCreateQualificationArgs,
  MutationDeleteQualificationsArgs,
  MutationUpdateQualificationArgs,
  Qualification,
  QualificationInput,
} from 'libs/graphql/types';
import {
  Button,
  Container,
  IconButton,
  Paper,
  Snackbar,
} from '@material-ui/core';
import { Edit as EditIcon } from '@material-ui/icons';
import Table from 'common/Table/Table';
import TableToolbar from './components/TableToolbar/TableToolbar';
import FormDialog from './components/FormDialog/FormDialog';

const QualificationsPage = () => {
  const [createQualificationMutation] = useMutation<
    any,
    MutationCreateQualificationArgs
  >(MUTATION_CREATE_QUALIFICATION, { ignoreResults: true });
  const [updateQualificationMutation] = useMutation<
    any,
    MutationUpdateQualificationArgs
  >(MUTATION_UPDATE_QUALIFICATION, { ignoreResults: true });
  const [deleteQualificationsMutation] = useMutation<
    any,
    MutationDeleteQualificationsArgs
  >(MUTATION_DELETE_QUALIFICATIONS, { ignoreResults: true });
  const [dialogType, setDialogType] = useState<DialogType>(DialogType.None);
  const [qualificationBeingEdited, setQualificationBeingEdited] = useState<
    Maybe<Qualification>
  >(null);
  const [selectedQualifications, setSelectedQualifications] = useState<
    Qualification[]
  >([]);
  const snackbar = useSnackbar();
  const [{ page, sort, search, ...rest }, setQueryParams] = useQueryParams({
    limit: NumberParam,
    page: withDefault(NumberParam, 0),
    sort: withDefault(SortParam, DEFAULT_SORT),
    search: withDefault(StringParam, ''),
  });
  const limit = validateRowsPerPage(rest.limit);
  const { qualifications, total, loading, refetch } = useQualifications(
    page,
    limit,
    sort.toString(),
    search
  );

  useScrollToElement(document.documentElement, [page, limit, sort, search]);

  useUpdateEffect(() => {
    if (selectedQualifications.length > 0) {
      setSelectedQualifications([]);
    }
  }, [qualifications]);

  const handleFormDialogSubmit = async (input: QualificationInput) => {
    try {
      if (dialogType === DialogType.Create) {
        await createQualificationMutation({ variables: { input } });
      } else {
        await updateQualificationMutation({
          variables: { input, id: qualificationBeingEdited?.id ?? -1 },
        });
      }
      await refetch();
      snackbar.enqueueSnackbar(
        dialogType === DialogType.Create
          ? 'Pomyślnie utworzono kwalifikację.'
          : 'Zapisano zmiany.',
        { variant: 'success' }
      );
      return true;
    } catch (e) {
      snackbar.enqueueSnackbar(
        e instanceof ApolloError && e.graphQLErrors.length > 0
          ? e.graphQLErrors[0].message
          : e.message,
        { variant: 'error' }
      );
    }
    return false;
  };

  const handleDeleteQualifications = async () => {
    if (!window.confirm('Czy na pewno chcesz usunąć wybrane kwalifikacje?')) {
      return;
    }
    try {
      const ids = selectedQualifications.map(qualification => qualification.id);
      await deleteQualificationsMutation({ variables: { ids } });
      await refetch();
      snackbar.enqueueSnackbar(`Usuwanie przebiegło pomyślnie.`, {
        variant: 'success',
      });
    } catch (e) {
      snackbar.enqueueSnackbar(
        e instanceof ApolloError && e.graphQLErrors.length > 0
          ? e.graphQLErrors[0].message
          : e.message,
        { variant: 'error' }
      );
    }
  };

  const handleSelect = (checked: boolean, items: Qualification[]) => {
    setSelectedQualifications(prevState =>
      checked
        ? [...prevState, ...items]
        : prevState.filter(
            item => !items.some(otherItem => otherItem.id === item.id)
          )
    );
  };

  return (
    <Container>
      <Paper>
        <TableToolbar
          search={search}
          onClickCreateQualification={() => {
            setQualificationBeingEdited(null);
            setDialogType(DialogType.Create);
          }}
          onChangeSearchValue={val => {
            setQueryParams({ page: 0, search: val });
          }}
        />
        <Table
          selection
          columns={COLUMNS}
          data={qualifications}
          selected={selectedQualifications}
          onSelect={handleSelect}
          actions={[
            {
              icon: row => {
                return (
                  <IconButton
                    onClick={() => {
                      setQualificationBeingEdited(row);
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
        qualification={qualificationBeingEdited}
        onSubmit={handleFormDialogSubmit}
        onClose={() => setDialogType(DialogType.None)}
      />
      <Snackbar
        open={selectedQualifications.length > 0}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        message={`Wybrane kwalifikacje: ${selectedQualifications.length}`}
        action={
          <>
            <Button onClick={handleDeleteQualifications} color="secondary">
              Usuń
            </Button>
            <Button
              color="secondary"
              onClick={() => setSelectedQualifications([])}
            >
              Anuluj
            </Button>
          </>
        }
      />
    </Container>
  );
};

export default QualificationsPage;
