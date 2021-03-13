import { useForm } from 'react-hook-form';
import { pick } from 'lodash';
import { MAX_NAME_LENGTH } from './constants';
import { QuestionInput, Question } from 'libs/graphql/types';

import { makeStyles } from '@material-ui/core/styles';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
  TextField,
} from '@material-ui/core';
import { Maybe } from 'graphql/jsutils/Maybe';

export interface FormDialogProps extends Pick<DialogProps, 'open'> {
  question?: Maybe<Question>;
  onClose: () => void;
  onSubmit: (input: QuestionInput) => Promise<boolean> | boolean;
}

const FormDialog = ({ open, onClose, question, onSubmit }: FormDialogProps) => {
  const editMode = Boolean(question);
  const {
    register,
    handleSubmit,
    errors,
    formState: { isSubmitting },
  } = useForm<QuestionInput>({});
  const classes = useStyles();

  const _onSubmit = async (data: QuestionInput) => {
    const filtered = editMode
      ? pick(
          data,
          Object.keys(data).filter(key => data[key as keyof QuestionInput])
        )
      : data;
    const success = await onSubmit(filtered);
    if (success) {
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={isSubmitting ? undefined : onClose}
      fullWidth
      maxWidth="xs"
    >
      <form onSubmit={handleSubmit(_onSubmit)}>
        <DialogTitle>
          {editMode ? 'Edycja pytania' : 'Tworzenie pytania'}
        </DialogTitle>
        <DialogContent className={classes.dialogContent}>
          <TextField
            fullWidth
            label="Treść pytania"
            name="name"
            defaultValue={question?.content}
            inputRef={register({
              required: 'Te pole jest wymagane.',
              maxLength: {
                value: MAX_NAME_LENGTH,
                message: `Maksymalna długość nazwy zawodu to ${MAX_NAME_LENGTH} znaki.`,
              },
            })}
            error={!!errors.content}
            helperText={errors.content?.message ?? ''}
          />
        </DialogContent>
        <DialogActions>
          <Button
            color="secondary"
            type="button"
            variant="contained"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Anuluj
          </Button>
          <Button
            type="submit"
            color="primary"
            variant="contained"
            disabled={isSubmitting}
          >
            {editMode ? 'Zapisz' : 'Utwórz'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

const useStyles = makeStyles(theme => ({
  dialogContent: {
    '& > *:not(:last-child)': {
      marginBottom: theme.spacing(1),
    },
  },
}));

export default FormDialog;
