import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { omit, pick } from 'lodash';
import useProfessionAutocomplete from './FormDialog.useProfessionAutocomplete.js';
import { FORMULAS, MAX_NAME_LENGTH } from './constants';
import { Maybe, Qualification, QualificationInput } from 'libs/graphql/types';
import { Input } from './types';

import { makeStyles } from '@material-ui/core/styles';
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
  MenuItem,
  TextField,
} from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';

export interface FormDialogProps extends Pick<DialogProps, 'open'> {
  qualification?: Maybe<Qualification>;
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
    reset,
    setValue,
    formState: { isSubmitting },
  } = useForm<Input>({});
  const {
    professions,
    loading,
    isLoadingSuggestions,
    setSearch,
    autocompleteOptions,
    selectedProfessions,
  } = useProfessionAutocomplete({
    qualificationID: qualification?.id,
    control: control,
  });
  const classes = useStyles();

  useEffect(() => {
    reset({
      professions,
    });
  }, [professions, reset]);

  const prepareDataBeforeSave = (data: Input): QualificationInput => {
    return {
      ...pick(data, ['name', 'description', 'formula', 'code']),
      associateProfession: data.professions
        .filter(
          profession =>
            !professions.some(
              otherProfession => otherProfession.id === profession.id
            )
        )
        .map(profession => profession.id),
      dissociateProfession: professions
        .filter(
          profession =>
            !data.professions.some(
              otherProfession => otherProfession.id === profession.id
            )
        )
        .map(profession => profession.id),
    };
  };

  const _onSubmit = async (data: Input) => {
    const success = await onSubmit(prepareDataBeforeSave(data));
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
          {!loading && (
            <Autocomplete
              multiple
              options={autocompleteOptions}
              getOptionLabel={option => option?.name ?? ''}
              loading={isLoadingSuggestions}
              value={selectedProfessions}
              getOptionDisabled={option => !!option.disabled}
              onChange={(_, opts) => {
                setValue(
                  'professions',
                  opts.map(profession => omit(profession, 'key'))
                );
              }}
              getOptionSelected={(option, value) =>
                option && value && option.id === value.id
              }
              renderInput={params => (
                <TextField
                  {...params}
                  variant="standard"
                  label="Zawody"
                  onChange={e => {
                    setSearch(e.target.value);
                  }}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {isLoadingSuggestions ? (
                          <CircularProgress color="inherit" size={20} />
                        ) : null}
                      </>
                    ),
                  }}
                />
              )}
            />
          )}
          {selectedProfessions.map((profession, index) => {
            return (
              <input
                type="hidden"
                key={profession.id}
                name={`professions[${index}].id`}
                ref={register({ valueAsNumber: true })}
                defaultValue={profession.id}
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
