import { useForm } from 'react-hook-form';
import { pick } from 'lodash';
import { polishPlurals } from 'polish-plurals';
import isEmail from 'validator/es/lib/isEmail';
import { formatRole } from '../../utils';
import {
  MAX_DISPLAY_NAME_LENGTH,
  MAX_PASSWORD_LENGTH,
  MIN_DISPLAY_NAME_LENGTH,
  MIN_PASSWORD_LENGTH,
} from './constants';
import { Role, UserInput } from 'libs/graphql/types';

import { makeStyles } from '@material-ui/core/styles';
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
} from '@material-ui/core';

export interface FormDialogProps extends Pick<DialogProps, 'open'> {
  user?: UserInput;
  onClose: () => void;
  onSubmit: (input: UserInput) => Promise<boolean> | boolean;
}

const FormDialog = ({ open, onClose, user, onSubmit }: FormDialogProps) => {
  const editMode = Boolean(user);
  const {
    register,
    handleSubmit,
    errors,
    formState: { isSubmitting },
  } = useForm<UserInput>({});
  const classes = useStyles();

  const _onSubmit = async (data: UserInput) => {
    const filtered = editMode
      ? pick(
          data,
          Object.keys(data).filter(key => data[key as keyof UserInput])
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
      onClose={onClose}
      fullWidth
      disableBackdropClick={isSubmitting}
      maxWidth="xs"
    >
      <form onSubmit={handleSubmit(_onSubmit)}>
        <DialogTitle>
          {editMode ? 'Edycja użytkownika' : 'Tworzenie użytkownika'}
        </DialogTitle>
        <DialogContent className={classes.dialogContent}>
          <TextField
            fullWidth
            label="Nazwa użytkownika"
            name="displayName"
            defaultValue={user?.displayName}
            inputRef={register({
              required: 'Te pole jest wymagane.',
              minLength: {
                value: MIN_DISPLAY_NAME_LENGTH,
                message: 'Te pole jest wymagane.',
              },
              maxLength: {
                value: MAX_DISPLAY_NAME_LENGTH,
                message: `Maksymalna długość nazwy użytkownika to ${MAX_DISPLAY_NAME_LENGTH} ${polishPlurals(
                  'znak',
                  'znaki',
                  'znaków',
                  MAX_DISPLAY_NAME_LENGTH
                )}.`,
              },
            })}
            error={!!errors.displayName}
            helperText={errors.displayName ? errors.displayName.message : ''}
          />
          <TextField
            fullWidth
            label="Adres e-mail"
            name="email"
            defaultValue={user?.email}
            inputRef={register({
              required: 'Te pole jest wymagane.',
              validate: (email: string) => {
                return isEmail(email ?? '')
                  ? true
                  : 'Niepoprawny adres e-mail.';
              },
            })}
            error={!!errors.email}
            helperText={errors.email ? errors.email.message : ''}
          />
          <TextField
            fullWidth
            label="Hasło"
            type="password"
            name="password"
            inputRef={register({
              required: editMode ? false : 'Te pole jest wymagane.',
              minLength: {
                value: MIN_PASSWORD_LENGTH,
                message: `Hasło musi zawierać co najmniej ${MIN_PASSWORD_LENGTH} ${polishPlurals(
                  'znak',
                  'znaki',
                  'znaków',
                  MIN_PASSWORD_LENGTH
                )}.`,
              },
              maxLength: {
                value: MAX_PASSWORD_LENGTH,
                message: `Hasło może zawierać co najwyżej ${MAX_PASSWORD_LENGTH} ${polishPlurals(
                  'znak',
                  'znaki',
                  'znaków',
                  MAX_PASSWORD_LENGTH
                )}.`,
              },
            })}
            error={!!errors.password}
            helperText={errors.password ? errors.password.message : ''}
          />
          <FormControl>
            <FormLabel>Rola</FormLabel>
            <RadioGroup name="role" defaultValue={user?.role ?? Role.User}>
              {Object.values(Role).map(role => {
                return (
                  <FormControlLabel
                    value={role}
                    key={role}
                    name="role"
                    control={<Radio inputRef={register} />}
                    label={formatRole(role)}
                  />
                );
              })}
            </RadioGroup>
          </FormControl>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  inputRef={register}
                  name="activated"
                  defaultChecked={user?.activated ?? false}
                />
              }
              label="Aktywowany"
            />
          </FormGroup>
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
