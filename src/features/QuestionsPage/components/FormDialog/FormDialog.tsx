import { useForm, Controller } from 'react-hook-form';
import { pick } from 'lodash';
import { QuestionInput, Question, Maybe, Answer } from 'libs/graphql/types';

import { makeStyles } from '@material-ui/core/styles';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
  MenuItem,
  TextField,
} from '@material-ui/core';

const ANSWERS = Object.keys(Answer);

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
    control,
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
            name="content"
            multiline
            defaultValue={question?.content}
            inputRef={register({
              required: 'Te pole jest wymagane.',
            })}
            error={!!errors.content}
            helperText={errors.content?.message ?? ''}
          />
          <TextField
            fullWidth
            label="Z"
            name="from"
            defaultValue={question?.from}
            inputRef={register({
              required: 'Te pole jest wymagane.',
            })}
            error={!!errors.from}
            helperText={errors.from?.message ?? ''}
          />
          <TextField
            fullWidth
            label="Wyjaśnienie"
            name="explanation"
            multiline
            defaultValue={question?.explanation}
            inputRef={register}
            error={!!errors.explanation}
            helperText={errors.explanation?.message ?? ''}
          />
          <Controller
            name="correctAnswer"
            defaultValue={question?.correctAnswer ?? ANSWERS[0]}
            control={control}
            as={
              <TextField select fullWidth label="Poprawna odpowiedź">
                {ANSWERS.map(answer => (
                  <MenuItem key={answer} value={answer}>
                    {answer}
                  </MenuItem>
                ))}
              </TextField>
            }
          />
          {ANSWERS.map(answer => {
            const upper = answer.toUpperCase();
            return (
              //(question as any)[`answer${upper}`]
              <TextField
                fullWidth
                key={upper}
                label={`Odpowiedź ${upper}`}
                name={`answer${upper}`}
                multiline
                defaultValue={
                  question ? question[`answer${upper}` as keyof Question] : ''
                }
                inputRef={register({
                  required: 'Te pole jest wymagane.',
                })}
                error={!!errors[`answer${upper}` as keyof QuestionInput]}
                helperText={
                  errors[`answer${upper}` as keyof QuestionInput]?.message ?? ''
                }
              />
            );
          })}
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
