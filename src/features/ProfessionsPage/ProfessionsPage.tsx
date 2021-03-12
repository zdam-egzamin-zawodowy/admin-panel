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
import useProfessions from './ProfessionsPage.useProfessions';
import { validateRowsPerPage } from 'common/Table/helpers';
import {
  MUTATION_CREATE_PROFESSION,
  MUTATION_UPDATE_PROFESSION,
  MUTATION_DELETE_PROFESSIONS,
} from './mutations';

import { COLUMNS, DEFAULT_SORT, DialogType } from './constants';
import {
  Maybe,
  MutationCreateProfessionArgs,
  MutationDeleteProfessionsArgs,
  MutationUpdateProfessionArgs,
  Profession,
  ProfessionInput,
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

const ProfessionsPage = () => {
  const [createProfessionMutation] = useMutation<
    any,
    MutationCreateProfessionArgs
  >(MUTATION_CREATE_PROFESSION, { ignoreResults: true });
  const [updateProfessionMutation] = useMutation<
    any,
    MutationUpdateProfessionArgs
  >(MUTATION_UPDATE_PROFESSION, { ignoreResults: true });
  const [deleteProfessionsMutation] = useMutation<
    any,
    MutationDeleteProfessionsArgs
  >(MUTATION_DELETE_PROFESSIONS, { ignoreResults: true });
  const [dialogType, setDialogType] = useState<DialogType>(DialogType.None);
  const [professionBeingEdited, setProfessionBeingEdited] = useState<
    Maybe<Profession>
  >(null);
  const [selectedProfessions, setSelectedProfessions] = useState<Profession[]>(
    []
  );
  const snackbar = useSnackbar();
  const [{ page, sort, search, ...rest }, setQueryParams] = useQueryParams({
    limit: NumberParam,
    page: withDefault(NumberParam, 0),
    sort: withDefault(SortParam, DEFAULT_SORT),
    search: withDefault(StringParam, ''),
  });
  const limit = validateRowsPerPage(rest.limit);
  const { professions, total, loading, refetch } = useProfessions(
    page,
    limit,
    sort.toString(),
    search
  );

  useUpdateEffect(() => {
    if (selectedProfessions.length > 0) {
      setSelectedProfessions([]);
    }
  }, [professions]);

  const handleFormDialogSubmit = async (input: ProfessionInput) => {
    try {
      if (dialogType === DialogType.Create) {
        await createProfessionMutation({ variables: { input } });
      } else {
        await updateProfessionMutation({
          variables: { input, id: professionBeingEdited?.id ?? -1 },
        });
      }
      await refetch();
      snackbar.enqueueSnackbar(
        dialogType === DialogType.Create
          ? 'Pomyślnie utworzono zawód.'
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

  const handleDeleteProfessions = async () => {
    if (!window.confirm('Czy na pewno chcesz usunąć wybranych zawody?')) {
      return;
    }
    try {
      const ids = selectedProfessions.map(profession => profession.id);
      await deleteProfessionsMutation({ variables: { ids } });
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

  const handleSelect = (checked: boolean, items: Profession[]) => {
    setSelectedProfessions(prevState =>
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
          onClickCreateProfession={() => {
            setProfessionBeingEdited(null);
            setDialogType(DialogType.Create);
          }}
          onChangeSearchValue={val => {
            setQueryParams({ page: 0, search: val });
          }}
        />
        <Table
          selection
          columns={COLUMNS}
          data={professions}
          selected={selectedProfessions}
          onSelect={handleSelect}
          actions={[
            {
              icon: row => {
                return (
                  <IconButton
                    onClick={() => {
                      setProfessionBeingEdited(row);
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
        profession={professionBeingEdited as ProfessionInput}
        onSubmit={handleFormDialogSubmit}
        onClose={() => setDialogType(DialogType.None)}
      />
      <Snackbar
        open={selectedProfessions.length > 0}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        message={`Wybrane zawody: ${selectedProfessions.length}`}
        action={
          <>
            <Button onClick={handleDeleteProfessions} color="secondary">
              Usuń
            </Button>
            <Button
              color="secondary"
              onClick={() => setSelectedProfessions([])}
            >
              Anuluj
            </Button>
          </>
        }
      />
    </Container>
  );
};

export default ProfessionsPage;
