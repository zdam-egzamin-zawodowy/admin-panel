import { useForm } from 'react-hook-form';
import { pick } from 'lodash';
import { polishPlurals } from 'polish-plurals';
import { MAX_NAME_LENGTH } from './constants';
import { ProfessionInput } from 'libs/graphql/types';

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

export interface FormDialogProps extends Pick<DialogProps, 'open'> {
  profession?: ProfessionInput;
  onClose: () => void;
  onSubmit: (input: ProfessionInput) => Promise<boolean> | boolean;
}

const Form = ({ onClose, profession, onSubmit }: FormDialogProps) => {
  const editMode = Boolean(profession);
  const {
    register,
    handleSubmit,
    errors,
    formState: { isSubmitting },
  } = useForm<ProfessionInput>({});
  const classes = useStyles();

  const _onSubmit = async (data: ProfessionInput) => {
    const filtered = editMode
      ? pick(
          data,
          Object.keys(data).filter(key => data[key as keyof ProfessionInput])
        )
      : data;
    const success = await onSubmit(filtered);
    if (success) {
      onClose();
    }
  };

  return (
    <form onSubmit={handleSubmit(_onSubmit)}>
      <DialogTitle>
        {editMode ? 'Edycja zawodu' : 'Tworzenie zawodu'}
      </DialogTitle>
      <DialogContent className={classes.dialogContent}>
        <TextField
          fullWidth
          label="Nazwa zawodu"
          name="name"
          defaultValue={profession?.name}
          inputRef={register({
            required: 'Te pole jest wymagane.',
            maxLength: {
              value: MAX_NAME_LENGTH,
              message: `Maksymalna długość nazwy zawodu to ${MAX_NAME_LENGTH} ${polishPlurals(
                'znak',
                'znaki',
                'znaków',
                MAX_NAME_LENGTH
              )}.`,
            },
          })}
          error={!!errors.name}
          helperText={errors.name ? errors.name.message : ''}
        />
        <TextField
          fullWidth
          label="Opis"
          name="description"
          defaultValue={profession?.description}
          inputRef={register}
          multiline
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
  );
};

const useStyles = makeStyles(theme => ({
  dialogContent: {
    '& > *:not(:last-child)': {
      marginBottom: theme.spacing(1),
    },
  },
}));

const FormDialog = (props: FormDialogProps) => {
  const { onClose, open } = props;
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      keepMounted={false}
    >
      <Form {...props} />
    </Dialog>
  );
};

export default FormDialog;
