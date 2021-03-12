import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { pick } from 'lodash';
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

const FormDialog = ({
  open,
  onClose,
  profession,
  onSubmit,
}: FormDialogProps) => {
  const editMode = Boolean(profession);
  const { register, handleSubmit, errors } = useForm<ProfessionInput>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const classes = useStyles();

  const _onSubmit = async (data: ProfessionInput) => {
    setIsSubmitting(true);
    const filtered = editMode
      ? pick(
          data,
          Object.keys(data).filter(key => data[key as keyof ProfessionInput])
        )
      : data;
    const success = await onSubmit(filtered);
    setIsSubmitting(false);
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
                message: `Maksymalna długość nazwy zawodu to ${MAX_NAME_LENGTH} znaki.`,
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
