import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { pick } from 'lodash';
import { MAX_NAME_LENGTH, FORMULAS } from './constants';
import { QualificationInput } from 'libs/graphql/types';

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

export interface FormDialogProps extends Pick<DialogProps, 'open'> {
  qualification?: QualificationInput;
  onClose: () => void;
  onSubmit: (input: QualificationInput) => Promise<boolean> | boolean;
}

const FormDialog = ({
  open,
  onClose,
  qualification,
  onSubmit,
}: FormDialogProps) => {
  const editMode = Boolean(qualification);
  const {
    register,
    handleSubmit,
    errors,
    control,
  } = useForm<QualificationInput>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const classes = useStyles();

  const _onSubmit = async (data: QualificationInput) => {
    setIsSubmitting(true);
    const filtered = editMode
      ? pick(
          data,
          Object.keys(data).filter(key => data[key as keyof QualificationInput])
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
          {editMode ? 'Edycja kwalifikacji' : 'Tworzenie kwalifikacji'}
        </DialogTitle>
        <DialogContent className={classes.dialogContent}>
          <TextField
            fullWidth
            label="Nazwa kwalifikacji"
            name="name"
            defaultValue={qualification?.name}
            inputRef={register({
              required: 'Te pole jest wymagane.',
              maxLength: {
                value: MAX_NAME_LENGTH,
                message: `Maksymalna długość nazwy kwalifikacji to ${MAX_NAME_LENGTH} znaki.`,
              },
            })}
            error={!!errors.name?.message}
            helperText={errors.name?.message ?? ''}
          />
          <TextField
            fullWidth
            label="Oznaczenie kwalifikacji"
            name="code"
            defaultValue={qualification?.code}
            inputRef={register({
              required: 'Te pole jest wymagane.',
            })}
            error={!!errors.code?.message}
            helperText={errors.code?.message ?? ''}
          />
          <Controller
            name="formula"
            defaultValue={qualification?.formula ?? FORMULAS[0]}
            control={control}
            as={
              <TextField select fullWidth label="Formuła">
                {FORMULAS.map(formula => (
                  <MenuItem key={formula} value={formula}>
                    {formula}
                  </MenuItem>
                ))}
              </TextField>
            }
          />
          <TextField
            fullWidth
            label="Opis"
            name="description"
            defaultValue={qualification?.description}
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
