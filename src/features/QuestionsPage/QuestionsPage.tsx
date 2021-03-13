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
import useQuestions from './QuestionsPage.useQuestions';
import { validateRowsPerPage } from 'common/Table/helpers';
import {
  MUTATION_CREATE_QUESTION,
  MUTATION_UPDATE_QUESTION,
  MUTATION_DELETE_QUESTIONS,
} from './mutations';

import { COLUMNS, DEFAULT_SORT, DialogType } from './constants';
import {
  Maybe,
  MutationCreateQuestionArgs,
  MutationDeleteQuestionsArgs,
  MutationUpdateQuestionArgs,
  Question,
  QuestionInput,
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

const QuestionsPage = () => {
  const [createQuestionMutation] = useMutation<any, MutationCreateQuestionArgs>(
    MUTATION_CREATE_QUESTION,
    { ignoreResults: true }
  );
  const [updateQuestionMutation] = useMutation<any, MutationUpdateQuestionArgs>(
    MUTATION_UPDATE_QUESTION,
    { ignoreResults: true }
  );
  const [deleteQuestionsMutation] = useMutation<
    any,
    MutationDeleteQuestionsArgs
  >(MUTATION_DELETE_QUESTIONS, { ignoreResults: true });
  const [dialogType, setDialogType] = useState<DialogType>(DialogType.None);
  const [questionBeingEdited, setQuestionBeingEdited] = useState<
    Maybe<Question>
  >(null);
  const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([]);
  const snackbar = useSnackbar();
  const [{ page, sort, search, ...rest }, setQueryParams] = useQueryParams({
    limit: NumberParam,
    page: withDefault(NumberParam, 0),
    sort: withDefault(SortParam, DEFAULT_SORT),
    search: withDefault(StringParam, ''),
  });
  const limit = validateRowsPerPage(rest.limit);
  const { questions, total, loading, refetch } = useQuestions(
    page,
    limit,
    sort.toString(),
    search
  );

  useUpdateEffect(() => {
    if (selectedQuestions.length > 0) {
      setSelectedQuestions([]);
    }
  }, [questions]);

  const handleFormDialogSubmit = async (input: QuestionInput) => {
    try {
      if (dialogType === DialogType.Create) {
        await createQuestionMutation({ variables: { input } });
      } else {
        await updateQuestionMutation({
          variables: { input, id: questionBeingEdited?.id ?? -1 },
        });
      }
      await refetch();
      snackbar.enqueueSnackbar(
        dialogType === DialogType.Create
          ? 'Pomyślnie utworzono pytanie.'
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

  const handleDeleteQuestions = async () => {
    if (!window.confirm('Czy na pewno chcesz usunąć wybrane zawody?')) {
      return;
    }
    try {
      const ids = selectedQuestions.map(question => question.id);
      await deleteQuestionsMutation({ variables: { ids } });
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

  const handleSelect = (checked: boolean, items: Question[]) => {
    setSelectedQuestions(prevState =>
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
          onClickCreateQuestion={() => {
            setQuestionBeingEdited(null);
            setDialogType(DialogType.Create);
          }}
          onChangeSearchValue={val => {
            setQueryParams({ page: 0, search: val });
          }}
        />
        <Table
          selection
          columns={COLUMNS}
          data={questions}
          selected={selectedQuestions}
          onSelect={handleSelect}
          actions={[
            {
              icon: row => {
                return (
                  <IconButton
                    onClick={() => {
                      setQuestionBeingEdited(row);
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
        question={questionBeingEdited}
        onSubmit={handleFormDialogSubmit}
        onClose={() => setDialogType(DialogType.None)}
      />
      <Snackbar
        open={selectedQuestions.length > 0}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        message={`Wybrane pytania: ${selectedQuestions.length}`}
        action={
          <>
            <Button onClick={handleDeleteQuestions} color="secondary">
              Usuń
            </Button>
            <Button color="secondary" onClick={() => setSelectedQuestions([])}>
              Anuluj
            </Button>
          </>
        }
      />
    </Container>
  );
};

export default QuestionsPage;
